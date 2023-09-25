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
        console.log(`player ${mark} turn is now ${isTurn}`);
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
            console.log('its not their turn');
            return false;
        }
        if (board.add(_currentPlayer.mark, row, col)) {
            if (_isWin()) {
                console.log('win condition');
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


