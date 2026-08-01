const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2026-03-11";
const MAX_PHOTO_SIZE = 20 * 1024 * 1024;

type NotionFileObject = {
  name?: string;
  type?: "file" | "external";
  file?: {
    url: string;
    expiry_time?: string;
  };
  external?: {
    url: string;
  };
};

function getToken(): string {
  const token = process.env.NOTION_TOKEN?.trim();

  if (!token) {
    throw new Error("NOTION_TOKEN est absent de .env.local.");
  }

  return token;
}

function notionHeaders(contentType = "application/json"): HeadersInit {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": contentType,
  };
}

async function readJson(response: Response): Promise<any> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Erreur Notion (${response.status}).`;

    throw new Error(message);
  }

  return payload;
}

function sanitizeFilename(filename: string): string {
  const normalized = filename
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `photo-${Date.now()}.jpg`;
}

function validatePhoto(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier sélectionné doit être une image.");
  }

  if (file.size <= 0) {
    throw new Error("Le fichier sélectionné est vide.");
  }

  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error("La photo dépasse la limite de 20 Mo.");
  }
}

async function retrieveTaskPage(taskId: string): Promise<any> {
  const response = await fetch(`${NOTION_API_BASE}/pages/${taskId}`, {
    method: "GET",
    headers: notionHeaders(),
    cache: "no-store",
  });

  return readJson(response);
}

async function createUpload(file: File, filename: string): Promise<any> {
  const response = await fetch(`${NOTION_API_BASE}/file_uploads`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      mode: "single_part",
      filename,
      content_type: file.type,
    }),
  });

  return readJson(response);
}

async function sendUpload(
  uploadId: string,
  file: File,
  filename: string,
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file, filename);

  const response = await fetch(
    `${NOTION_API_BASE}/file_uploads/${uploadId}/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Notion-Version": NOTION_VERSION,
      },
      body: formData,
    },
  );

  return readJson(response);
}

function existingFilesForUpdate(files: NotionFileObject[]): any[] {
  return files
    .map((item) => {
      if (item.type === "file" && item.file?.url) {
        return {
          name: item.name || "Photo existante",
          type: "file",
          file: {
            url: item.file.url,
          },
        };
      }

      if (item.type === "external" && item.external?.url) {
        return {
          name: item.name || "Photo externe",
          type: "external",
          external: {
            url: item.external.url,
          },
        };
      }

      return null;
    })
    .filter(Boolean);
}

async function attachUploadToTask(
  taskId: string,
  uploadId: string,
  filename: string,
  existingFiles: NotionFileObject[],
): Promise<void> {
  const files = [
    ...existingFilesForUpdate(existingFiles),
    {
      name: filename,
      type: "file_upload",
      file_upload: {
        id: uploadId,
      },
    },
  ];

  const response = await fetch(`${NOTION_API_BASE}/pages/${taskId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({
      properties: {
        Photos: {
          type: "files",
          files,
        },
      },
    }),
  });

  await readJson(response);
}

export async function uploadTaskPhoto(
  taskId: string,
  file: File,
): Promise<{ filename: string; photoCount: number }> {
  validatePhoto(file);

  const page = await retrieveTaskPage(taskId);
  const currentFiles: NotionFileObject[] =
    page?.properties?.Photos?.files ?? [];

  const filename = sanitizeFilename(file.name);
  const upload = await createUpload(file, filename);

  if (!upload?.id) {
    throw new Error("Notion n’a pas retourné d’identifiant d’upload.");
  }

  await sendUpload(upload.id, file, filename);
  await attachUploadToTask(
    taskId,
    upload.id,
    filename,
    currentFiles,
  );

  return {
    filename,
    photoCount: currentFiles.length + 1,
  };
}
