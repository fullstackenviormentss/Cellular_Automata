var cells = [];
var GEN = 0;
var CA = 100 // CA grid is CAxCA then upscaled to VIS (so CA*CA amount of cells)
var VIS = 800; // Visual grid is VISxVIS (VIS*VIS amount of pixels)

function setup() {
  // Variables that need to be re-initialized when setup() is called
  CHANGED = false;
  CA_ROWS = CA;
  CA_COLUMNS = CA;
  VIS_ROWS = VIS;
  VIS_COLUMNS = VIS;
  CELL_SIZE = VIS_ROWS/CA_ROWS;
  CHANCE = 0.0125; // 0.1 = 10% chance of spawning alive
  MINUS_ONE_CHANCE = 0.33; // 0.1 = 10% chance of loosing extra state

  createCanvas(VIS_COLUMNS, VIS_ROWS);
  background(255);
  noSmooth();
  noStroke();
  init_cells();
}

function draw() {
  tick();
  if (CHANGED) {
    GEN++;
  }
  document.getElementById("genh1").innerHTML = "Generations taken: "+GEN;
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      if (cells[r][c] > 0) {
        fill(0);
      } else {
        fill(255);
      }
      rect(c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function init_cells() {
  for (var r = 0; r < CA_ROWS; r++) {
    clmns = [];
    for (var c = 0; c < CA_COLUMNS; c++) {
      if (Math.random() < CHANCE) {
        clmns.push(5);
      } else {
        clmns.push(0);
      }
    }
    cells.push(clmns);
  }
}

function get_cell_value(r, c) {
  if (r == -1 || c == -1 || r == CA_ROWS || c == CA_COLUMNS) {
    return 0;
  } else {
    return cells[r][c];
  }
}

function lowest_neighbour(r, c) {
  var ln = 5;
  var all_zero_one = true;
  var n = [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c-1], [r, c+1],
          [r+1, c-1], [r+1, c], [r+1, c+1]];

  for (var i = 0; i < n.length; i++) {
    var n_cell_val = get_cell_value(n[i][0], n[i][1]);
    if (n_cell_val < ln && n_cell_val != 0 && n_cell_val != 1) {
      ln = n_cell_val;
      all_zero_one = false;
    } else if (n_cell_val == ln) {
      all_zero_one = false;
    }
  }

  if (all_zero_one) {
    return -1;
  }
  return ln;
}

function tick() {
  CHANGED = false;
  var cells_to_change = [];
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      if (cells[r][c] == 0) {
        var ln = lowest_neighbour(r, c);
        if (ln != -1) {
          cells_to_change.push([r, c, ln-1]);
        }
      }
    }
  }

  for (var i = 0; i < cells_to_change.length; i++) {
    CHANGED = true;
    if (Math.random() < MINUS_ONE_CHANCE) {
      cells_to_change[i][2] -= 1;
    }
    cells[cells_to_change[i][0]][cells_to_change[i][1]] = cells_to_change[i][2];
  }
}
