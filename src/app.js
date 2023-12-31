const gameBoard = ((size) => {
    const _createArrayBoard = (size) => {
        const constructedArray = new Array(size);
        for (let i = 0; i < size; i++) {
            constructedArray[i] = new Array(size);
        }
        return constructedArray;
    }

    const _arrayBoard = _createArrayBoard(size); 
    const displayBoard = () => _arrayBoard;

    const _isEmptySquare = (row,col) => (_arrayBoard[row][col] === undefined);

    const add = (string, row, col) => {
        if (row >= size || col >= size || row < 0 || col < 0){
            console.log('attempted to add beyond grid bounds');
            return false;
        }
        if (_isEmptySquare(row,col)) {
            _arrayBoard[row][col] = string;
            return true;
        }
        console.log('Is already taken');
        return false;
    }

    const clearBoard = () => {
        for (row of _arrayBoard) {
            for (let i = 0; i < row.length; i++) {
                row[i] = undefined;
            }
        }
    }

    return {
        clearBoard,
        displayBoard,
        add,
    }
})(3);

const playerFactory = (mark, isTurnInitial, source) => {
    let isTurn = isTurnInitial;

    const swapTurn = () => {
        isTurn = !isTurn;
    };
    const getTurn = () => isTurn;

    return {
        getTurn,
        swapTurn,
        mark,
        source,
    };
}
const user = playerFactory('x', true, '../icons/x.svg');
const computer = playerFactory('o', false, '../icons/circle.svg');

const gameController = ((player1, player2, board) => {
    const _playerArray = [player1, player2];
    let _currentPlayer = null;
    let _otherplayer = null;

    if (_playerArray[0].getTurn() === true) {
        _currentPlayer = _playerArray[0];
        _otherplayer = _playerArray[1];
    }
    else {
        _currentPlayer = _playerArray[1];
        _otherplayer = _playerArray[0];
    };

    const getCurrentPlayer = () => _currentPlayer;
    const getOtherPlayer = () => _otherplayer;
    const _swapPlayers = () => {
        let hold = _otherplayer;
        _otherplayer = _currentPlayer;
        _currentPlayer = hold;
    };

    const add = (row,col) => {
        if (!_currentPlayer.getTurn()) {
            console.log(`its not ${JSON.stringify(_currentPlayer)}'s turn`);
            return false;
        }
        if (board.add(_currentPlayer.mark, row, col)) {
            if (_isWin()) {
                console.log(`${_currentPlayer.mark} has won!`);
                gamePlay.endGame(_currentPlayer);
                return _currentPlayer;
            }
            _currentPlayer.swapTurn();
            _otherplayer.swapTurn();
            _swapPlayers();
            return true;
        }
    };

    const _isWin = () => {
        const boardToCheck = board.displayBoard();
        const length = boardToCheck.length;
        const vertCountArray = new Array(length).fill(0);
        let horzCount = 0;
        let diagCount = 0;
        let inverseDiagCount = 0;
        for (let i = 0; i < length; i++) {
            horzCount = 0;
            for (let j=0; j < length; j++) {
                if (boardToCheck[i][j] === _currentPlayer.mark) {
                    vertCountArray[j]++;
                    horzCount++;
                    if (i === j) {
                        diagCount++;
                    }
                    if (i+j === length - 1) {
                        inverseDiagCount++;
                    }
                }
            }
            if (horzCount === length || diagCount === length || inverseDiagCount === length) {
                return true;
            }
        }
        if (vertCountArray.some((number) => number === length)) {
            return true;
        }
        return false;
    }

    return {
        getCurrentPlayer,
        getOtherPlayer,
        add,
    };
})(user,computer,gameBoard);

const scriptToDOM = ((playerX, playerO) => {
    const insert = (parent, player, isHover = false) => {
        if (parent.hasChildNodes()) {
            parent.children[0].classList.remove('faded');
            return;
        }
        const image = document.createElement('img');
        image.src = player.source;
        image.classList.add(player.mark);
        if (isHover) {
            image.classList.add('faded');
        }
        parent.appendChild(image);
    };

    const updateDomGrid = (parent) => {
        const board = gameBoard.displayBoard();
        const length = board.length;
        let currentRow;
        let sourceString;
        for (let i = 0; i < length; i++) {
            currentRow = parent.children[i];
            for (let j = 0; j < length; j++) {
                if (!currentRow.children[j].hasChildNodes() || currentRow.children[j].children[0].classList.contains('faded')){
                    if (board[i][j] == playerO.mark) {
                        insert(currentRow.children[j], playerO);
                    }
                    else if (board[i][j] == playerX.mark) {
                        sourceString = playerX.source;
                        insert(currentRow.children[j], playerX);
                    }
                }
            }
        }
    };

    const clearDomGrid = (array) => {
        for (button of array) {
            if (button.hasChildNodes()){
                for (element of button.children){
                    element.remove();
                };
            };
        };
    };

    return {
        updateDomGrid,
        clearDomGrid,
        insert,
    };
})(user, computer);

const tttbox = document.getElementById('tttbox');
const tttbuttonArray = document.querySelectorAll('.tttbutton');

const gamePlay = ((sideLength) => {
    let _controller;
    const startGame = () => {
        _controller = new AbortController;
        _signalToRemoveEventListener = _controller.signal;
        scriptToDOM.clearDomGrid(tttbuttonArray);
        gameBoard.clearBoard();
        for (let i = 0; i < sideLength; i++) {
            for (let j = 0; j < sideLength; j++) {
                tttbuttonArray[sideLength*i+j].addEventListener("click", (e) => {
                    gameController.add(i,j);
                    scriptToDOM.updateDomGrid(tttbox);
                }, {signal: _signalToRemoveEventListener});
                tttbuttonArray[sideLength*i+j].addEventListener('mouseenter', (e) => {
                    scriptToDOM.insert(e.target, gameController.getCurrentPlayer(), true);
                }, {signal: _signalToRemoveEventListener});
                tttbuttonArray[sideLength*i+j].addEventListener('mouseleave', (e) => {
                    if (e.target.children[0].classList.contains('faded')) {
                        e.target.children[0].remove();
                    }
                }, {signal: _signalToRemoveEventListener});
            }
        }
    };

    const endGame = (player) => {
        _controller.abort();
        /* TODO 
        display
        - winner of game
        - button to restart game
        */
    }

    return {
        startGame,
        endGame,
    }
})(tttbuttonArray.length**0.5);

gamePlay.startGame()


/* 
En

*/

const retryButton = document.querySelector('#retry-bttn');
retryButton.addEventListener('mouseup', () => {
    gamePlay.endGame(); 
    gamePlay.startGame()
});