"""

INK.py - Cellular Automata
--------------------------

    RULES
    -----
 - A cell has 6 possible states: 0, 1, 2, 3, 4, or 5
 - Any cell thats state is not 0 cannot change state
 - For each generation, any cell that is 0 and has a neighbouring non-zero and
   non-1 cell, decides it's own value like this: Choose the lowest state (not
   including 1 or 0) (if the lowest state is either 1 or 0, do nothing) from all
   8 neighbours, and then set itself as that state minus 1. When this happens,
   there is a random chance the state will decrease again by another 1.

   THIS SCRIPT
   -----------
 This script creates "maps" using the rules above and applying them to a
 randomally created grid of cells (random chance of a cell being either 0 or 5)
 It then applies these rules and prints out the grid every generation untill
 noting changes after a generation, it then stops the process.

"""

from os import system
from time import sleep, time
from random import randint, seed
from sys import exit, platform


""" EDIT THESE VARIABLES """

# 1 = show numbers, 0 = show "#"'s
DISPLAY_MODE = 0

# 1/CHANCE+1 chance of a cell spawning as a 5 instead of a 0
CHANCE = 80

# 1/MINUS_ONE_CHANCE+1 of a cell loosing an extra state
MINUS_ONE_CHANCE = 2

# The time inbetween generations, 0 for as fast as your processor can handle
TICK_RATE = 0

# Seed
SEED = time()

# Change these for your terminal
COLUMNS = 80
ROWS    = 40

""" DO NOT CHANGE ANYTHING BELOW """


RESET_TO_TOP_LEFT = "\x1b[0;0H"

if platform == "linux":
    CLR = "clear"
elif platform == "win32":
    CLR = "cls"
else:
    raise EnvironmentError("OS not recognized")

seed(SEED)
GEN = 0
cells = []

def init_cells():
    for R in range(ROWS):
        clmns = []
        for C in range(COLUMNS):
            if randint(0, CHANCE):
                clmns.append(0)
            else:
                clmns.append(5)
        cells.append(clmns)

def print_cells(clr = True):
    if clr:
        print(RESET_TO_TOP_LEFT)
    print("Generations: {} // Seed: {} // Spawn chance: 1/{} // -1 chance: 1/{}"\
          .format(GEN, SEED, CHANCE+1, MINUS_ONE_CHANCE+1))
    for row in cells:
        for cell in row:
            if not DISPLAY_MODE:
                if cell == 5:
                    # Show locations of originally spawned cells
                    cell = "@"
                elif cell:
                    cell = "#"
            if not cell:
                cell = " "
            print(cell, end=" ")
        print("")

def get_cell_value(r, c):
    """
    This function is used to check if r &&|| c are out of bounds
    """
    if r == -1 or c == -1 or r == ROWS or c == COLUMNS:
        return 0  # Will not pass lowest_neighbour() if statement
    return cells[r][c]

def lowest_neighbour(r, c):
    ln = 5
    all_zero_one = True
    n = [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c-1], [r, c+1],
         [r+1, c-1], [r+1, c], [r+1, c+1]]

    for cell in n:
        n_cell_val = get_cell_value(cell[0], cell[1])
        if n_cell_val < ln and n_cell_val != 0 and n_cell_val != 1:
            ln = n_cell_val
            all_zero_one = False
        elif n_cell_val == ln:
            all_zero_one = False

    if all_zero_one:
        return -1
    return ln

def tick():
    changed = False
    cells_to_change = []
    for row in range(ROWS):
        for col in range(COLUMNS):
            if cells[row][col] == 0:
                ln = lowest_neighbour(row, col)
                if ln != -1:
                    cells_to_change.append([row, col, ln-1])
    for cell in cells_to_change:
        changed = True
        if not randint(0, MINUS_ONE_CHANCE):
            cell[2] -= 1
        cells[cell[0]][cell[1]] = cell[2]
    if not changed:
        exit()

if __name__ == "__main__":
    init_cells()
    system(CLR)
    try:
        while 1:
            print_cells()
            tick()
            GEN += 1
            sleep(TICK_RATE)
    except KeyboardInterrupt:
        exit()
