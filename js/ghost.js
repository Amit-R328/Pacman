'use strict'
const GHOST = '&#9781;';
var gGhosts;
var gIntervalGhosts;
var gDeadGhosts;

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor(),
    }
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST
}


function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []
    createGhost(board)
    createGhost(board)
    createGhost(board)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost)
    }

}

function moveGhost(ghost) {
    // figure out moveDiff, nextLocation, nextCell
    var moveDiff = getMoveDiff()

    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j];
    // console.log('nextCell', nextCell);

    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    // hitting a pacman?  call gameOver
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) {
            eatGhost(ghost.location, 'ghost', nextLocation)
            return;
        }
        gameOver();
        return
    }

    // moving from corrent position:
    // update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location
    // update the model
    ghost.location.i = nextLocation.i;
    ghost.location.j = nextLocation.j;
    ghost.currCellContent = nextCell;
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    if (gPacman.isSuper) {
        renderCell(ghost.location, pacmanSuper(ghost))
        return
    }
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 }
    } else if (randNum <= 50) {
        return { i: -1, j: 0 }
    } else if (randNum <= 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    return `<span style="color:${ghost.color}">${GHOST}</span>`
}

function pacmanSuper(ghost) {
    return `<span style="color:blue">${GHOST}</span>`
}

function eatGhost(ghostLocation, innitiator, nextGhostLocation = null) {
    gDeadGhosts = [];
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === ghostLocation.i && gGhosts[i].location.j === ghostLocation.j) {
            if(gGhosts[i].currCellContent === FOOD) {
                updateScore(1);
                gGhosts[i].currCellContent = EMPTY
            }
            gDeadGhosts.push(gGhosts.splice(i, 1)[0]);
        }
    }
    
    if (innitiator === 'pacman') {
        gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
        renderCell(gPacman.location, EMPTY)
        gPacman.location.i = ghostLocation.i;
        gPacman.location.j = ghostLocation.j;
        renderCell(ghostLocation, PACMAN);
        setTimeout(backToLife, 5000, gDeadGhosts)
    }else{
        
        gBoard[ghostLocation.i][ghostLocation.j] = EMPTY;
        renderCell(ghostLocation, EMPTY);
        gDeadGhosts[0].location.i = nextGhostLocation.i
        gDeadGhosts[0].location.j = nextGhostLocation.j
        setTimeout(backToLife, 5000, gDeadGhosts)
        
    }

}

function backToLife(deadGhosts) {
    var revived = deadGhosts.splice(0, 1)[0];
    gGhosts.push(revived);
    renderCell(revived.location, GHOST)
}