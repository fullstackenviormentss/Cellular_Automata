// In this script, 0 = male, 1 = female
var MALE = 0;
var FEMALE = 1;
var BREEDING_DELAY = 1;  // waits this amount of gens before breeding again
var MUATTION_CHANCE = 1;  // 1/MUATTION_CHANCE+1 chance of new cells mutating
var MUT_RANGE = 5; // cells health & strength can change from -MUT_RANGE to MUT_RANGE

var cells = [];
var GEN = 0;
var CA = 100 // CA grid is CAxCA then upscaled to VIS (so CA*CA amount of cells)
var VIS = 800; // Visual grid is VISxVIS (VIS*VIS amount of pixels)

function setup() {
  // Variables that need to be re-initialized when setup() is called
  CA_ROWS = CA;
  CA_COLUMNS = CA;
  VIS_ROWS = VIS;
  VIS_COLUMNS = VIS;
  CELL_SIZE = VIS_ROWS/CA_ROWS;

  // 2 colours per colony, for male & female. Female = lighter
  COLONIES = [[color(204, 102, 0), color(204, 155, 0)], [color(146, 141, 0), color(146, 197, 0)], [color(84, 24, 203), color(84, 183, 203)]];

  createCanvas(VIS_COLUMNS, VIS_ROWS);
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

function cell(colony, strength, health, age, sex) {
  // Cell "class"
  this.colony = colony;
  this.strength = strength;
  this.health = health;
  this.age = age;
  this.sex = sex;
  this.gsb = 0;  // gsb = gens since breeding
  this.colour = COLONIES[colony][sex];
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
    var sex = rand_int(0, 1);
    cells[0][i] = new cell(0, 5, 10, 0, sex);
  }
  for (var i = 0; i < 10; i++) {
    var sex = rand_int(0, 1);
    cells[CA_ROWS-1][i] = new cell(1, 5, 10, 0, sex);
  }
  for (var i = 0; i < 10; i++) {
    var sex = rand_int(0, 1);
    cells[(CA_ROWS/2)-5+i][CA_COLUMNS-1] = new cell(2, 5, 10, 0, sex);
  }
}

/*
  NEIGHBOUR FUNCTIONS
*/
function neighbouring_cells(r, c) {
  return [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c-1], [r, c+1],
          [r+1, c-1], [r+1, c], [r+1, c+1]];
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
  // Breeding stage (mutations not implemented yet)
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
              e_health += rand_int(-MUT_RANGE, MUT_RANGE);
            }

            var e_sex = rand_int(0, 1);
            cells[en[0]][en[1]] = new cell(cc.colony, e_strength, e_health, 0, e_sex);
          }
        }
      }
    }
  }
  // Fighting stage
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
            // Remove cell object from array
            cells[r][c] = 0;
          }
          if (en_c.health <= 0) {
            cells[en[0]][en[1]] = 0;
          }
        }
      }
    }
  }
  // For each colony, amount of cells, total strength, total health, total age (also age all cells by 1 gen)
  var colony_totals = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
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
  document.getElementById("stat0").innerHTML = "Colony 0: Alive: " + colony_totals[0][0] + " Avg str: " + int(colony_totals[0][1]/colony_totals[0][0]) + " Avg health: " + int(colony_totals[0][2]/colony_totals[0][0]) + " Avg age: " + int(colony_totals[0][3]/colony_totals[0][0]);
  document.getElementById("stat1").innerHTML = "Colony 1: Alive: " + colony_totals[1][0] + " Avg str: " + int(colony_totals[1][1]/colony_totals[1][0]) + " Avg health: " + int(colony_totals[1][2]/colony_totals[1][0]) + " Avg age: " + int(colony_totals[1][3]/colony_totals[1][0]);
  document.getElementById("stat2").innerHTML = "Colony 2: Alive: " + colony_totals[2][0] + " Avg str: " + int(colony_totals[2][1]/colony_totals[2][0]) + " Avg health: " + int(colony_totals[2][2]/colony_totals[2][0]) + " Avg age: " + int(colony_totals[2][3]/colony_totals[2][0]);
  GEN++;
}
