# TC-14 — Rappels et relances intervenante

## Métadonnées

| Champ | Valeur |
|---|---|
| Domaine | Alertes |
| Statut initial | à tester |
| Publication initiale | non publié |
| Type de validation | Validation fonctionnelle complète |
| Priorité | Normale |
| Exécutant | À renseigner |
| Date | À renseigner |
| Version du workflow | À renseigner |
| Commit Git | À renseigner |

## Objectif du test

Vérifier que le workflow **Rappels et relances intervenante** exécute correctement sa logique métier, reste idempotent, ne crée pas de doublon et conserve une traçabilité exploitable dans Notion.

## Préconditions

- Le workflow est importé dans n8n.
- Les credentials HTTP Notion sont associés.
- Les bases Notion concernées sont accessibles à l’intégration.
- Les propriétés et options `select` utilisées par les filtres existent exactement.
- Les données de test sont identifiables et restaurables.
- Les workflows dépendants sont désactivés ou contrôlés pendant le test.
- Une capture de l’état initial Notion est réalisée.

## Données de test à préparer

- Un jeu de données nominal.
- Un jeu de données incomplet ou hors périmètre.
- Un cas permettant de tester une seconde exécution.
- Un identifiant ou préfixe de test facilement repérable.
- Les valeurs avant test pour les propriétés modifiées.

## Résultats attendus

- Une mission prévue aujourd’hui ou demain génère un rappel si elle n’est pas terminée.
- Le rappel contient la date, l’heure et l’action attendue.
- Une mission terminée ou annulée est exclue.
- Une relance ne crée pas de doublon.

## Scénarios

### SC-01 — Cas nominal

**But :** vérifier le traitement principal.

1. Préparer une donnée éligible.
2. Noter l’état initial dans Notion.
3. Exécuter le workflow manuellement.
4. Vérifier chaque nœud n8n.
5. Contrôler les créations et mises à jour Notion.
6. Comparer le résultat avec les règles métier.

**Résultat :** ☐ Réussi ☐ Échoué ☐ Bloqué

**Observations :**

```text
À compléter
```

### SC-02 — Aucun élément éligible

**But :** vérifier que le workflow se termine proprement lorsqu’aucune donnée ne correspond.

1. Retirer ou neutraliser les données éligibles.
2. Exécuter le workflow.
3. Vérifier qu’aucun objet métier indésirable n’est créé.
4. Vérifier qu’aucune erreur technique injustifiée n’apparaît.

**Résultat :** ☐ Réussi ☐ Échoué ☐ Bloqué

### SC-03 — Anti-doublon et idempotence

**But :** vérifier qu’une seconde exécution ne reproduit pas l’action.

1. Exécuter le cas nominal une première fois.
2. Relever les identifiants créés.
3. Relancer le workflow sans modifier les données.
4. Vérifier le nombre d’objets avant et après.
5. Contrôler les identifiants d’automatisation.

**Résultat :** ☐ Réussi ☐ Échoué ☐ Bloqué

### SC-04 — Données incomplètes ou incohérentes

**But :** vérifier le comportement face à une donnée partielle.

1. Supprimer ou modifier une propriété nécessaire.
2. Exécuter le workflow.
3. Vérifier que le traitement est ignoré, bloqué ou signalé conformément à la règle.
4. Vérifier qu’aucune donnée incohérente n’est créée.

**Résultat :** ☐ Réussi ☐ Échoué ☐ Bloqué

### SC-05 — Erreur API ou indisponibilité simulée

**But :** vérifier la visibilité de l’échec.

1. Utiliser temporairement une URL invalide ou désactiver un credential de test.
2. Exécuter uniquement le nœud concerné.
3. Vérifier que l’erreur est explicite.
4. Restaurer immédiatement la configuration correcte.
5. Relancer le workflow avec la configuration valide.

**Résultat :** ☐ Réussi ☐ Échoué ☐ Bloqué

### SC-06 — Restauration des données

**But :** garantir que le test ne pollue pas le système réel.

1. Annuler ou archiver les objets de test.
2. Restaurer les statuts initiaux.
3. Restaurer les quantités initiales.
4. Vérifier que les relations temporaires sont supprimées ou neutralisées.
5. Capturer l’état final.

**Résultat :** ☐ Réussi ☐ Échoué ☐ Bloqué

## Résultat historique connu

- **Statut historique :** non testé
- **Publication :** non
- **Niveau de preuve disponible :** aucun
- **Remarque :** conserver le workflow en déclenchement manuel jusqu’à validation complète.


## Preuves à enregistrer

- [ ] capture du workflow n8n ;
- [ ] capture de l’exécution réussie ;
- [ ] capture des données Notion avant test ;
- [ ] capture des données Notion après test ;
- [ ] identifiants des pages créées ou modifiées ;
- [ ] résultat de la seconde exécution ;
- [ ] éventuelle erreur rencontrée ;
- [ ] correction appliquée ;
- [ ] commit Git associé.

## Synthèse de validation

| Critère | Résultat |
|---|---|
| Cas nominal | À compléter |
| Aucun élément éligible | À compléter |
| Anti-doublon | À compléter |
| Donnée incomplète | À compléter |
| Gestion d’erreur | À compléter |
| Restauration | À compléter |
| Non-régression | À compléter |

## Décision

- [ ] Validé
- [ ] Validé avec réserve
- [ ] À corriger
- [ ] Bloqué

## Anomalies détectées

```text
À compléter
```

## Actions correctives

```text
À compléter
```

## Références

- Workflow : `workflows/...`
- Résultat : `tests/results/TR-14-...md`
- Captures : `docs/screenshots/TC-14/`
