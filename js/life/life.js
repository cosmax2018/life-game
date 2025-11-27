let grid;
let cols;
let rows;
let cellSize = 4;
let running = false;
let speed = 100; // Millisecondi per la velocità di aggiornamento
let generation = 0;
let lastTime = 0;
let generationCount = 0;
let generationsPerSecond = 0;

function setup() {
  createCanvas(640, 480);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  grid = create2DArray(cols, rows);

  // Pulsante per avviare/fermare il gioco
  let startButton = createButton('Start/Pause');
  startButton.position(10, height + 10);
  startButton.mousePressed(toggleRunning);

  // Pulsante per resettare la griglia con celle casuali
  let resetButton = createButton('Reset');
  resetButton.position(100, height + 10);
  resetButton.mousePressed(resetGrid);

  // Pulsante per aumentare la velocità
  let fasterButton = createButton('Faster');
  fasterButton.position(170, height + 10);
  fasterButton.mousePressed(increaseSpeed);

  // Pulsante per rallentare la velocità
  let slowerButton = createButton('Slower');
  slowerButton.position(250, height + 10);
  slowerButton.mousePressed(decreaseSpeed);
  
	// Casella di input per modificare cellSize accanto al pulsante Slower
	let cellSizeInput = createInput(cellSize.toString());
	cellSizeInput.position(330, height + 10); // Posizionata accanto a 'Slower'
	cellSizeInput.size(50);

	// Pulsante per applicare il nuovo valore di cellSize
	let applyButton = createButton('Applica CellSize');
	applyButton.position(390, height + 10); // Posizionata accanto alla casella di input
	applyButton.mousePressed(() => {
	  let newSize = parseInt(cellSizeInput.value());
	  if (!isNaN(newSize) && newSize > 0) {
		cellSize = newSize;
		cols = floor(width / cellSize);
		rows = floor(height / cellSize);
		grid = create2DArray(cols, rows);
		resetGrid(); // opzionale: resetta la griglia dopo il cambio
	  }
	});  
}

function draw() {
  background(0);

  // Disegna la griglia
  stroke(0, 100, 0);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[x][y] === 1) {
        fill(0, 255, 0); // Celle vive (verdi)
      } else {
        fill(50); // Celle morte (grigio scuro)
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Avvia il ciclo del gioco se "running" è attivo
  
  // Conta il numero di generazioni per secondo
  let currentTime = millis(); // Tempo corrente in millisecondi
  if (currentTime - lastTime > 1000) { // Ogni secondo
    generationsPerSecond = generationCount; // Assegna il numero di generazioni al secondo
    generationCount = 0; // Reset del contatore delle generazioni
    lastTime = currentTime; // Aggiorna il tempo di riferimento
  }
  
  if (running) {
    grid = nextGeneration(grid);
	generation++;
	generationCount++; // Incrementa il contatore delle generazioni
	}
	
  // Visualizza il numero di generazioni e FPS
  fill(255);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(`Gen.: ${generation}`, width - 10, 10);
  text(`FPS: ${frameRate().toFixed(2)}`, width - 10, 30);
  text(`Gen/sec: ${generationsPerSecond}`, width - 10, 50);	
  
}

// Funzione per creare un array bidimensionale
function create2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

// Funzione per calcolare la generazione successiva
function nextGeneration(grid) {
  let next = create2DArray(cols, rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let state = grid[x][y];
      let neighbors = countNeighbors(grid, x, y);
      
      // Regole di Conway
      if (state === 0 && neighbors === 3) {
        next[x][y] = 1; // Cella morta con esattamente 3 vicini vive
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[x][y] = 0; // Cella viva con meno di 2 o più di 3 vicini muore
      } else {
        next[x][y] = state; // Altrimenti la cella rimane invariata
      }
    }
  }
  return next;
}

// Funzione per contare i vicini di una cella
function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y]; // Rimuovi la cella stessa dal conteggio
  return sum;
}

// Gestisci il clic del mouse per attivare/disattivare le celle
function mousePressed() {
  let x = floor(mouseX / cellSize);
  let y = floor(mouseY / cellSize);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = grid[x][y] === 1 ? 0 : 1; // Toggle tra 1 (vivo) e 0 (morto)
  }
}

// Funzione per cambiare lo stato di "running" (avvia/pausa)
function toggleRunning() {
  running = !running;
}

// Funzione per resettare la griglia con celle vive in posizioni casuali
function resetGrid() {
  grid = create2DArray(cols, rows);
  
  // Crea un numero casuale di celle vive
  let n = rows*cols
  let numAliveCells = floor(random(.2*n, .8*n)); // Cambia questo valore per più o meno celle vive
  for (let i = 0; i < numAliveCells; i++) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    grid[x][y] = 1;
  }
}

// Funzione per aumentare la velocità
function increaseSpeed() {
  speed = max(50, speed - 20); // Rende più veloce
  frameRate(1000 / speed);
}

// Funzione per rallentare la velocità
function decreaseSpeed() {
  speed = min(500, speed + 20); // Rende più lento
  frameRate(1000 / speed);
}
