"""
GoL.py - Conways Game Of Life written in Python3

The larger the grid, the longer each tick will take (even
if TICK_RATE is set to 0, there is a minimum time taken to
calculate the evolution). Increasing the complexity of the
ALIVE and DEAD characters will also increase tick time (
e.g. using terminal_colours.py)

Interesting seeds with CHANCE = 9:
1503849173.6465845 - Creates 2 gliders
1503914819.9297097 - Ends at roughly 1500 generations
1504003826.7201796 - Also ends ~1500 generations

ToDo:
- Support command line arguments
- Support Win && Mac command lines
"""

from random import randint, seed
from sys import exit, platform
from time import sleep, time
from os import system

RESET_TO_TOP_LEFT = "\x1b[0;0H"

if platform == "linux":
    CLR = "clear"
elif platform == "win32":
    CLR = "cls"
else:
    raise EnvironmentError("OS not recognized")

cells = []
GEN = 0
ALIVE = "#"
DEAD  = " "
ROWS    = 40
COLUMNS = 80
# Number of inbetween ticks
TICK_RATE = 0.01 # 0.05 is a good rate
# 1 / CHANCE+1 = the chance of a cell spawning in the ALIVE state
CHANCE = 9
# seed random with current time()
SEED = time()

def init_cells():
    # Seed random
    seed(SEED)
    for R in range(ROWS):
        clmns = []
        for C in range(COLUMNS):
            if randint(0, CHANCE):
                clmns.append(DEAD)
            else:
                clmns.append(ALIVE)
        cells.append(clmns)

def alive_cell_at(r, c):
    if r == -1 or c == -1 or r == ROWS or c == COLUMNS:
        return False
    if cells[r][c] == ALIVE:
        return True
    return False

def num_alive_neighbours(r, c):
    a = 0
    n = [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c-1], [r, c+1],
         [r+1, c-1], [r+1, c], [r+1, c+1]]
    for cell in n:
        if alive_cell_at(cell[0], cell[1]):
            a += 1
    return a

def print_cells(clr=True):
    if clr:
        print(RESET_TO_TOP_LEFT)
    print("Generation: {} // Tick rate: {}s // Seed: {} // " \
          "Chance of spawning ALIVE: 1/{} // Grid: {}x{}" \
          .format(GEN, TICK_RATE, SEED, CHANCE+1, COLUMNS, ROWS))
    for row in cells:
        print(" ".join(row))

def tick():
    global GEN
    GEN += 1
    cells_to_kill = []
    cells_to_grow = []
    # For each cell
    for row in range(ROWS):
        for col in range(COLUMNS):
            a = num_alive_neighbours(row, col)
            if a < 2 or a > 3:
                cells_to_kill.append([row, col])
            elif a == 3:
                cells_to_grow.append([row, col])
    for cell in cells_to_grow:
        cells[cell[0]][cell[1]] = ALIVE
    for cell in cells_to_kill:
        cells[cell[0]][cell[1]] = DEAD

def main_loop():
    while 1:
        print_cells()
        sleep(TICK_RATE)
        tick()

if __name__ == "__main__":
    init_cells()
    system(CLR)
    try:
        main_loop()
    except KeyboardInterrupt:
        exit()
