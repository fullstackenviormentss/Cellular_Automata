"""

ink.py + flow.py

Generate a set of walls using ink.py, then apply flow.py's rules to falling
liquid

"""

from os import system
from time import sleep, time
from random import randint, seed
from sys import exit, platform

""" INK VARIABLES """
CHANCE = 80
MINUS_ONE_CHANCE = 2
GEN_TICK_RATE = 0

""" FLOW VARIABLES """
FLOW_TICK_RATE = 0.01

""" GENERAL VARIABLES """
SEED = time()
seed(SEED)

# Change these for your terminal
COLUMNS = 80
ROWS    = 40

""" DONT CHANGE ANYTHING BELOW HERE """
LIQUID     = "~"
WALL       = "#"
BACKGROUND = " "

BREAK_VAL = False
# 0 for wall gen, 1 for liquid sim
PRINT_MODE = 0

GEN = 0
cells = []

RESET_TO_TOP_LEFT = "\x1b[0;0H"

if platform == "linux" or platform == "darwin":
    CLR = "clear"
elif platform == "win32":
    CLR = "cls"
else:
    raise EnvironmentError("OS not recognized")

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

    print("Generation: {} // Seed: {} // Grid: {}x{}".format(GEN, SEED,
                                                             COLUMNS, ROWS))
    if not PRINT_MODE:
        for row in cells:
            for cell in row:
                if not cell:
                    cell = " "
                print(cell, end=" ")
            print("")
    else:
        for row in cells:
            print(" ".join(row))

def gen_get_cell_value(r, c):
    """
    This function is used to check if r &&|| c are out of bounds
    """
    if r == -1 or c == -1 or r == ROWS or c == COLUMNS:
        return 0  # Will not pass gen_lowest_neighbour() if statement
    return cells[r][c]

def gen_lowest_neighbour(r, c):
    ln = 5
    all_zero_one = True
    n = [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c-1], [r, c+1],
         [r+1, c-1], [r+1, c], [r+1, c+1]]

    for cell in n:
        n_cell_val = gen_get_cell_value(cell[0], cell[1])
        if n_cell_val < ln and n_cell_val != 0 and n_cell_val != 1:
            ln = n_cell_val
            all_zero_one = False
        elif n_cell_val == ln:
            all_zero_one = False

    if all_zero_one:
        return -1
    return ln

def gen_tick():
    global BREAK_VAL
    changed = False
    cells_to_change = []
    for row in range(ROWS):
        for col in range(COLUMNS):
            if cells[row][col] == 0:
                ln = gen_lowest_neighbour(row, col)
                if ln != -1:
                    cells_to_change.append([row, col, ln-1])
    for cell in cells_to_change:
        changed = True
        if not randint(0, MINUS_ONE_CHANCE):
            cell[2] -= 1
        cells[cell[0]][cell[1]] = cell[2]
    if not changed:
        BREAK_VAL = True

""" FLOW functions """
def flow_get_cell_value(r, c):
    if r == -1 or c == -1 or r == ROWS or c == COLUMNS:
        return False
    return cells[r][c]

def flow_get_neighbours(r, c):
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
        returned.append([flow_get_cell_value(cell[0], cell[1]), cell])
    return returned

def flow_tick():
    # Copy cells into cells_copy (just doing cells_copy = cells doesem't work)
    cells_copy = []
    for row in range(ROWS):
        clmns = []
        for col in range(COLUMNS):
            clmns.append(cells[row][col])
        cells_copy.append(clmns)

    for row in range(ROWS):
        for col in range(COLUMNS):
            if cells_copy[row][col] == LIQUID:
                n = flow_get_neighbours(row, col)
                for cell in n:  # See line 81
                    if cell[0] == BACKGROUND:
                        cells[row][col] = BACKGROUND
                        cells[cell[1][0]][cell[1][1]] = LIQUID
                        break

def spawn_liquid(r, c):
    if r != -1 and c != -1 and r != ROWS and c != COLUMNS:
        if cells[r][c] == BACKGROUND:
            cells[r][c] = LIQUID

if __name__ == "__main__":
    init_cells()
    system(CLR)
    try:
        while 1:
            print_cells()
            gen_tick()
            sleep(GEN_TICK_RATE)
            GEN += 1
            if BREAK_VAL:
                break

        print("Done, setting up FLOW")
        # Convert generated cells into flow cells
        old_cells = cells
        for row in range(ROWS):
            for col in range(COLUMNS):
                if cells[row][col]:
                    cells[row][col] = WALL
                else:
                    cells[row][col] = BACKGROUND

        PRINT_MODE = 1
        sr = int(input("Liquid row >> "))
        sc = int(input("Liquid column >> "))

        while 1:
            spawn_liquid(sr, sc)
            print_cells()
            flow_tick()
            sleep(FLOW_TICK_RATE)
            GEN += 1

    except KeyboardInterrupt:
        exit()
