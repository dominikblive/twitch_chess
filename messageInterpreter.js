var legalMovesForChat = []
var totalNumberOfLegalVotes = 0
var resignVotes = 0

function messageInterpreter(message) {
    var found = legalMovesForChat.find(element => element.move.fromX == message.fromX &&
        element.move.fromY == message.fromY &&
        element.move.toX == message.toX &&
        element.move.toY == message.toY)
    if (found != undefined) {
        found.amount += 1
        totalNumberOfLegalVotes += 1

    } else if (checkIfShouldBeLegal(message)) {
        legalMovesForChat.push({ move: message, amount: 1 })
        totalNumberOfLegalVotes += 1
    }
}

function checkIfShouldBeLegal(message) {
    var fromX = globalBoard.flipBoard ? (7 - message.fromX) : message.fromX
    var fromY = globalBoard.flipBoard ? (7 - message.fromY) : message.fromY
    var toX = globalBoard.flipBoard ? (7 - message.toX) : message.toX
    var toY = globalBoard.flipBoard ? (7 - message.toY) : message.toY
    var piece = globalBoard.spaceMatrix[fromY][fromX]
    if (piece != undefined) {
        if (piece.color == (globalBoard.flipBoard ? "W" : "B")) {
            return piece.coverageMap[toY][toX] != false
        }
    }
    return false
}

function makeChosenMove() {
    if (resignVotes > (totalNumberOfLegalVotes * 0.5)) {
        gameHasFinished(globalBoard.currentSide)
        return
    }
    var move = getChosenMove()
    var fromY = adjustToFlipBoard(move.fromY)
    var fromX = adjustToFlipBoard(move.fromX)
    var toX = adjustToFlipBoard(move.toX)
    var toY = adjustToFlipBoard(move.toY)
    var legal = globalBoard.spaceMatrix[fromY][fromX].coverageMap[toY][toX]
    if (legal.from != undefined) {
        makeLegalMove(legal.from, legal.to, false)
    }
    makeLegalMove({ x: fromX, y: fromY }, { x: toX, y: toY }, true)
}

function getChosenMove() {
    var move = legalMovesForChat.reduce(function(prev, current) {
        return (prev.amount > current.amount) ? prev : current
    })
    return move.move
}

function adjustToFlipBoard(int) {
    return globalBoard.flipBoard ? (7 - int) : int
}