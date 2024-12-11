const gameContainer = document.getElementById("game-container");
const movesDisplay = document.getElementById("moves");

const items = ["🍎", "🍌", "🍇", "🍓", "🍎", "🍌", "🍇", "🍓"]; // Pairs of items
let shuffledItems = [];
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;

// Shuffle items
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Initialize game
function initGame() {
    shuffledItems = shuffle([...items]);
    shuffledItems.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.item = item;
        card.addEventListener("click", flipCard);
        card.textContent = item;
        gameContainer.appendChild(card);
    });
}

// Handle card flipping
function flipCard() {
    if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

    this.classList.add("flipped");
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

// Check if two flipped cards match
function checkMatch() {
    if (firstCard.dataset.item === secondCard.dataset.item) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;
        resetFlip();

        // Check for game completion
        if (matchedPairs === items.length / 2) {
            setTimeout(() => alert(`You won in ${moves} moves!`), 300);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetFlip();
        }, 1000);
    }
}

// Reset flipped cards
function resetFlip() {
    firstCard = null;
    secondCard = null;
}

// Start the game
initGame();
