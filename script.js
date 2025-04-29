const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;            // size of each cell in px
const tileCount = canvas.width / gridSize;

let snake = [ { x: 10, y: 10 } ];  // array of segments
let velocity = { x: 0, y: 0 };     // movement direction
let fruit = { x: 5, y: 5 };        // fruit position
let score = 0;
let gameOver = false;

// Listen for arrow keys
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (velocity.y === 0) velocity = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (velocity.y === 0) velocity = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (velocity.x === 0) velocity = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (velocity.x === 0) velocity = { x: 1, y: 0 };
      break;
  }
});

// Main game loop: update & draw at 10 frames per second
setInterval(() => {
  // if (gameOver) return alert('Game Over! Your score: ' + score);
  update();
  draw();
}, 1000 / 10);


function update() {
  // Move head
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
    return;
  }

  // Self-collision
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver = true;
      return;
    }
  }

  // Add new head to front of snake
  snake.unshift(head);

  // Fruit collision
  if (head.x === fruit.x && head.y === fruit.y) {
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    placeFruit();
  } else {
    // remove tail if no fruit eaten
    snake.pop();
  }
}

function draw() {
  // Clear
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#28a745';
  for (let segment of snake) {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  // Draw fruit
  ctx.fillStyle = '#dc3545';
  ctx.fillRect(
    fruit.x * gridSize,
    fruit.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}

// Randomly place fruit not on the snake
function placeFruit() {
  fruit.x = Math.floor(Math.random() * tileCount);
  fruit.y = Math.floor(Math.random() * tileCount);
  // re-roll if on snake
  if (snake.some(s => s.x === fruit.x && s.y === fruit.y)) {
    placeFruit();
  }
}
