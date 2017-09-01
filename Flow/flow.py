"""
flow.py

Liquid based simulation inside a terminal environment

Cellular automaton rules:
  - Cells have 3 states: background (0)(" "), wall (1)("#"), and liquid (2)("~")
  - Only liquid cells have rules applied to them
  - A liquid cells rules per generation happens like this:
    + If a cell has a BG cell below it, move there, if not, look at next statement
    + If a cell has both south east and south west BG cells, pick a random one and move there, if not, look at next statement
    + If a cell has either a south east or south west BG cell, move there, if not, look at next statement
    + If a cell has both east and west BG cells, pick a random one and move there, if not, look at next statement
    + If a cell has either an east BG cell or west BG cell, move there, if not, look at next statement
    + Do nothing
"""

from random import randint, seed
from sys import exit, platform
from time import sleep, time
from os import system

RESET_TO_TOP_LEFT = "\x1b[0;0H"

if platform == "linux" or platform == "darwin":
    CLR = "clear"
elif platform == "win32":
    CLR = "cls"
else:
    raise EnvironmentError("OS not recognized")

cells = []
GEN = 0
LIQUID = "~"
WALL = "#"
BACKGROUND = " "
ROWS    = 20
COLUMNS = 20
# Number of inbetween ticks
TICK_RATE = 0.1
# seed random with current time()
SEED = time()

def init_cells():
    # Seed random
    seed(SEED)
    for R in range(ROWS):
        clmns = []
        for C in range(COLUMNS):
            clmns.append(BACKGROUND)
        cells.append(clmns)
    # Draw a pyramid
    cells[9][3] = LIQUID
    cells[9][4] = LIQUID
    cells[9][5] = LIQUID
    cells[9][6] = LIQUID
    cells[9][7] = LIQUID
    cells[8][4] = LIQUID
    cells[8][5] = LIQUID
    cells[8][6] = LIQUID
    cells[7][5] = LIQUID
    cells[10][1] = WALL
    cells[10][2] = WALL
    cells[10][3] = WALL
    cells[10][4] = WALL
    cells[10][5] = WALL
    cells[10][6] = WALL
    cells[10][7] = WALL
    cells[10][8] = WALL

def print_cells(clr=True):
    if clr:
        print(RESET_TO_TOP_LEFT)
    print("Generation: {} // Tick rate: {}s // Seed: {} // " \
          "Grid: {}x{}".format(GEN, TICK_RATE, SEED, COLUMNS, ROWS))
    for row in cells:
        print(" ".join(row))

def get_cell_value(r, c):
    if r == -1 or c == -1 or r == ROWS or c == COLUMNS:
        return False
    return cells[r][c]

def get_neighbours(r, c):
    returned = []
    # BELOW, SOUTH EAST, SOUTH WEST, EAST, WEST
    n = [[r+1, c]]

    ch = randint(0, 1)
    if ch:
        n.append([r+1, c-1])
        n.append([r+1, c+1])
    else:
        n.append([r+1, c+1])
        n.append([r+1, c-1])

    ch = randint(0, 1)
    if ch:
        n.append([r, c-1])
        n.append([r, c+1])
    else:
        n.append([r, c+1])
        n.append([r, c-1])

    for cell in n:
        returned.append([get_cell_value(cell[0], cell[1]), cell])
    return returned

def tick():
    # Copy cells into cells_copy (just setting it equal to cells does not work)
    cells_copy = []
    for row in range(ROWS):
        clmns = []
        for col in range(COLUMNS):
            clmns.append(cells[row][col])
        cells_copy.append(clmns)

    for row in range(ROWS):
        for col in range(COLUMNS):
            if cells_copy[row][col] == LIQUID:
                n = get_neighbours(row, col)
                for cell in n:  # See line 81
                    if cell[0] == BACKGROUND:
                        cells[row][col] = BACKGROUND
                        cells[cell[1][0]][cell[1][1]] = LIQUID
                        break

def spawn_water(r, c):
    if r != -1 and c != -1 and r != ROWS and c != COLUMNS:
        if cells[r][c] == BACKGROUND:
            cells[r][c] = LIQUID

def main_loop():
    global GEN
    while 1:
        print_cells()
        sleep(TICK_RATE)
        tick()
        spawn_water(0, 5)
        GEN += 1

if __name__ == "__main__":
    init_cells()
    system(CLR)
    try:
        main_loop()
    except KeyboardInterrupt:
        exit()
