# Matrice de validation des workflows

| # | Workflow | Historique | Test général requis | Preuves à compléter | Décision finale |
|---:|---|---|---|---|---|
| 1 | Réservation validée vers intervention interne | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 2 | Synchronisation Interventions vers Missions intervenante | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 3 | Réserver le linge depuis les interventions | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 4 | Réserver les consommables depuis les interventions | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 5 | Intervention terminée vers consommation et linge en service | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 6 | Départ confirmé vers retour du linge sale | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 7 | Retours sales vers cycle de lessive | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 8 | Cycle de lessive vers mouvements de suivi | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 9 | Annulation ou no-show vers libération des stocks | Déjà testé et publié | Oui | Reconstitution + non-régression | À compléter |
| 10 | Stock insuffisant vers alertes et liste de courses | Non testé | Oui | Validation complète | À compléter |
| 11 | Modification réservation vers recalcul des besoins | Non testé | Oui | Validation complète | À compléter |
| 12 | Contrôle opérationnel avant arrivée | Non testé | Oui | Validation complète | À compléter |
| 13 | Alerte réservation non prête avant arrivée | Non testé | Oui | Validation complète | À compléter |
| 14 | Rappels et relances intervenante | Non testé | Oui | Validation complète | À compléter |
| 15 | Gestion des incidents opérationnels | Non testé | Oui | Validation complète | À compléter |
| 16 | Résumé quotidien et tableau de pilotage | Non testé | Oui | Validation complète | À compléter |

## Règle de validation

Les 16 workflows participent à la campagne générale.

- Les **9 premiers** ne sont pas considérés comme définitivement clos : ils doivent subir un test de non-régression et leurs preuves doivent être reconstituées.
- Les **7 derniers** doivent subir une validation complète avant publication.
- La campagne se termine par un test de bout en bout couvrant le cycle réservation → opérations → stocks → lessive → alertes → reporting.
