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

  createCanvas(VIS_COLUMNS, VIS_ROWS);
  background(0);
  noSmooth();
  noStroke();
  init_cells();
}

function draw() {
}
