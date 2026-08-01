const demoTasks = [
  ["Accès et cave", "Récupérer le linge propre à la cave"],
  ["Constat initial", "Faire le constat initial du logement"],
  ["Chambre", "Préparer le lit de la chambre"],
  ["Salon", "Préparer le canapé-lit"],
  ["Cuisine", "Installer les consommables cuisine"],
  ["Salle de bain", "Préparer les serviettes et le tapis de bain"],
  ["WC et entrée", "Installer les consommables WC"],
  ["Contrôle final", "Vérifier les clés et la boîte à clés"],
  ["Contrôle final", "Contrôler chaque pièce avant clôture"],
  ["Contrôle final", "Confirmer la fin de mission"],
] as const;

export default function HomePage() {
  return (
    <main className="shell">
      <header className="header">
        <div className="logo">KS</div>
        <div>
          <h1>KONOS SUITES</h1>
          <p>Mission terrain · socle Next.js</p>
        </div>
      </header>

      <section className="hero">
        <span className="pill">TEST-TC11-002</span>
        <h2>Préparer l’appartement</h2>
        <p>3 voyageurs · lit principal + canapé-lit</p>
      </section>

      <section className="card">
        <div className="row"><strong>Checklist MVP-1.0</strong><span>0 / 10</span></div>
        <div className="progress"><div /></div>
      </section>

      <section>
        {demoTasks.map(([section, task], index) => (
          <article className="task" key={task}>
            <span className="index">{index + 1}</span>
            <div>
              <small>{section}</small>
              <h3>{task}</h3>
              <p>Donnée de démonstration. La prochaine étape remplacera cette liste par les tâches lues dans Notion.</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
