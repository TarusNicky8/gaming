const gameContainer = document.getElementById("game-container");
const character = document.getElementById("character");
const scoreDisplay = document.getElementById("score");

let score = 0;
let isJumping = false;
let jumpHeight = 150;
let gravity = 5;
let obstacles = [];
let collectibles = [];
let gameOver = false;

// Handle character movement
document.addEventListener("keydown", (event) => {
    if (gameOver) return;

    // Jump logic
    if (event.code === "Space" && !isJumping) {
        jump();
    }
});

// Jump function
function jump() {
    isJumping = true;
    let jumpStart = character.offsetTop;

    const jumpInterval = setInterval(() => {
        character.style.top = `${character.offsetTop - gravity}px`;

        // Stop jump at max height
        if (jumpStart - character.offsetTop >= jumpHeight) {
            clearInterval(jumpInterval);

            // Fall back down
            const fallInterval = setInterval(() => {
                character.style.top = `${character.offsetTop + gravity}px`;

                // Stop falling when character hits the ground
                if (character.offsetTop >= gameContainer.offsetHeight - character.offsetHeight - 20) {
                    character.style.top = `${gameContainer.offsetHeight - character.offsetHeight - 20}px`;
                    clearInterval(fallInterval);
                    isJumping = false;
                }
            }, 20);
        }
    }, 20);
}

// Generate obstacles
function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "800px";
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

// Move obstacles
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.style.left = `${obstacle.offsetLeft - 5}px`;

        // Remove obstacle if off screen
        if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
            obstacle.remove();
            obstacles.splice(index, 1);
        }

        // Collision detection
        if (
            obstacle.offsetLeft < character.offsetLeft + character.offsetWidth &&
            obstacle.offsetLeft + obstacle.offsetWidth > character.offsetLeft &&
            character.offsetTop + character.offsetHeight >= obstacle.offsetTop
        ) {
            endGame();
        }
    });
}

// Generate collectibles
function createCollectible() {
    const collectible = document.createElement("div");
    collectible.classList.add("collectible");
    collectible.style.left = `${Math.random() * 700 + 50}px`;
    collectible.style.top = `${Math.random() * 300 + 50}px`;
    gameContainer.appendChild(collectible);
    collectibles.push(collectible);
}

// Collectible logic
function checkCollectibles() {
    collectibles.forEach((collectible, index) => {
        if (
            collectible.offsetLeft < character.offsetLeft + character.offsetWidth &&
            collectible.offsetLeft + collectible.offsetWidth > character.offsetLeft &&
            collectible.offsetTop < character.offsetTop + character.offsetHeight &&
            collectible.offsetTop + collectible.offsetHeight > character.offsetTop
        ) {
            score += 5;
            scoreDisplay.textContent = score;
            collectible.remove();
            collectibles.splice(index, 1);
        }
    });
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    moveObstacles();
    checkCollectibles();

    requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
    gameOver = true;
    alert(`Game Over! Final Score: ${score}`);
    resetGame();
}

// Reset game
function resetGame() {
    obstacles.forEach((obstacle) => obstacle.remove());
    collectibles.forEach((collectible) => collectible.remove());
    obstacles = [];
    collectibles = [];
    score = 0;
    scoreDisplay.textContent = score;
    character.style.top = `${gameContainer.offsetHeight - character.offsetHeight - 20}px`;
    gameOver = false;
    startGame();
}

// Start game
function startGame() {
    setInterval(createObstacle, 2000);
    setInterval(createCollectible, 5000);
    gameLoop();
}

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
    character.style.top = `${gameContainer.offsetHeight - character.offsetHeight - 20}px`;
    startGame();
});
