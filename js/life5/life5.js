let NG = 0; // number of generations
let TICKS = 10; // clock ticks
let MAXTIME = 100; // max execution time in sec
let RES = 4; // resolution for each cell
let DIM; // dimensions of the grid
let RED, GREEN, BLUE; // rgb components
let DEAD = 0, ALIVE = 1; // cell states
let PERC = 0.6; // percentage of initially alive cells
let CELLS, COLORS; // grid and color array
let gameRunning = false; // track if the game is running or paused
let cellSizeSlider; // slider for adjusting the cell size
let startPauseButton, resetButton, cellSizeLabel; // buttons and label for controlling the game

function setup() {
  createCanvas(640, 480);
  updateDimensions();
  
  // Create the control panel buttons and slider
  startPauseButton = createButton('Start');
  startPauseButton.position(10, height + 10);
  startPauseButton.size(80, 30);
  startPauseButton.mousePressed(toggleStartPause);
  startPauseButton.style('background-color', '#4CAF50');
  startPauseButton.style('color', 'white');
  startPauseButton.style('border-radius', '5px');

  resetButton = createButton('Reset');
  resetButton.position(100, height + 10);
  resetButton.size(80, 30);
  resetButton.mousePressed(resetGame);
  resetButton.style('background-color', '#f44336');
  resetButton.style('color', 'white');
  resetButton.style('border-radius', '5px');

  cellSizeLabel = createDiv('Cell Size:');
  cellSizeLabel.position(200, height + 15);
  cellSizeLabel.style('font-size', '16px');

  cellSizeSlider = createSlider(2, 10, RES, 1);
  cellSizeSlider.position(270, height + 10);
  cellSizeSlider.size(100, 10);
  cellSizeSlider.input(updateCellSize);

  randomize();
  [CELLS, COLORS] = rndCells(PERC);
  frameRate(10); // control the speed of generations
}

function randomize() {
  randomSeed(millis());
}

function rndCells(s) {
  let a = Array(DIM[0]).fill().map(() => Array(DIM[1]).fill(DEAD));
  let c = Array(DIM[0]).fill().map(() => Array(DIM[1]).fill(0));

  for (let i = 1; i < DIM[0] - 1; i++) {
    for (let j = 1; j < DIM[1] - 1; j++) {
      if (random() < s) {
        a[i][j] = ALIVE;
        c[i][j] += 1;
      }
    }
  }
  return [a, c];
}

function drawCells(c, co, rr, gg, bb) {
  for (let x = 1; x < DIM[0] - 1; x++) {
    for (let y = 1; y < DIM[1] - 1; y++) {
      let cc = co[x][y] * c[x][y];
      fill((rr * cc) % 256, (gg * cc) % 256, (bb * cc) % 256);
      noStroke();
      rect(x * RES, y * RES, RES, RES);
    }
  }
}

function updateCells(c, cc, co) {
  for (let i = 1; i < DIM[0] - 1; i++) {
    for (let j = 1; j < DIM[1] - 1; j++) {
      let S = c[i - 1][j + 1] + c[i][j + 1] + c[i + 1][j + 1] +
              c[i - 1][j] + c[i + 1][j] +
              c[i - 1][j - 1] + c[i][j - 1] + c[i + 1][j - 1];

      if (c[i][j] === ALIVE) {
        if (S < 2) {
          cc[i][j] = DEAD; // dies from isolation
        } else if (S === 2 || S === 3) {
          cc[i][j] = ALIVE; // stays alive
          co[i][j] += 1;
        } else {
          cc[i][j] = DEAD; // dies from overcrowding
        }
      } else if (S === 3) {
        cc[i][j] = ALIVE; // resurrects
        co[i][j] += 1;
      } else {
        cc[i][j] = DEAD; // stays dead
      }
    }
  }
  return [cc, co];
}

function mousePressed() {
  if (mouseButton === LEFT) {
    CELLS = setCell(CELLS, mouseX, mouseY); // add a live cell
  } else if (mouseButton === RIGHT) {
    CELLS = clearCell(CELLS, mouseX, mouseY); // kill a cell
  }
}

function setCell(c, x, y) {
  c[Math.floor(x / RES)][Math.floor(y / RES)] = ALIVE;
  return c;
}

function clearCell(c, x, y) {
  c[Math.floor(x / RES)][Math.floor(y / RES)] = DEAD;
  return c;
}

function draw() {
  background(0);
  drawCells(CELLS, COLORS, 3, 2, 4); // Drawing with color values RED=3, GREEN=2, BLUE=4

  if (gameRunning) {
    [CELLS, COLORS] = updateCells(CELLS, copyArray(CELLS), COLORS);
    NG++;
    document.title = `Life Game v.5 - GEN: ${NG}`;
  }
}

function copyArray(arr) {
  return arr.map(row => row.slice());
}

function toggleStartPause() {
  gameRunning = !gameRunning;
  startPauseButton.html(gameRunning ? 'Pause' : 'Start');
}

function resetGame() {
  NG = 0; // Reset the generation count
  randomize(); // Re-randomize the initial grid
  [CELLS, COLORS] = rndCells(PERC); // Generate new cells and colors
  gameRunning = true; // Start the game immediately after reset
  startPauseButton.html('Pause'); // Change the button to "Pause" as the game is now running
  document.title = `Life Game v.5 - GEN: 0`; // Reset the title
}

function updateCellSize() {
  RES = cellSizeSlider.value();
  updateDimensions();
  randomize();
  [CELLS, COLORS] = rndCells(PERC);
}

function updateDimensions() {
  DIM = [Math.floor(width / RES), Math.floor(height / RES)];
}
