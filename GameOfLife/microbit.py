from microbit import *
import random

"""
THIS VERSION NOT TESTED YET
"""

glider = Image("09000:"
               "00900:"
               "99900:"
               "00000:"
               "00000")

blinker = Image("00000:"
                "00900:"
                "00900:"
                "00900:"
                "00000")

toad = Image("00000:"
             "00000:"
             "09990:"
             "99900:"
             "00000")

"""
The patterns[pattern_index] variable is what will be called in init_gen when
the reset/A button is pressed. Set to None for a random generation.
"""
patterns = [glider, blinker, toad, None]
pattern_index = 0

def init_gen(img=None):
    display.clear()
    if not img:
        # Random generation if no img
        for y in range(5):
            for x in range(5):
                if random.randint(0, 4) == 4:
                    display.set_pixel(x, y, 9)
    else:
        display.show(img)

def get_live_cells():
    live_cells = []
    for y in range(5):
        for x in range (5):
            if display.get_pixel(x, y) != 0:
                live_cells.append([x, y])
    return live_cells

def grow_cells(lis):
    for cell in lis:
        display.set_pixel(cell[0], cell[1], 9)

def destroy_cells(lis):
    for cell in lis:
        display.set_pixel(cell[0], cell[1], 0)

def get_neighbours(x, y):
    # Proabably a better way of doing this
    neighbours = []
    if x != 0:
        neighbours.append([x-1, y])
        if y != 0:
            neighbours.append([x-1, y-1])
        if y != 4:
            neighbours.append([x-1, y+1])
    if y != 4:
        neighbours.append([x, y+1])
    if y != 0:
        neighbours.append([x, y-1])
    if x != 4:
        neighbours.append([x+1, y])
        if y != 0:
            neighbours.append([x+1, y-1])
        if y != 4:
            neighbours.append([x+1, y+1])
    return neighbours

def count_live_neighbours(x, y, live_cells):
    count = 0
    for cell in get_neighbours(x, y):
        if cell in live_cells:
            count += 1
    return count

# First generation
init_gen(patterns[pattern_index])
# Main generation loop (Sleeps for 250ms inbetween button presses)
while(1):
    # Put a finger on the ground pin and touch/tap pin 0 to cycle patterns
    if pin0.is_touched():
        if pattern_index == len(patterns)-1:
            pattern_index = 0
        else:
            pattern_index += 1
        init_gen(patterns[pattern_index])
        sleep(250)

    # Press/hold B for next generation
    elif button_b.is_pressed():
        cells_to_kill = []
        cells_to_grow = []
        live_cells = get_live_cells()

        for y in range(5):
                for x in range(5):
                    count = count_live_neighbours(x, y, live_cells)
                    if [x, y] in live_cells:
                        """
                        DEATH:
                        For each cell alive, if it has less that 2 neighbours or more than 3,
                        it dies
                        """
                        if count < 2 or count > 3:
                            cells_to_kill.append([x, y])
                    else:
                        """
                        GROWTH:
                        For each cell that is not currently alive, if it has exactly 3 alive
                        neighbours, then it grows into an alive cell
                        """
                        if count == 3:
                            cells_to_grow.append([x, y])
        grow_cells(cells_to_grow)
        destroy_cells(cells_to_kill)
        sleep(250)

    # A to reset to the current pattern
    elif button_a.is_pressed():
        init_gen(patterns[pattern_index])
        sleep(250)
