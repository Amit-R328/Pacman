'use strict'
const WALL = '#';
const FOOD = '.';
const EMPTY = ' ';
const SUPER = '*';
const CHERRY ='🍒';

var gFoodCount = 57; 
var gCherryIntervalId;
var gBoard;
var gGame = {
    score: 0,
    isOn: false
}

function init() {
    var elModal = document.querySelector('.modal');
    gGame.score = 0;
    document.querySelector('h2 span').innerText = gGame.score;
    gDeadGhosts = [];
    elModal.style.display = 'none'
    console.log('hello')
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame.isOn = true;
    gCherryIntervalId = setInterval(randomCherry,15000);

}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = SUPER
    board[1][board.length-2] = SUPER
    board[board.length-2][1] = SUPER
    board[board.length-2][board.length-2] = SUPER
    return board;
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;

}

function gameOver() {
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    renderCell(gPacman.location, EMPTY);
    onLoss()

}

function onVictory() {
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h2').innerText = 'Great! You won!'
    elModal.style.display = 'block'
    clearInterval(gCherryIntervalId)
}

function onLoss() {
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h2').innerText = 'Maybe next time...'
    elModal.style.display = 'block'
    clearInterval(gCherryIntervalId)
}


function checkVictory() {
    console.log('checking')
    
    for(var i = 0; i< gGhosts.length; i++){
        if(gGhosts[i].currCellContent === FOOD) return
    }
    var map = getBoardMap();
    if(map.foodCount) return
    console.log('victory')
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    renderCell(gPacman.location, EMPTY);
    onVictory()
}

function randomCherry(){
    
    var location = randomEmpty();
    gBoard[location.i][location.j] = CHERRY
    renderCell(location, CHERRY)
}

function randomEmpty(){
    var map = getBoardMap()
    var randomIdx = getRandomIntInclusive(0,map.emptyCells.length -1);
    return map.emptyCells[randomIdx];
}

function getBoardMap(){
    var map = {foodCount: 0,emptyCells: [] }
    for (var i = 1; i < gBoard.length -1; i++) {
        for (var j = 1; j < gBoard[0].length -1; j++) {
            
            if (gBoard[i][j] === FOOD) {
                map.foodCount++
            }else if(gBoard[i][j] === EMPTY){
                map.emptyCells.push({i:i, j:j})
            }
        }
    }
    return map;
}


