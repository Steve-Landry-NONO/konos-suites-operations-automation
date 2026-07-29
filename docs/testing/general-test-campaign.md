# Plan de campagne générale de tests

## Principe

La campagne couvre les 16 workflows.

### Lot A — Reconstitution des preuves des 9 workflows publiés

Objectif : confirmer que les workflows déjà validés fonctionnent toujours après les évolutions Notion et documenter les preuves manquantes.

### Lot B — Validation des 7 workflows non publiés

Objectif : exécuter tous les scénarios fonctionnels, techniques et anti-doublons avant publication.

### Lot C — Test de bout en bout

Scénario recommandé :

1. créer ou préparer une réservation de test ;
2. générer l’intervention ;
3. générer la mission ;
4. réserver linge et consommables ;
5. modifier la réservation ;
6. recalculer les besoins ;
7. exécuter le contrôle avant arrivée ;
8. générer ou éviter l’alerte selon l’état ;
9. terminer l’intervention ;
10. enregistrer les consommations ;
11. confirmer le départ ;
12. retourner le linge sale ;
13. rattacher au cycle de lessive ;
14. terminer le cycle ;
15. simuler un incident ;
16. générer le résumé quotidien.

## Ordre d’exécution recommandé

1. TC-01 à TC-04
2. TC-11
3. TC-12
4. TC-13
5. TC-10
6. TC-14
7. TC-15
8. TC-16
9. TC-05 à TC-09
10. test de bout en bout complet

## Critères de sortie

- aucune erreur bloquante ;
- aucun doublon après seconde exécution ;
- stocks cohérents ;
- relations Notion cohérentes ;
- alertes correctes ;
- données de test restaurées ;
- preuves archivées ;
- résultats commités ;
- workflows non publiés activés progressivement seulement après validation.
