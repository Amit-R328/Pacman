'use strict'
var PACMAN = '😷';

var gPacman;
function createPacman(board) {
    gPacman = {
        location: {
            i: 6,
            j: 7
        },
        isSuper: false,
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    checkVictory()
    if (!gGame.isOn) return
    // use getNextLocation(), nextCell

    var nextLocation = getNextLocation(ev);
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j];
    // console.log('nextCell', nextCell)

    // return if cannot move
    if (nextCell === WALL || nextCell === SUPER && gPacman.isSuper) return

    // hitting a ghost?  call gameOver
    
    if (nextCell === GHOST) {
        
        if(gPacman.isSuper) {
            eatGhost(nextLocation, 'pacman');

            return;
        }
        gameOver();
        return
    }
    if (nextCell === FOOD) {
        updateScore(1);  
    }

    if(nextCell === SUPER){
        
        gPacman.isSuper = true;
        setTimeout(()=>{gPacman.isSuper = false;},5000)
    }

    if(nextCell === CHERRY){
        updateScore(10);
    }


    // moving from corrent position:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY);

    // Move the pacman to new location
    // update the model
    gPacman.location.i = nextLocation.i;
    gPacman.location.j = nextLocation.j;
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, PACMAN)
}

function getNextLocation(eventKeyboard) {
    // console.log('eventKeyboard.code', eventKeyboard.code)
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            PACMAN = '<img src="img/up-Pac_Man.svg.png" width="30">'
            break;
        case 'ArrowDown':
            nextLocation.i++
            PACMAN = '<img src="img/down-Pac_Man.svg.png" width="30">'
            break;
        case 'ArrowLeft':
            nextLocation.j--
            PACMAN = '<img src="img/left-Pac_Man.svg.png" width="30">'
            break;
        case 'ArrowRight':
            nextLocation.j++
            PACMAN = '<img src="img/1200px-Pac_Man.svg.png" width="30">'
            break;
        default: return null
    }
    return nextLocation;
}


