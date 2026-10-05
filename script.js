// IIFE for gameboard
const Gameboard = (() => {
    let board = ['','','','','','','','',''];
    
    const getBoard = () => board;

    const boardUpdate = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    }; // check if marker placement is valid

    // board reset
    const reset = () => {
        board = ['','','','','','','','',''];
    };

    return {
        getBoard, boardUpdate, reset
    };
})();

// Player factory function
const player = (name, marker) => {
    return {
        name, marker
    };
};

// Game Controller IIFE
const GameController = (() => {
    let players = [];
    let currentPlayerIndex;
    let isGameOver;

    //win conditions
    const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    //start game
    const start = (player1, player2) => {
        players = [
            player(player1 || 'Player1', 'X'),
            player(player2 || 'Player2', 'O') // if no name is entered, default name is used
        ];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.reset();
        displayController.render();
        displayController.setMessage(`${players[0].name}'s turn (X)`);
    };

    // win check
    const winCheck = (board, marker) => {
        return winConditions.some(pattern =>
            pattern.every(index => board[index] === marker)
        );
    };

    // tie check
    const tieCheck = (board) => {
        return board.every(cell => cell !== '');
    };

    // player turn system
    const playerTurn = (index) => {
        if (isGameOver) {
            return;
        }

        const currentPlayer = players[currentPlayerIndex];

        if (Gameboard.boardUpdate(index, currentPlayer.marker)) {
            displayController.render();

            const board = Gameboard.getBoard();

            if (winCheck(board, currentPlayer.marker)) {
                isGameOver = true;
                displayController.setMessage(`${currentPlayer.name} wins!`);
            } else if (tieCheck(board)) {
                isGameOver = true;
                displayController.setMessage(`Tie!`);
            } else {
                currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
                displayController.setMessage(`${players[currentPlayerIndex].name}'s turn (${players[currentPlayerIndex].marker})`);
            }
        }
    };

    return {
        start, playerTurn
    }
})();

// DOM section IIFE
const displayController = (() => {
    const boardElement = document.querySelector('#gameboard');
    const messageElement = document.querySelector('#message');
    const restartBtn = document.querySelector('#restart-button');
    const p1 = document.querySelector('#player1');
    const p2 = document.querySelector('#player2');

    const render = () => {
        boardElement.innerHTML = '';
        const board = Gameboard.getBoard();

        board.forEach((cell, index) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.textContent = cell;
            square.addEventListener('click', () => GameController.playerTurn(index));
            boardElement.appendChild(square);
        });
    };

    const setMessage = (msg) => {
        messageElement.textContent = msg;
    };

    restartBtn.addEventListener('click', () => {
        GameController.start(p1.value, p2.value);
    });

    return {
        render, setMessage
    }
})();

GameController.start('Player1', 'Player2');