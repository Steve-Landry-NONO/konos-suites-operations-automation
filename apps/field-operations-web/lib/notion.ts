import { Client } from "@notionhq/client";

const TEST_INTERVENTION_PAGE_ID =
  "3af21878-baca-8135-890d-cd964a5fff82";

let client: Client | null = null;

export const TASK_STATUSES = [
  "À faire",
  "En cours",
  "Fait",
  "Problème",
  "Non applicable",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type FieldTask = {
  id: string;
  title: string;
  section: string;
  instruction: string;
  status: TaskStatus;
  order: number;
  required: boolean;
  photoRequired: boolean;
  condition: string;
  automationId: string;
  checklistVersion: string;
  comment: string;
  completedBy: string;
  completedAt: string;
};

export type FieldIntervention = {
  id: string;
  title: string;
  automationId: string;
  status: string;
  travelers: number;
  nights: number;
  bedroomBed: boolean;
  sofaBed: boolean;
  bedroomSets: number;
  sofaSets: number;
  towels: number;
  pillowcases: number;
  bathMats: number;
  kitchenTowels: number;
  water: number;
  coffeeCapsules: number;
  wcRolls: number;
  kitchenBags: number;
  wcBags: number;
  checklistVersion: string;
  tasks: FieldTask[];
};

export type UpdateTaskInput = {
  status: TaskStatus;
  comment?: string;
  completedBy?: string;
};

function getNotionClient(): Client {
  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) throw new Error("NOTION_TOKEN est absent de .env.local.");

  if (!client) client = new Client({ auth: token });
  return client;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} est absent de .env.local.`);
  return value;
}

function getProperties(page: unknown): Record<string, any> {
  if (
    typeof page !== "object" ||
    page === null ||
    !("properties" in page) ||
    typeof (page as any).properties !== "object"
  ) {
    throw new Error("Réponse Notion inattendue : propriétés absentes.");
  }
  return (page as any).properties;
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

function numberValue(property: any): number {
  return typeof property?.number === "number" ? property.number : 0;
}

function checkboxValue(property: any): boolean {
  return property?.checkbox === true;
}

function relationIds(property: any): string[] {
  return Array.isArray(property?.relation)
    ? property.relation
        .map((item: any) => item?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

function dateValue(property: any): string {
  return property?.date?.start ?? "";
}

function normalizeStatus(value: string): TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus)
    ? (value as TaskStatus)
    : "À faire";
}

function richText(content: string) {
  return content
    ? [{ type: "text" as const, text: { content } }]
    : [];
}

function mapTask(page: any): FieldTask {
  const properties = getProperties(page);

  return {
    id: page.id,
    title: titleValue(properties["Tâche"]),
    section: selectValue(properties["Section"]),
    instruction: textValue(properties["Instruction"]),
    status: normalizeStatus(selectValue(properties["Statut"])),
    order: numberValue(properties["Ordre"]),
    required: checkboxValue(properties["Obligatoire"]),
    photoRequired: checkboxValue(properties["Photo obligatoire"]),
    condition: textValue(properties["Condition d’affichage"]),
    automationId: textValue(properties["ID automatisation"]),
    checklistVersion:
      textValue(properties["Version checklist"]) || "MVP-1.0",
    comment: textValue(properties["Commentaire"]),
    completedBy: textValue(properties["Réalisé par"]),
    completedAt: dateValue(properties["Réalisé le"]),
  };
}

export async function loadFieldIntervention(
  interventionPageId = TEST_INTERVENTION_PAGE_ID,
): Promise<FieldIntervention> {
  const notion = getNotionClient();
  const tasksDataSourceId = requireEnv("NOTION_TASKS_DATA_SOURCE_ID");

  const interventionPage = await notion.pages.retrieve({
    page_id: interventionPageId,
  });
  const interventionProperties = getProperties(interventionPage);

  const taskResponse = await notion.dataSources.query({
    data_source_id: tasksDataSourceId,
    filter: {
      property: "Intervention",
      relation: { contains: interventionPageId },
    },
    sorts: [{ property: "Ordre", direction: "ascending" }],
    page_size: 100,
  });

  const tasks = taskResponse.results
    .filter((result: any) => result?.object === "page")
    .map(mapTask);

  const taskVersion =
    tasks.find((task) => task.checklistVersion)?.checklistVersion || "MVP-1.0";

  return {
    id: interventionPageId,
    title: titleValue(interventionProperties["Intervention"]),
    automationId: textValue(interventionProperties["ID automatisation"]),
    status: selectValue(interventionProperties["Statut"]),
    travelers: numberValue(interventionProperties["Nb voyageurs"]),
    nights: numberValue(interventionProperties["Nb nuits"]),
    bedroomBed: checkboxValue(interventionProperties["Lit chambre à préparer"]),
    sofaBed: checkboxValue(interventionProperties["Canapé-lit à préparer"]),
    bedroomSets: numberValue(interventionProperties["Jeux chambre à prendre"]),
    sofaSets: numberValue(interventionProperties["Jeux canapé à prendre"]),
    towels: numberValue(interventionProperties["Serviettes à prendre"]),
    pillowcases: numberValue(interventionProperties["Taies à prendre"]),
    bathMats: numberValue(interventionProperties["Tapis bain à prendre"]),
    kitchenTowels: numberValue(interventionProperties["Torchons à prendre"]),
    water: numberValue(interventionProperties["Bouteilles eau à installer"]),
    coffeeCapsules: numberValue(
      interventionProperties["Capsules T-disc à installer"],
    ),
    wcRolls: numberValue(interventionProperties["Rouleaux WC à installer"]),
    kitchenBags: numberValue(interventionProperties["Sacs cuisine à prévoir"]),
    wcBags: numberValue(interventionProperties["Sacs WC à prévoir"]),
    checklistVersion:
      textValue(interventionProperties["Version checklist"]) || taskVersion,
    tasks,
  };
}

async function assertMissionCanBeCompleted(taskPage: any): Promise<void> {
  const notion = getNotionClient();
  const task = mapTask(taskPage);

  if (task.automationId.split(":").at(-1) !== "mission-complete") return;

  const properties = getProperties(taskPage);
  const interventionIds = relationIds(properties["Intervention"]);
  if (interventionIds.length === 0) {
    throw new Error("La tâche de clôture n’est reliée à aucune intervention.");
  }

  const tasksDataSourceId = requireEnv("NOTION_TASKS_DATA_SOURCE_ID");
  const response = await notion.dataSources.query({
    data_source_id: tasksDataSourceId,
    filter: {
      property: "Intervention",
      relation: { contains: interventionIds[0] },
    },
    page_size: 100,
  });

  const blockingTasks = response.results
    .filter((result: any) => result?.object === "page" && result.id !== task.id)
    .map(mapTask)
    .filter(
      (item) =>
        item.required &&
        item.status !== "Fait" &&
        item.status !== "Non applicable",
    );

  if (blockingTasks.length > 0) {
    throw new Error(
      `Clôture impossible : ${blockingTasks.length} tâche(s) obligatoire(s) restent à terminer.`,
    );
  }
}

export async function updateFieldTask(
  taskId: string,
  input: UpdateTaskInput,
): Promise<FieldTask> {
  const notion = getNotionClient();

  const currentPage = await notion.pages.retrieve({ page_id: taskId });

  if (input.status === "Fait") {
    await assertMissionCanBeCompleted(currentPage);
  }

  const isCompleted = input.status === "Fait";
  const now = new Date().toISOString();

  const updatedPage = await notion.pages.update({
    page_id: taskId,
    properties: {
      Statut: {
        select: { name: input.status },
      },
      Commentaire: {
        rich_text: richText((input.comment ?? "").trim()),
      },
      "Réalisé par": {
        rich_text: richText((input.completedBy ?? "").trim()),
      },
      "Réalisé le": isCompleted
        ? { date: { start: now } }
        : { date: null },
    },
  });

  return mapTask(updatedPage);
}
