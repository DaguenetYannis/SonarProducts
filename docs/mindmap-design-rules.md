# Mindmap Design Rules

Mindmaps in this app are short diagnostic exercises, not large canvas diagrams.

1. Each map has one center node, a small set of branches, and exactly one empty target node.
2. Each answer has three choices, with one correct choice, matching the quiz interaction model.
3. Phone layout is vertical first: branches stack, connector lines stay simple, and every node wraps long labels.
4. Desktop layout can split branches into two columns, but the map remains readable without horizontal scrolling.
5. Nodes use stable minimum heights and compact labels so feedback states do not resize the exercise unexpectedly.
6. The center node states the customer problem, product area, stakeholder, or reasoning frame.
7. Branches represent relationships a CSE needs to explain: problem to capability to outcome, product to workflow stage, or symptom to diagnosis.
8. The empty slot should test a meaningful Sonar/CSE concept, not trivia.
