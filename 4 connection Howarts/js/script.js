const rows = 6;
const columns = 7;
const gameBoard = document.getElementById('game-board');
const startBtn = document.getElementById('start-btn');
const endMessage = document.getElementById('end-message');
let board = [];
let currentPlayer = 'player';
let gameStarted = false;

// Recuperar el nombre y la escuela del sessionStorage
const userName = sessionStorage.getItem('userName');
const playerSchool = sessionStorage.getItem('school');

// Elementos del DOM para mostrar el nombre y la imagen
const userNameElement = document.getElementById('user-name');
const schoolImageElement = document.getElementById('school-image');

// Lista de todas las escuelas
const schools = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];

// Función para elegir una escuela diferente a la del jugador
const selectMachineSchool = (playerSchool) => {
    console.log(playerSchool);
    const otherSchools = schools.filter(school => school != playerSchool.toLowerCase());
    console.log(otherSchools);
    return otherSchools[Math.floor(Math.random() * otherSchools.length)];
};

// Escuelas posibles para la máquina (diferente a la seleccionada por el jugador)
const machineSchool = selectMachineSchool(playerSchool);

// Verificar si hay nombre y escuela seleccionados y mostrarlos
if (userName && playerSchool) {
    userNameElement.textContent = "Jugador: " + userName;
    schoolImageElement.src = "./../assets/images/" + playerSchool.toLowerCase() + ".jpeg";
    schoolImageElement.alt = playerSchool;
}

// Función para crear el tablero de juego
const createBoard = () => {
    gameBoard.innerHTML = '';
    board = Array(rows).fill().map(() => Array(columns).fill(null));
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('DIV');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.style.backgroundImage = "";
            cell.addEventListener('click', handleCellClick);
            fragment.appendChild(cell);
        }
    }

    gameBoard.appendChild(fragment);
    gameStarted = true;
    endMessage.classList.add('hidden');
    endMessage.classList.remove('visible');
    currentPlayer = 'player'; 
    console.log("Turno de:", currentPlayer);
};

// Función para manejar el clic en una celda
const handleCellClick = (event) => {
    if (!gameStarted || currentPlayer !== 'player') return;

    const col = parseInt(event.target.dataset.col, 10);
    const row = findAvailableRow(col);
    if (row !== -1) {
        placePiece(row, col, currentPlayer);
        if (checkWin(currentPlayer)) {
            setTimeout(() => showEndMessage(currentPlayer), 10);
            return;
        }
        currentPlayer = 'machine';
        console.log("Cambio de turno a:", currentPlayer);
        setTimeout(machineMove, 500);
    }
};

// Función para encontrar la primera fila disponible en una columna
const findAvailableRow = (col) => {
    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) return row;
    }
    return -1;
};

// Función para colocar la pieza en el tablero
const placePiece = (row, col, player) => {
    board[row][col] = player;
    const cellSelector = ".cell[data-row='" + row + "'][data-col='" + col + "']";
    const cell = document.querySelector(cellSelector);
    if (cell) {
        if (player === "player") {
            cell.style.backgroundImage = "url('./../assets/images/" + playerSchool.toLowerCase() + ".jpeg')";
        } else {
            cell.style.backgroundImage = "url('./../assets/images/" + machineSchool.toLowerCase() + ".jpeg')";
        }
        cell.style.backgroundSize = "cover";
        console.log("Pieza colocada en", row, col, "por", player);
    }
};

// Función para el movimiento de la máquina
const machineMove = () => {
    if (currentPlayer !== 'machine') return;

    console.log("Turno de la máquina");
    let col;
    do {
        col = Math.floor(Math.random() * columns);
    } while (findAvailableRow(col) === -1);

    const row = findAvailableRow(col);
    placePiece(row, col, 'machine');
    if (checkWin('machine')) {
        setTimeout(() => showEndMessage('machine'), 10);
    } else {
        currentPlayer = 'player';
        console.log("Cambio de turno a:", currentPlayer);
    }
};

// Función para verificar si un jugador ha ganado
const checkWin = (player) => {
    const directions = [
        { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: -1 }
    ];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] === player) {
                for (const { r, c } of directions) {
                    if (checkDirection(row, col, r, c, player)) return true;
                }
            }
        }
    }
    return false;
};

// Función para verificar una dirección específica
const checkDirection = (row, col, rDir, cDir, player) => {
    let count = 0;
    for (let i = 0; i < 4; i++) {
        const newRow = row + i * rDir;
        const newCol = col + i * cDir;
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns || board[newRow][newCol] !== player) {
            return false;
        }
        count++;
    }
    return count === 4;
};

// Función para mostrar el mensaje de fin de partida
const showEndMessage = (winner) => {
    if (winner === 'player') {
        endMessage.textContent = '¡Jugador gana!';
    } else {
        endMessage.textContent = '¡Máquina gana!';
    }    
    endMessage.classList.remove('hidden');
    endMessage.classList.add('visible');
    gameStarted = false;
    console.log("Fin del juego:", winner);
};

// Mostrar el tablero al hacer clic en "Iniciar Juego"
startBtn.addEventListener('click', () => {
    gameBoard.classList.remove('hidden');
    createBoard();
});

