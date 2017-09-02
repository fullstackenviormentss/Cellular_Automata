var cells = [];
var GEN = 0;
var CA = 100 // CA grid is CAxCA then upscaled to VIS (so CA*CA amount of cells)
var VIS = 800; // Visual grid is VISxVIS (VIS*VIS amount of pixels)
var ALIVE = 1;
var DEAD = 0;

function setup() {
  // Variables that need to be re-initialized when setup() is called
  CA_ROWS = CA;
  CA_COLUMNS = CA;
  VIS_ROWS = VIS;
  VIS_COLUMNS = VIS;
  CELL_SIZE = VIS_ROWS/CA_ROWS;
  CHANCE = 0.1; // 0.1 = 10% chance of spawning alive

  createCanvas(VIS_COLUMNS, VIS_ROWS);
  background(0);
  noSmooth();
  noStroke();
  init_cells();
}

function draw() {
  tick();
  document.getElementById("genh1").innerHTML = "Generation: "+GEN;
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      if (cells[r][c] == ALIVE) {
        fill(255);
      } else {
        fill(0);
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
        clmns.push(ALIVE);
      } else {
        clmns.push(DEAD);
      }
    }
    cells.push(clmns);
  }
}

function alive_cell_at(r, c) {
  if (r == -1 || c == -1 || r == CA_ROWS || c == CA_COLUMNS) {
    return false;
  }
  if (cells[r][c] == ALIVE) {
    return true;
  }
  return false;
}

function num_alive_neighbours(r, c) {
  var a = 0
  var n = [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c-1], [r, c+1],
       [r+1, c-1], [r+1, c], [r+1, c+1]];
  for (var i = 0; i < n.length; i++) {
    if (alive_cell_at(n[i][0], n[i][1])) {
      a++;
    }
  }
  return a;
}

function tick() {
  GEN++;
  var cells_to_kill = [];
  var cells_to_grow = [];
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      var a = num_alive_neighbours(r, c);
      if (a < 2 || a > 3) {
        cells_to_kill.push([r, c]);
      }
      else if (a == 3) {
        cells_to_grow.push([r, c]);
      }
    }
  }
  for (var i = 0; i < cells_to_grow.length; i++) {
    cells[cells_to_grow[i][0]][cells_to_grow[i][1]] = ALIVE;
  }
  for (var i = 0; i < cells_to_kill.length; i++) {
    cells[cells_to_kill[i][0]][cells_to_kill[i][1]] = DEAD;
  }
}
