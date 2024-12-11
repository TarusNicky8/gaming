const gameContainer = document.getElementById("game-container");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");

let basketSpeed = 20;
let basketPosition = gameContainer.clientWidth / 2 - basket.clientWidth / 2;
let score = 0;
let fallingObjects = [];
let gameInterval;
let objectInterval;

// Move basket with arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && basketPosition > 0) {
        basketPosition -= basketSpeed;
    } else if (
        event.key === "ArrowRight" &&
        basketPosition < gameContainer.clientWidth - basket.clientWidth
    ) {
        basketPosition += basketSpeed;
    }
    basket.style.left = `${basketPosition}px`;
});

// Generate a random falling object
function createFallingObject() {
    const object = document.createElement("div");
    object.classList.add("falling-object");

    // Define object types
    const types = [
        { color: "red", points: 1 },    // Regular object
        { color: "green", points: 3 }, // Bonus object
        { color: "blue", points: -1 }  // Penalty object
    ];

    // Randomize object type
    const type = types[Math.floor(Math.random() * types.length)];
    object.style.backgroundColor = type.color;
    object.dataset.points = type.points;

    // Randomize position
    object.style.left = `${Math.random() * (gameContainer.clientWidth - 20)}px`;
    object.style.top = "0px";
    gameContainer.appendChild(object);
    fallingObjects.push(object);
}

// Move falling objects
function moveFallingObjects() {
    fallingObjects.forEach((object, index) => {
        const objectTop = parseInt(object.style.top);

        // Update position
        object.style.top = `${objectTop + 4}px`;

        // Check for collision with basket
        const objectLeft = parseInt(object.style.left);
        const objectRight = objectLeft + object.offsetWidth;
        const basketLeft = basketPosition;
        const basketRight = basketLeft + basket.offsetWidth;

        if (
            objectTop + object.offsetHeight >= gameContainer.clientHeight - basket.offsetHeight &&
            objectRight > basketLeft &&
            objectLeft < basketRight
        ) {
            // Update score based on object type
            score += parseInt(object.dataset.points);
            scoreDisplay.textContent = score;

            // Remove object after catching
            object.remove();
            fallingObjects.splice(index, 1);
        } else if (objectTop > gameContainer.clientHeight) {
            // Remove object if it falls out of the game area
            object.remove();
            fallingObjects.splice(index, 1);

            // Penalize for missed objects (optional)
            score--;
            scoreDisplay.textContent = score;

            // Game over condition
            if (score < 0) {
                clearInterval(gameInterval);
                clearInterval(objectInterval);
                alert("Game Over! Final Score: " + score);
                resetGame();
            }
        }
    });
}

// Start the game
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    basket.style.left = `${basketPosition}px`;

    gameInterval = setInterval(() => {
        moveFallingObjects();
    }, 20);

    objectInterval = setInterval(() => {
        createFallingObject();
    }, 1000);
}

// Reset the game
function resetGame() {
    fallingObjects.forEach((object) => object.remove());
    fallingObjects = [];
    basketPosition = gameContainer.clientWidth / 2 - basket.clientWidth / 2;
    startGame();
}

// Initialize the game
document.addEventListener("DOMContentLoaded", startGame);
