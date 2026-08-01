import TaskChecklist from "./components/task-checklist";
import { loadFieldIntervention } from "../lib/notion";

export const dynamic = "force-dynamic";

function beddingLabel(bedroomBed: boolean, sofaBed: boolean): string {
  if (bedroomBed && sofaBed) {
    return "lit principal + canapé-lit";
  }

  if (sofaBed) {
    return "canapé-lit";
  }

  if (bedroomBed) {
    return "lit principal";
  }

  return "couchage à confirmer";
}

export default async function HomePage() {
  try {
    const intervention = await loadFieldIntervention();

    return (
      <main className="shell">
        <header className="header">
          <div className="logo">KS</div>
          <div>
            <h1>KONOS SUITES</h1>
            <p>Mission terrain · données Notion</p>
          </div>
        </header>

        <section className="hero">
          <span className="pill">
            {intervention.automationId || "INTERVENTION"}
          </span>

          <h2>Préparer l’appartement</h2>

          <p>
            {intervention.travelers} voyageur
            {intervention.travelers > 1 ? "s" : ""} ·{" "}
            {beddingLabel(
              intervention.bedroomBed,
              intervention.sofaBed,
            )}
          </p>
        </section>

        {intervention.tasks.length === 0 ? (
          <section className="card">
            <strong>Aucune tâche trouvée</strong>
            <p>
              Vérifiez le partage des bases Notion et la relation
              Intervention.
            </p>
          </section>
        ) : (
          <TaskChecklist
            initialTasks={intervention.tasks}
            checklistVersion={intervention.checklistVersion}
          />
        )}
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur Notion inconnue.";

    console.error("Chargement Notion impossible :", error);

    return (
      <main className="shell">
        <header className="header">
          <div className="logo">KS</div>
          <div>
            <h1>KONOS SUITES</h1>
            <p>Mission terrain · connexion Notion</p>
          </div>
        </header>

        <section className="card error-card">
          <strong>Connexion Notion impossible</strong>
          <p>{message}</p>
          <p>
            Vérifiez le token, les identifiants de data source et les
            autorisations de l’intégration Notion, puis redémarrez le
            serveur.
          </p>
        </section>
      </main>
    );
  }
}
