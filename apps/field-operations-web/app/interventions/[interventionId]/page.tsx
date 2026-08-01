import { notFound } from "next/navigation";
import TaskChecklist from "../../components/task-checklist";
import { loadFieldIntervention } from "../../../lib/notion";

type PageProps = {
  params: Promise<{
    interventionId: string;
  }>;
};

function bedSummary(
  bedroomBed: boolean,
  sofaBed: boolean,
): string {
  const beds = [];

  if (bedroomBed) beds.push("lit principal");
  if (sofaBed) beds.push("canapé-lit");

  return beds.length > 0 ? beds.join(" + ") : "aucun couchage à préparer";
}

export default async function InterventionPage({
  params,
}: PageProps) {
  const { interventionId } = await params;

  if (!interventionId) {
    notFound();
  }

  try {
    const intervention = await loadFieldIntervention(interventionId);

    return (
      <main className="app-shell">
        <header className="brand-header">
          <div className="brand-mark">KS</div>
          <div>
            <strong>KONOS SUITES</strong>
            <small>Mission terrain · données Notion</small>
          </div>
        </header>

        <section className="hero">
          <span className="automation-id">
            {intervention.automationId || intervention.id}
          </span>
          <h1>Préparer l’appartement</h1>
          <p>
            {intervention.travelers} voyageur
            {intervention.travelers > 1 ? "s" : ""} ·{" "}
            {bedSummary(
              intervention.bedroomBed,
              intervention.sofaBed,
            )}
          </p>
        </section>

        <TaskChecklist
          initialTasks={intervention.tasks}
          checklistVersion={intervention.checklistVersion}
        />
      </main>
    );
  } catch (error) {
    console.error("Chargement de l’intervention impossible :", error);
    notFound();
  }
}
