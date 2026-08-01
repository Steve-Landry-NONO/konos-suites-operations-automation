import { Client } from "@notionhq/client";

let client: Client | null = null;

export function getNotionClient(): Client {
  const token = process.env.NOTION_TOKEN;

  if (!token) {
    throw new Error("NOTION_TOKEN est absent de l'environnement serveur.");
  }

  if (!client) {
    client = new Client({ auth: token });
  }

  return client;
}
