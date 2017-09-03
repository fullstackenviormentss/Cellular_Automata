This was originally an attempt to create a cellular automaton that simulates
how ink would spread over paper. I'm not sure if it looks like that, but it
is definitely good at producing random 2d "maps" that could be either seen as
top-down maps or side-view maps (e.g. a Rimworld map or a Terraria map)

Rules:
- A cell has 6 possible states: 0, 1, 2, 3, 4, or 5
- Any cell thats state is not 0 cannot change state
- For each generation, any cell that is 0 and has a neighbouring non-zero and
  non-1 cell, decides it's own value like this: Choose the lowest state (not
  including 1 or 0) (if the lowest state is either 1 or 0, do nothing) from all
  8 neighbours, and then set itself as that state minus 1. When this happens,
  there is a random chance the state will decrease again by another 1.

p5.js example - https://thatguywiththatname.github.io/Cellular_Autonoma/Ink/p5.js/index.html
