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

    return {
        displayBoard,
        add,
    }
})(3);

const playerFactory = (mark, isTurnInitial) => {
    let isTurn = isTurnInitial;

    const swapTurn = () => {
        isTurn = !isTurn;
    };
    const getTurn = () => isTurn;

    return {
        getTurn,
        swapTurn,
        mark,
    };
}
const user = playerFactory('x', true);
const computer = playerFactory('o', false);

const gameController = ((player1, player2, board) => {
    const _playerArray = [player1, player2];
    let _currentPlayer = null;
    let _otherPlayer = null;

    if (_playerArray[0].getTurn() === true) {
        _currentPlayer = _playerArray[0];
        _otherPlayer = _playerArray[1];
    }
    else {
        _currentPlayer = _playerArray[1];
        _otherPlayer = _playerArray[0];
    };

    const getCurrentPlayer = () => console.log(`current player = ${JSON.stringify(_currentPlayer)}`);
    const _swapPlayers = () => {
        let hold = _otherPlayer;
        _otherPlayer = _currentPlayer;
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
                return _currentPlayer;
            }
            _currentPlayer.swapTurn();
            _otherPlayer.swapTurn();
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
        add,
    };
})(user,computer,gameBoard);

const stringToSourceObjFactory = (string, source) => {
    return {string, source};
}

const objectO = stringToSourceObjFactory('o', '../icons/circle.svg');
const objectX = stringToSourceObjFactory('x', '../icons/x.svg');

const scriptToDOM = ((objO, objX) => {
    const _insert = (parent, iconSourceString) => {
        const image = document.createElement('img');
        image.src = iconSourceString;
        parent.appendChild(image);
    };

    const updateGrid = (parent) => {
        const board = gameBoard.displayBoard();
        const length = board.length;
        let currentRow;
        let sourceString;
        for (let i = 0; i < length; i++) {
            currentRow = parent.children[i];
            for (let j = 0; j < length; j++) {
                if (!currentRow.children[j].hasChildNodes()){
                    if (board[i][j] == objO.string) {
                        sourceString = objO.source;
                        _insert(currentRow.children[j], sourceString);
                    }
                    else if (board[i][j] == objX.string) {
                        sourceString = objX.source;
                        _insert(currentRow.children[j], sourceString);
                    }
                }
            }
        }
    };
    return {
        updateGrid,
    };
})(objectO, objectX);

const tttbox = document.getElementById('tttbox');
const tttbuttonArray = document.querySelectorAll('.tttbutton');

// Add event listener to each
const sideLength = tttbuttonArray.length**0.5;
for (let i = 0; i < sideLength; i++) {
    for (let j = 0; j < sideLength; j++) {
        tttbuttonArray[sideLength*i+j].addEventListener("mouseup", (e) => {
            gameController.add(i,j);
            scriptToDOM.updateGrid(tttbox);
        } )
    }
}