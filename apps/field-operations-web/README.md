# Application terrain KONOS SUITES

Socle de la future application Web mobile des intervenants terrain.

## État actuel

- Next.js + TypeScript ;
- interface mobile initiale ;
- client Notion côté serveur préparé ;
- variables d’environnement documentées ;
- données de démonstration correspondant à `TEST-TC11-002`.

## Démarrage local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Sources Notion

- Interventions : `71cb042a-8768-4afa-be06-45895e262b0b`
- Tâches d’intervention : `6e182b83-b5e7-4f2b-9b12-50f8e44cf609`

## Prochain incrément

1. route serveur de lecture d’une intervention ;
2. lecture des tâches liées et tri par `Ordre` ;
3. lien d’accès sécurisé ;
4. mise à jour des statuts ;
5. envoi des incidents et photos ;
6. clôture contrôlée côté serveur ;
7. webhook n8n.
