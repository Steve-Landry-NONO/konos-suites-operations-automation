import Link from "next/link";

const TEST_INTERVENTION_ID =
  "3af21878-baca-8135-890d-cd964a5fff82";

export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="brand-header">
        <div className="brand-mark">KS</div>
        <div>
          <strong>KONOS SUITES</strong>
          <small>Application des interventions terrain</small>
        </div>
      </header>

      <section className="hero">
        <span className="automation-id">APPLICATION TERRAIN</span>
        <h1>Ouvrir une mission</h1>
        <p>
          Chaque mission réelle sera accessible depuis son lien unique.
        </p>
      </section>

      <section className="card">
        <strong>Environnement de test</strong>
        <p>
          Ce bouton ouvre uniquement l’intervention utilisée pour les
          validations techniques.
        </p>

        <Link
          className="primary-link"
          href={`/interventions/${TEST_INTERVENTION_ID}`}
        >
          Ouvrir la mission de test
        </Link>
      </section>
    </main>
  );
}
