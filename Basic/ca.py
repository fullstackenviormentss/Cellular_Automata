from time import sleep
from sys import argv
from os import system

# Clear terminal window
if platform == "linux" or platform == "darwin":
    system("clear")
elif platform == "win32":
    system("cls")
else:
    raise EnvironmentError("OS not recognized")

LEN = int(argv[1])
MIDDLE = int(LEN/2)
ON = "#"
OFF = " "

cells = [0]*LEN
rules = {
    "000": 0,
    "001": 1,
    "010": 0,
    "011": 1,
    "100": 1,
    "101": 0,
    "110": 1,
    "111": 0
}

def init_cells():
    cells[MIDDLE] = 1

def print_cells():
    for cell in cells:
        if cell:
            print(ON, end="")
        else:
            print(OFF, end="")
    print("")  # Newline

def tick():
    global cells
    next_cell_gen = [0]*LEN
    for i in range(1, LEN-1):
        east = cells[i-1]
        cent = cells[i]
        west = cells[i+1]
        rule = rules[str(east)+str(cent)+str(west)]
        next_cell_gen[i] = rule
    cells = next_cell_gen

init_cells()
while 1:
    print_cells()
    tick()
    sleep(0.1)
