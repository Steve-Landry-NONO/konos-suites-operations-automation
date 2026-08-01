import { Client } from "@notionhq/client";

type IncidentNotificationResult = {
  sent: boolean;
  interventionId: string;
};

let client: Client | null = null;

function getNotionClient(): Client {
  const token = process.env.NOTION_TOKEN?.trim();

  if (!token) {
    throw new Error("NOTION_TOKEN est absent.");
  }

  if (!client) {
    client = new Client({ auth: token });
  }

  return client;
}

function getWebhookUrl(): string {
  const url = process.env.N8N_INCIDENT_WEBHOOK_URL?.trim();

  if (!url) {
    throw new Error("N8N_INCIDENT_WEBHOOK_URL est absent.");
  }

  return url;
}

function getProperties(page: any): Record<string, any> {
  if (!page?.properties) {
    throw new Error("Réponse Notion inattendue : propriétés absentes.");
  }

  return page.properties;
}

function titleValue(property: any): string {
  return Array.isArray(property?.title)
    ? property.title.map((item: any) => item?.plain_text ?? "").join("")
    : "";
}

function textValue(property: any): string {
  return Array.isArray(property?.rich_text)
    ? property.rich_text.map((item: any) => item?.plain_text ?? "").join("")
    : "";
}

function selectValue(property: any): string {
  return property?.select?.name ?? property?.status?.name ?? "";
}

function relationIds(property: any): string[] {
  return Array.isArray(property?.relation)
    ? property.relation
        .map((item: any) => item?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

export async function notifyIncidentProblem(
  taskId: string,
): Promise<IncidentNotificationResult> {
  const notion = getNotionClient();
  const webhookUrl = getWebhookUrl();

  const taskPage: any = await notion.pages.retrieve({
    page_id: taskId,
  });

  const taskProperties = getProperties(taskPage);
  const interventionIds = relationIds(taskProperties["Intervention"]);

  if (interventionIds.length === 0) {
    throw new Error(
      "Impossible d’envoyer l’alerte : aucune intervention liée.",
    );
  }

  const interventionId = interventionIds[0];

  const interventionPage: any = await notion.pages.retrieve({
    page_id: interventionId,
  });

  const interventionProperties = getProperties(interventionPage);

  const payload = {
    event: "field_task_problem",
    occurredAt: new Date().toISOString(),
    task: {
      id: taskId,
      title: titleValue(taskProperties["Tâche"]),
      section: selectValue(taskProperties["Section"]),
      comment: textValue(taskProperties["Commentaire"]),
      reportedBy:
        textValue(taskProperties["Réalisé par"]) ||
        "Intervenant non renseigné",
      automationId: textValue(taskProperties["ID automatisation"]),
    },
    intervention: {
      id: interventionId,
      title: titleValue(interventionProperties["Intervention"]),
      automationId: textValue(
        interventionProperties["ID automatisation"],
      ),
      status: selectValue(interventionProperties["Statut"]),
      date:
        interventionProperties["Date intervention"]?.date?.start ?? "",
    },
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(
      `n8n a répondu avec le statut HTTP ${response.status}.`,
    );
  }

  await notion.pages.update({
    page_id: interventionId,
    properties: {
      "Steve prévenu": {
        checkbox: true,
      },
    },
  });

  return {
    sent: true,
    interventionId,
  };
}
