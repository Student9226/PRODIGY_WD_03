const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const vsPlayerButton = document.getElementById('vsPlayer');
const vsAIButton = document.getElementById('vsAI');

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let vsAI = false;
let awaitingAIMove = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive || awaitingAIMove) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    if (checkWinner()) {
        displayMessage(`${vsAI && currentPlayer === 'O' ? 'AI' : 'Player ' + currentPlayer} wins!`);
        gameActive = false;
    } else if (gameState.every(cell => cell !== "")) {
        displayMessage("It's a draw!");
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (vsAI && currentPlayer === 'O' && gameActive) {
            awaitingAIMove = true;
            setTimeout(handleAIMove, 500);
        }
    }
}

function checkWinner() {
    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}

function displayMessage(text) {
    message.innerText = text;
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    awaitingAIMove = false;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('X', 'O');
    });
    displayMessage("");
}

function handleAIMove() {
    const availableCells = gameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    
    const winningOrBlockingMove = findBestMove('O') || findBestMove('X');
    const randomIndex = winningOrBlockingMove !== null ? winningOrBlockingMove : availableCells[Math.floor(Math.random() * availableCells.length)];

    gameState[randomIndex] = 'O';
    cells[randomIndex].innerText = 'O';
    cells[randomIndex].classList.add('O');

    if (checkWinner()) {
        displayMessage('AI wins!');
        gameActive = false;
    } else if (gameState.every(cell => cell !== "")) {
        displayMessage("It's a draw!");
        gameActive = false;
    } else {
        currentPlayer = 'X';
    }

    awaitingAIMove = false;
}

function findBestMove(player) {
    for (let [a, b, c] of winningConditions) {
        if (gameState[a] === player && gameState[b] === player && gameState[c] === "") return c;
        if (gameState[a] === player && gameState[c] === player && gameState[b] === "") return b;
        if (gameState[b] === player && gameState[c] === player && gameState[a] === "") return a;
    }
    return null;
}

vsPlayerButton.addEventListener('click', () => {
    vsAI = false;
    resetGame();
    vsPlayerButton.classList.add('active');
    vsAIButton.classList.remove('active');
});

vsAIButton.addEventListener('click', () => {
    vsAI = true;
    resetGame();
    vsAIButton.classList.add('active');
    vsPlayerButton.classList.remove('active');
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
