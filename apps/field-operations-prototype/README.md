# Prototype mobile KONOS SUITES

Prototype HTML autonome du MVP « mission terrain ».

## Utilisation

1. Ouvrir `index.html` dans un navigateur.
2. Réduire la fenêtre à une largeur mobile ou ouvrir depuis un téléphone.
3. Cliquer sur « Commencer l’intervention ».
4. Tester la checklist, le signalement d’incident et la clôture.

## Fonctionnalités simulées

- résumé d’une rotation ;
- checklist par section ;
- sauvegarde locale avec `localStorage` ;
- progression ;
- incident ;
- photos finales ;
- verrouillage de la clôture ;
- écran de confirmation.

## Limites

Ce prototype ne communique pas encore avec Notion ou n8n. Les données sont codées en dur et l’état est conservé uniquement dans le navigateur.

Le prototype sert de référence UX pour la future application située dans `apps/field-operations-web/`.
