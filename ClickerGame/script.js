const gameContainer = document.getElementById("game-container");
const target = document.getElementById("target");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let score = 0;
let timeLeft = 30;
let level = 1;
let moveIntervalTime = 1000; // Initial target movement interval
let gameInterval;
let moveInterval;

function moveTarget() {
    const containerWidth = gameContainer.clientWidth - target.clientWidth;
    const containerHeight = gameContainer.clientHeight - target.clientHeight;

    const randomX = Math.random() * containerWidth;
    const randomY = Math.random() * containerHeight;

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

function startGame() {
    moveTarget();
    target.addEventListener("click", increaseScore);

    gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft % 10 === 0 && timeLeft > 0) {
            levelUp();
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    moveInterval = setInterval(moveTarget, moveIntervalTime);
}

function increaseScore() {
    score++;
    scoreDisplay.textContent = score;

    // Add a visual effect on click
    target.style.transform = "scale(1.2)";
    setTimeout(() => {
        target.style.transform = "scale(1)";
    }, 100);
}

function levelUp() {
    level++;
    moveIntervalTime = Math.max(200, moveIntervalTime - 200); // Decrease interval, min 200ms
    clearInterval(moveInterval);
    moveInterval = setInterval(moveTarget, moveIntervalTime);

    alert(`Level Up! You're now on Level ${level}. Target moves faster!`);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(moveInterval);
    target.removeEventListener("click", increaseScore);

    alert(`Game Over! Your final score is ${score}.`);
    resetGame();
}

function resetGame() {
    score = 0;
    timeLeft = 30;
    level = 1;
    moveIntervalTime = 1000;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    moveTarget();
}

document.addEventListener("DOMContentLoaded", startGame);
