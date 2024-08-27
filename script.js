const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basketWidth = 100;
const basketHeight = 20;
const eggSize = 30;
const gravity = 0.5;
const fallSpeed = 2;
const maxFallenEggs = 3;
const henWidth = 60;
const henHeight = 40;

let basketX = canvas.width / 2 - basketWidth / 2;
let basketY = canvas.height - basketHeight;
let eggs = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let fallenEggs = 0;
let eggInterval = 2000; // Time in milliseconds to add a new egg
let lastEggTime = 0;
let henX = canvas.width / 2 - henWidth / 2;
let henDirection = 1; // 1 for right, -1 for left

// Draw pixel art for open basket
function drawBasket() {
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 5;
    ctx.strokeRect(basketX, basketY, basketWidth, basketHeight);
    ctx.beginPath();
    ctx.moveTo(basketX, basketY);
    ctx.lineTo(basketX + basketWidth, basketY);
    ctx.stroke();
}

// Draw pixel art for egg
function drawEgg(x, y) {
    ctx.fillStyle = '#ffff00'; // Yellow color
    ctx.fillRect(x, y, eggSize, eggSize);
    ctx.strokeRect(x, y, eggSize, eggSize); // Outline for better visibility
}

// Draw pixel art for hen
function drawHen() {
    // Body
    ctx.fillStyle = '#ff0000'; // Red color
    ctx.fillRect(henX, 50, henWidth, henHeight);

    // Head
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(henX + 10, 30, 40, 30);

    // Eyes
    ctx.fillStyle = '#ffffff'; // White color
    ctx.fillRect(henX + 15, 40, 10, 10);
    ctx.fillRect(henX + 25, 40, 10, 10);

    // Beak
    ctx.fillStyle = '#ffa500'; // Orange color
    ctx.fillRect(henX + 20, 50, 10, 10);
}

// Update egg positions and check for fallen eggs
function updateEggs() {
    const currentTime = Date.now();
    if (currentTime - lastEggTime > eggInterval && fallenEggs < maxFallenEggs) {
        eggs.push({ x: henX + henWidth / 2 - eggSize / 2, y: 60 });
        lastEggTime = currentTime;
    }

    eggs.forEach((egg, index) => {
        egg.y += fallSpeed;
        if (egg.y > canvas.height) {
            eggs.splice(index, 1);
            fallenEggs++;
            document.getElementById('fallenEggs').textContent = fallenEggs;
            if (fallenEggs >= maxFallenEggs) {
                endGame();
            }
        }
    });
}

// Check if basket catches an egg
function checkCollision(egg) {
    return egg.x < basketX + basketWidth &&
           egg.x + eggSize > basketX &&
           egg.y < basketY + basketHeight &&
           egg.y + eggSize > basketY;
}

// Update score and check for high score
function updateScore() {
    eggs.forEach((egg, index) => {
        if (checkCollision(egg)) {
            score++;
            eggs.splice(index, 1);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                document.getElementById('highScore').textContent = highScore;
            }
        }
    });

    document.getElementById('score').textContent = score;
}

// Move hen back and forth
function moveHen() {
    henX += henDirection * 2;
    if (henX <= 0 || henX >= canvas.width - henWidth) {
        henDirection *= -1; // Change direction
    }
}

// End the game and show restart button
function endGame() {
    alert('Game Over!');
    document.getElementById('restartButton').style.display = 'block';
}

// Restart the game
function restartGame() {
    score = 0;
    fallenEggs = 0;
    eggs = [];
    document.getElementById('score').textContent = score;
    document.getElementById('fallenEggs').textContent = fallenEggs;
    document.getElementById('restartButton').style.display = 'none';
    lastEggTime = Date.now();
}

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHen();
    drawBasket();
    eggs.forEach(egg => drawEgg(egg.x, egg.y));
    updateEggs();
    updateScore();
    moveHen();

    requestAnimationFrame(draw);
}

// Move the basket based on keyboard input
function moveBasket(event) {
    const key = event.key;
    if (key === 'ArrowLeft' && basketX > 0) {
        basketX -= 20;
    } else if (key === 'ArrowRight' && basketX < canvas.width - basketWidth) {
        basketX += 20;
    }
}

// Event listeners
document.addEventListener('keydown', moveBasket);
document.getElementById('restartButton').addEventListener('click', restartGame);

draw();
