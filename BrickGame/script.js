const gameContainer = document.getElementById("game-container");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

let paddleSpeed = 15;
let ballSpeed = { x: 4, y: -4 };
let paddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2;
let ballPosition = { x: 290, y: 300 };
let score = 0;
let lives = 3;
let bricks = [];
let isGameOver = false;

const gameContainerWidth = gameContainer.clientWidth;
const gameContainerHeight = gameContainer.clientHeight;

// Create bricks
function createBricks(rows, cols) {
    const brickWidth = 60;
    const brickHeight = 20;
    const brickPadding = 10;
    const offsetTop = 30;
    const offsetLeft = 20;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const brickX = offsetLeft + col * (brickWidth + brickPadding);
            const brickY = offsetTop + row * (brickHeight + brickPadding);
            const brick = document.createElement("div");
            brick.classList.add("brick");
            brick.style.left = `${brickX}px`;
            brick.style.top = `${brickY}px`;
            gameContainer.appendChild(brick);
            bricks.push(brick);
        }
    }
}

// Move paddle with arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && paddlePosition > 0) {
        paddlePosition -= paddleSpeed;
    } else if (
        event.key === "ArrowRight" &&
        paddlePosition < gameContainerWidth - paddle.clientWidth
    ) {
        paddlePosition += paddleSpeed;
    }
    paddle.style.left = `${paddlePosition}px`;
});

// Move ball
function moveBall() {
    if (isGameOver) return;

    // Update ball position
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;

    // Ball collision with walls
    if (ballPosition.x <= 0 || ballPosition.x >= gameContainerWidth - ball.clientWidth) {
        ballSpeed.x *= -1; // Reverse direction
    }
    if (ballPosition.y <= 0) {
        ballSpeed.y *= -1; // Reverse direction
    }

    // Ball collision with paddle
    if (
        ballPosition.y >= gameContainerHeight - paddle.clientHeight - ball.clientHeight &&
        ballPosition.x + ball.clientWidth > paddlePosition &&
        ballPosition.x < paddlePosition + paddle.clientWidth
    ) {
        ballSpeed.y *= -1; // Reverse direction
    }

    // Ball collision with bricks
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        const brickRect = brick.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        if (
            ballRect.left < brickRect.right &&
            ballRect.right > brickRect.left &&
            ballRect.top < brickRect.bottom &&
            ballRect.bottom > brickRect.top
        ) {
            brick.remove();
            bricks.splice(i, 1);
            ballSpeed.y *= -1;
            score++;
            scoreDisplay.textContent = score;
            break;
        }
    }

    // Ball misses paddle
    if (ballPosition.y > gameContainerHeight) {
        lives--;
        livesDisplay.textContent = lives;

        if (lives === 0) {
            isGameOver = true;
            alert(`Game Over! Your final score is ${score}`);
            resetGame();
            return;
        }

        // Reset ball position
        ballPosition = { x: 290, y: 300 };
        ballSpeed = { x: 4, y: -4 };
    }

    // Check for win
    if (bricks.length === 0) {
        isGameOver = true;
        alert(`Congratulations! You won with a score of ${score}`);
        resetGame();
        return;
    }

    // Update ball position in DOM
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    requestAnimationFrame(moveBall);
}

// Reset game
function resetGame() {
    bricks.forEach((brick) => brick.remove());
    bricks = [];
    score = 0;
    lives = 3;
    ballPosition = { x: 290, y: 300 };
    ballSpeed = { x: 4, y: -4 };
    paddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2;
    isGameOver = false;

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    paddle.style.left = `${paddlePosition}px`;
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    createBricks(4, 8);
    moveBall();
}

// Start game
document.addEventListener("DOMContentLoaded", () => {
    paddle.style.left = `${paddlePosition}px`;
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;
    createBricks(4, 8); // Create 4 rows and 8 columns of bricks
    moveBall();
});
