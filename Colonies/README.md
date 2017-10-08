# A CA about different "colonies"

## Rules

The grid is made up of living cells, and space that those cells can
move around in / in to. The cells in the grid that do not contain a
living cell (so a blank space) have no rules applied to them.

Each cell has these properties:
 - Colony (Colour e.g. Purple)
 - Strength (INT e.g. 10)
 - Health (INT e.g. 10)
 - Age (INT e.g. 30 Generations)

Each generation, these things happen:
 - Mitosis. If cell has a neighbouring cell that has nothing living in it,
   then place a new cell of age 0 in the / one of the blank neighbours.
    + Each time a new cell is "born", it inherits its parents colony,
      health & strength, strength has a random chance of being mutated.
 - If a cell is next to another cell of a different colony, they fight.
    + Each cells health is reduced by the others strength value, so for
      example, cell 1 has a health of 10 and strength of 5, whilst cell
      2 has health of 10 and strength of 20. cell 1 looses 20 health
      (so is killed) and cell 2 looses 5 health, so still has 5 left
 - Each cell ages +1 each generation

Each generation is worked out like this:
 - Calculate & Apply mitosis rules
 - Calculate & Apply fighting rules
 - Calculate & Apply new age to cells

## Demos

p5.js -> Demo in p5.js | https://thatguywiththatname.github.io/Cellular_Automata/Colonies/p5.js/index.html
 - The brighter a cell is, the stronger it is. It is possible for darker cells to beat lighter cells because they could have very high health
