function setup() {
  MUTATION_CHANCE = 1; // 1/MUTATION_CHANCE+1 chance of new cells mutating
  cells = [];
  GEN = 0;
  CA = 60 // CA grid is CAxCA then upscaled to VIS (so CA*CA amount of cells)
  VIS = 800; // Visual grid is VISxVIS (VIS*VIS amount of pixels)

  // CA_ROWS and CA_COLUMNS could be one variable but are different for clarity
  CA_ROWS = CA;
  CA_COLUMNS = CA;
  CELL_SIZE = VIS/CA;

  // HSB colors for each colony (orange, green, blue, pink)
  COLONIES = [
    [40, 78, 10],
    [93, 78, 10],
    [220, 78, 10],
    [301, 78, 10]
  ];

  colorMode(HSB); // Set color() to use HSB
  createCanvas(VIS, VIS);
  background(0);
  noSmooth();
  noStroke();
  init_cells();
}

function draw() {
  document.getElementById("genh1").innerHTML = "Generation: "+GEN;
  for (let r = 0; r < CA_ROWS; r++) {
    for (let c = 0; c < CA_COLUMNS; c++) {
      if (cells[r][c] != 0) {
        fill(cells[r][c].colour);
      } else {
        fill(0);
      }
      rect(c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  tick();
}

function cell(colony, strength, health) {
  // Cell "class"
  this.colony = colony;
  this.strength = strength;
  this.health = health;
  this.age = 0;

  // Brightness depends on strength
  let base = COLONIES[colony];
  if ((base[2] + (strength*2)) > 100) {
    this.colour = color(base[0], base[1], 100);
  } else {
    this.colour = color(base[0], base[1], base[2] + (strength*2));
  }
}

function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init_cells() {
  for (let r = 0; r < CA_ROWS; r++) {
    clmns = [];
    for (let c = 0; c < CA_COLUMNS; c++) {
      clmns.push(0);
    }
    cells.push(clmns);
  }
  for (let i = 0; i < 10; i++) {
    cells[0][i] = new cell(0, 5, 10);
  }
  for (let i = 0; i < 10; i++) {
    cells[CA_ROWS-1][i] = new cell(1, 5, 10);
  }
  for (let i = 1; i < 11; i++) {
    cells[0][CA_COLUMNS-i] = new cell(2, 5, 10);
  }
  for (let i = 1; i < 11; i++) {
    cells[CA_ROWS-1][CA_COLUMNS-i] = new cell(3, 5, 10);
  }
}

// NEIGHBOUR FUNCTIONS
function neighbouring_cells(r, c) {
  // Returns neighbours in random order
  let rn = [];
  let n = [[r-1, c-1], [r-1, c], [r-1, c+1],
           [r, c-1], [r, c+1],
           [r+1, c-1], [r+1, c], [r+1, c+1]];
  let nl = n.length;
  for (let i = 0; i < nl; i++) {
    let ri = rand_int(0, n.length-1);
    rn.push(n.splice(ri, 1)[0]);
  }
  return rn;
}

function get_empty_neighbour(r, c) {
  let n = neighbouring_cells(r, c);
  for (let i = 0; i < n.length; i++) {
    if (n[i][0] != -1 && n[i][1] != -1 && n[i][0] != CA_ROWS && n[i][1] != CA_COLUMNS) {
      if (cells[n[i][0]][n[i][1]] == 0) {
        return n[i];
      }
    }
  }
  return false;
}

function get_neighbouring_enemy(r, c, colony) {
  let n = neighbouring_cells(r, c);
  for (let i = 0; i < n.length; i++) {
    if (n[i][0] != -1 && n[i][1] != -1 && n[i][0] != CA_ROWS && n[i][1] != CA_COLUMNS && cells[n[i][0]][n[i][1]] != 0) {
      if (cells[n[i][0]][n[i][1]].colony != colony) {
        return n[i];
      }
    }
  }
  return false;
}
// END

function tick() {
  // Mitosis stage
  let mitosis_changed = [];
  for (let r = 0; r < CA_ROWS; r++) {
    for (let c = 0; c < CA_COLUMNS; c++) {
      let cc = cells[r][c];  // cc = current cell
      if (cc != 0) {
        let en = get_empty_neighbour(r, c);
        if (en) {
          // Child mutation
          let e_strength = cc.strength;
          if (!rand_int(0, MUTATION_CHANCE)) {
            if (e_strength == 0) {
              e_strength += 1;
            } else if (e_strength == 100) {
              e_strength -= 1;
            } else {
              // Otherwise, random mutation
              e_strength += [-1, 1][rand_int(0, 1)];
            }
          }
          mitosis_changed.push([en[0], en[1], cc.colony, e_strength, cc.health]);
        }
      }
    }
  }
  // // Create cells after calculations to prevent skew
  for (let i = 0; i < mitosis_changed.length; i++) {
    let mitosis_arr = mitosis_changed[i];
    cells[mitosis_arr[0]][mitosis_arr[1]] = new cell(mitosis_arr[2], mitosis_arr[3], mitosis_arr[4]);
  }
  // END

  // Fighting stage
  let cells_to_kill = []
  for (let r = 0; r < CA_ROWS; r++) {
    for (let c = 0; c < CA_COLUMNS; c++) {
      let cc = cells[r][c];
      if (cc != 0) {
        let en = get_neighbouring_enemy(r, c, cc.colony);
        if (en != false) {
          en_c = cells[en[0]][en[1]];  // en_c = enemy neighbour cell
          cc.health -= en_c.strength;
          en_c.health -= cc.strength;
          if (cc.health <= 0) {
            cells_to_kill.push([r, c]);
          }
          if (en_c.health <= 0) {
            cells_to_kill.push([en[0], en[1]]);
          }
        }
      }
    }
  }
  // // Destroy cells after calculations to prevent skew
  for (let i = 0; i < cells_to_kill.length; i++) {
    cells[cells_to_kill[i][0]][cells_to_kill[i][1]] = 0;
  }
  // END

  // For each colony, amount of cells, total strength, total age (also age all cells by 1 gen)
  let colony_totals = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let r = 0; r < CA_ROWS; r++) {
    for (let c = 0; c < CA_COLUMNS; c++) {
      let cc = cells[r][c];
      if (cc != 0) {
        cells[r][c].age += 1;
        colony_totals[cc.colony][0] += 1;
        colony_totals[cc.colony][1] += cc.strength;
        colony_totals[cc.colony][2] += cc.age;
      }
    }
  }
  // END

  // This could probably be optimised
  document.getElementById("stat0").innerHTML ="Colony Orange\n\n\tAlive   | " + colony_totals[0][0] + "\n\tAvg str | " + int(colony_totals[0][1]/colony_totals[0][0]) + "\n\tAvg age | " + int(colony_totals[0][2]/colony_totals[0][0]) +
  "\n\n\nColony Green\n\n\tAlive   | " + colony_totals[1][0] + "\n\tAvg str | " + int(colony_totals[1][1]/colony_totals[1][0]) + "\n\tAvg age | " + int(colony_totals[1][2]/colony_totals[1][0]) +
  "\n\n\nColony Blue\n\n\tAlive   | " + colony_totals[2][0] + "\n\tAvg str | " + int(colony_totals[2][1]/colony_totals[2][0]) + "\n\tAvg age | " + int(colony_totals[2][2]/colony_totals[2][0]) +
  "\n\n\nColony Pink\n\n\tAlive   | " + colony_totals[3][0] + "\n\tAvg str | " + int(colony_totals[3][1]/colony_totals[3][0]) + "\n\tAvg age | " + int(colony_totals[3][2]/colony_totals[3][0]);
  GEN++;
}
