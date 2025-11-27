let cols = 100;
let rows = 100;
let cellSize = 4;
let grid = [];
let nextGrid = [];
let running = false;

function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  
  // Inizializza la griglia
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = false;
      nextGrid[i][j] = false;
    }
  }
  
  let startButton = createButton("Start/Pause");
  startButton.position(10, height + 10);
  startButton.mousePressed(toggleRunning);

  let resetButton = createButton("Reset");
  resetButton.position(100, height + 10);
  resetButton.mousePressed(resetGrid);

  let fasterButton = createButton("Faster");
  fasterButton.position(200, height + 10);
  fasterButton.mousePressed(increaseSpeed);

  let slowerButton = createButton("Slower");
  slowerButton.position(300, height + 10);
  slowerButton.mousePressed(decreaseSpeed);
}

function draw() {
  background(220);
  
  // Disegna la griglia
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j]) {
        fill(0, 200, 0);
      } else {
        fill(50);
      }
      noStroke();
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  
  if (running) {
    updateGrid();
  }
}

function mousePressed() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);
  
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    grid[i][j] = !grid[i][j];
  }
}

function updateGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      if (grid[i][j]) {
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = false;
        } else {
          nextGrid[i][j] = true;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[i][j] = true;
        }
      }
    }
  }
  
  // Copia la nextGrid nella grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = nextGrid[i][j];
    }
  }
}

function countNeighbors(x, y) {
  let count = 0;
  
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let ni = (x + i + cols) % cols;
      let nj = (y + j + rows) % rows;
      
      if (i === 0 && j === 0) continue;
      if (grid[ni][nj]) count++;
    }
  }
  return count;
}

function toggleRunning() {
  running = !running;
}

function resetGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = false;
    }
  }
}

let speed = 100;

function increaseSpeed() {
  speed = max(10, speed - 20);
  frameRate(1000 / speed);
}

function decreaseSpeed() {
  speed = min(500, speed + 20);
  frameRate(1000 / speed);
}
