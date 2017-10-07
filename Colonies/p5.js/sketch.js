// In this script, 0 = male, 1 = female
var MALE = 0;
var FEMALE = 1;
var BREEDING_DELAY = 1;  // waits this amount of gens before breeding again
var MUATTION_CHANCE = 1;  // 1/MUATTION_CHANCE+1 chance of new cells mutating
var MUT_RANGE = 5; // cells health & strength can change from -MUT_RANGE to MUT_RANGE

var cells = [];
var GEN = 0;
var CA = 40 // CA grid is CAxCA then upscaled to VIS (so CA*CA amount of cells)
var VIS = 800; // Visual grid is VISxVIS (VIS*VIS amount of pixels)

function setup() {
  // Variables that need to be re-initialized when setup() is called
  // CA_ROWS and CA_COLUMNS could be one variable but are named for clarity
  CA_ROWS = CA;
  CA_COLUMNS = CA;
  CELL_SIZE = VIS/CA;

  // 2 colours per colony, for male & female. Female = lighter
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
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
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
  this.sex = rand_int(0, 1);
  this.gsb = 0;  // gsb = gens since breeding

  let base = COLONIES[colony];
  // for (i=0; i<3; i++) {
  //   base[i] += strength;
  // }
  this.colour = color(base[0], base[1], base[2] + (strength*2));
}

function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init_cells() {
  for (var r = 0; r < CA_ROWS; r++) {
    clmns = [];
    for (var c = 0; c < CA_COLUMNS; c++) {
      clmns.push(0);
    }
    cells.push(clmns);
  }
  for (var i = 0; i < 10; i++) {
    cells[0][i] = new cell(0, 5, 10);
  }
  for (var i = 0; i < 10; i++) {
    cells[CA_ROWS-1][i] = new cell(1, 5, 10);
  }
  for (var i = 1; i < 11; i++) {
    cells[0][CA_COLUMNS-i] = new cell(2, 5, 10);
  }
  for (var i = 1; i < 11; i++) {
    cells[CA_ROWS-1][CA_COLUMNS-i] = new cell(3, 5, 10);
  }
}

/*
  NEIGHBOUR FUNCTIONS
*/
function neighbouring_cells(r, c) {
  // Returns neighbours in random order
  var rn = [];
  var n = [[r-1, c-1], [r-1, c], [r-1, c+1],
           [r, c-1], [r, c+1],
           [r+1, c-1], [r+1, c], [r+1, c+1]];
  var nl = n.length;
  for (var i = 0; i < nl; i++) {
    var ri = rand_int(0, n.length-1);
    rn.push(n.splice(ri, 1)[0]);
  }
  return rn;
}

function get_male_neighbour(r, c, colony) {
  var n = neighbouring_cells(r, c);
  for (var i = 0; i < n.length; i++) {
    if (n[i][0] != -1 && n[i][1] != -1 && n[i][0] != CA_ROWS && n[i][1] != CA_COLUMNS && cells[n[i][0]][n[i][1]] != 0) {
      if (cells[n[i][0]][n[i][1]].sex == MALE && cells[n[i][0]][n[i][1]].colony == colony) {
        return n[i];
      }
    }
  }
  return false;
}

function get_empty_neighbour(r, c) {
  var n = neighbouring_cells(r, c);
  for (var i = 0; i < n.length; i++) {
    if (n[i][0] != -1 && n[i][1] != -1 && n[i][0] != CA_ROWS && n[i][1] != CA_COLUMNS) {
      if (cells[n[i][0]][n[i][1]] == 0) {
        return n[i];
      }
    }
  }
  return false;
}

function get_neighbouring_enemy(r, c, colony) {
  var n = neighbouring_cells(r, c);
  for (var i = 0; i < n.length; i++) {
    if (n[i][0] != -1 && n[i][1] != -1 && n[i][0] != CA_ROWS && n[i][1] != CA_COLUMNS && cells[n[i][0]][n[i][1]] != 0) {
      if (cells[n[i][0]][n[i][1]].colony != colony) {
        return n[i];
      }
    }
  }
  return false;
}
/*
  END
*/

function tick() {
  // Breeding stage (mutations need fixing)
  var breeding_change = [];
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      var cc = cells[r][c];  // cc = current cell
      if (cc != 0) {
        if (cc.sex == FEMALE) {
          cc.gsb++;
          var mn = get_male_neighbour(r, c, cc.colony);
          var en = get_empty_neighbour(r, c);
          if (mn && en && cc.gsb >= BREEDING_DELAY) {
            cc.gsb = 0;

            // Mutation
            var e_strength = cc.strength;
            var e_health = cc.health;
            if (rand_int(0, MUATTION_CHANCE) == 0 && e_strength >= MUT_RANGE && e_health > MUT_RANGE) {
              e_strength += rand_int(-MUT_RANGE, MUT_RANGE);
              // e_health += rand_int(-MUT_RANGE, MUT_RANGE);
            }

            breeding_change.push([en[0], en[1], cc.colony, e_strength, e_health]);
          }
        }
      }
    }
  }
  //// Create cells after calculations to prevent skew to left
  for (var i = 0; i < breeding_change.length; i++) {
    var breeding_arr = breeding_change[i];
    cells[breeding_arr[0]][breeding_arr[1]] = new cell(breeding_arr[2], breeding_arr[3], breeding_arr[4]);
  }
  // END

  // Fighting stage
  var cells_to_kill = []
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      var cc = cells[r][c];
      if (cc != 0) {
        var en = get_neighbouring_enemy(r, c, cc.colony);
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
  //// Destroy cells after calculations to prevent skew to left
  for (var i = 0; i < cells_to_kill.length; i++) {
    cells[cells_to_kill[i][0]][cells_to_kill[i][1]] = 0;
  }
  // END

  // For each colony, amount of cells, total strength, total health, total age (also age all cells by 1 gen)
  var colony_totals = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  for (var r = 0; r < CA_ROWS; r++) {
    for (var c = 0; c < CA_COLUMNS; c++) {
      var cc = cells[r][c];
      if (cc != 0) {
        cells[r][c].age += 1;
        colony_totals[cc.colony][0] += 1;
        colony_totals[cc.colony][1] += cc.strength;
        colony_totals[cc.colony][2] += cc.health;
        colony_totals[cc.colony][3] += cc.age;
      }
    }
  }
  // END

  // This could probably be optimised
  document.getElementById("stat0").innerHTML = "Colony Orange\n\n\tAlive      | " + colony_totals[0][0] + "\n\tAvg str    | " + int(colony_totals[0][1]/colony_totals[0][0]) + "\n\tAvg health | " + int(colony_totals[0][2]/colony_totals[0][0]) + "\n\tAvg age    | " + int(colony_totals[0][3]/colony_totals[0][0]) +
  "\n\n\nColony Green\n\n\tAlive      | " + colony_totals[1][0] + "\n\tAvg str    | " + int(colony_totals[1][1]/colony_totals[1][0]) + "\n\tAvg health | " + int(colony_totals[1][2]/colony_totals[1][0]) + "\n\tAvg age    | " + int(colony_totals[1][3]/colony_totals[1][0]) +
  "\n\n\nColony Blue\n\n\tAlive      | " + colony_totals[2][0] + "\n\tAvg str    | " + int(colony_totals[2][1]/colony_totals[2][0]) + "\n\tAvg health | " + int(colony_totals[2][2]/colony_totals[2][0]) + "\n\tAvg age    | " + int(colony_totals[2][3]/colony_totals[2][0]) +
  "\n\n\nColony Pink\n\n\tAlive      | " + colony_totals[3][0] + "\n\tAvg str    | " + int(colony_totals[3][1]/colony_totals[3][0]) + "\n\tAvg health | " + int(colony_totals[3][2]/colony_totals[3][0]) + "\n\tAvg age    | " + int(colony_totals[3][3]/colony_totals[3][0]);
  GEN++;
}
