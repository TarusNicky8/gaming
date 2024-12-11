const gameContainer = document.getElementById("game-container");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");

let paddleSpeed = 15;
let ballSpeed = { x: 4, y: 4 };
let paddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2;
let ballPosition = { x: 290, y: 200 };
let score = 0;
let isGameOver = false;

const gameContainerWidth = gameContainer.clientWidth;
const gameContainerHeight = gameContainer.clientHeight;

// Move the paddle with arrow keys
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
        score++;
        scoreDisplay.textContent = score;

        // Increase ball speed as a bonus feature
        if (score % 5 === 0) {
            ballSpeed.x *= 1.1;
            ballSpeed.y *= 1.1;
        }
    }

    // Ball missed paddle (Game Over)
    if (ballPosition.y > gameContainerHeight) {
        isGameOver = true;
        alert(`Game Over! Your score is ${score}`);
        resetGame();
        return;
    }

    // Update ball position in DOM
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    requestAnimationFrame(moveBall);
}

function resetGame() {
    paddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2;
    ballPosition = { x: 290, y: 200 };
    ballSpeed = { x: 4, y: 4 };
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;

    // Reset DOM positions
    paddle.style.left = `${paddlePosition}px`;
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    moveBall();
}

// Start the game
document.addEventListener("DOMContentLoaded", () => {
    paddle.style.left = `${paddlePosition}px`;
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;
    moveBall();
});
