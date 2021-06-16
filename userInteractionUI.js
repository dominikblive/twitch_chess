function reloadUserInteractionUI() {
    if (globalBoard.lastMove != undefined) {
        var piece = globalBoard.spaceMatrix[globalBoard.lastMove.to.y][globalBoard.lastMove.to.x]
        contentViewContext.fillStyle = configurationLastMove
        var fromX = globalBoard.flipBoard ? (7 - globalBoard.lastMove.from.x) : globalBoard.lastMove.from.x
        var fromY = globalBoard.flipBoard ? (7 - globalBoard.lastMove.from.y) : globalBoard.lastMove.from.y
        var toX = globalBoard.flipBoard ? (7 - globalBoard.lastMove.to.x) : globalBoard.lastMove.to.x
        var toY = globalBoard.flipBoard ? (7 - globalBoard.lastMove.to.y) : globalBoard.lastMove.to.y
        contentViewContext.fillRect(xOffset + fromX * globalBlockSize, yOffset + fromY * globalBlockSize, globalBlockSize, globalBlockSize)
        contentViewContext.fillRect(xOffset + toX * globalBlockSize, yOffset + toY * globalBlockSize, globalBlockSize, globalBlockSize)
        contentViewContext.drawImage(piece.getImage(), xOffset + toX * globalBlockSize, yOffset + toY * globalBlockSize, globalBlockSize, globalBlockSize);
    }
    if (selectedBlockWithPiece != undefined) {
        var piece = globalBoard.spaceMatrix[selectedBlockWithPiece.y][selectedBlockWithPiece.x]
        drawSelectedPiece(selectedBlockWithPiece.x, selectedBlockWithPiece.y, piece)
        drawAllowedMoves(piece.coverageMap)
    }
    if (legalMovesForChat.length > 0 && totalNumberOfLegalVotes > 0) {
        drawChatMoves()
    }
    drawResignPercentage()
}

function drawSelectedPiece(xBlock, yBlock, piece) {
    xBlock = globalBoard.flipBoard ? (7 - xBlock) : xBlock
    yBlock = globalBoard.flipBoard ? (7 - yBlock) : yBlock
    contentViewContext.fillStyle = configurationSelectedPieceColor
    contentViewContext.fillRect(xOffset + xBlock * globalBlockSize, yOffset + yBlock * globalBlockSize, globalBlockSize, globalBlockSize)
    contentViewContext.drawImage(piece.getImage(), xOffset + xBlock * globalBlockSize, yOffset + yBlock * globalBlockSize, globalBlockSize, globalBlockSize);
}

function drawAllowedMoves(array) {
    contentViewContext.fillStyle = configurationAvailableMove
    array.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
            if (item != false) {
                var xBlock = globalBoard.flipBoard ? (7 - itemIndex) : itemIndex
                var yBlock = globalBoard.flipBoard ? (7 - rowIndex) : rowIndex
                contentViewContext.fillRect(xOffset + xBlock * globalBlockSize, yOffset + yBlock * globalBlockSize, globalBlockSize, globalBlockSize)
            }
        })
    })
}

function drawChatMoves() {
    if (disableChatPredictions) {
        return
    }
    legalMovesForChat.forEach((move) => {
        var fromX = globalBoard.flipBoard ? (7 - move.move.fromX) : move.move.fromX
        var fromY = globalBoard.flipBoard ? (7 - move.move.fromY) : move.move.fromY
        var piece = globalBoard.spaceMatrix[fromY][fromX]
        contentViewContext.fillStyle = configurationChatMove

        contentViewContext.fillRect(xOffset + move.move.toX * globalBlockSize, yOffset + move.move.toY * globalBlockSize, globalBlockSize, globalBlockSize)
        contentViewContext.globalAlpha = 0.5;
        contentViewContext.drawImage(piece.getImage(), xOffset + move.move.toX * globalBlockSize, yOffset + move.move.toY * globalBlockSize, globalBlockSize, globalBlockSize);
        contentViewContext.globalAlpha = 1.0;
        var fontSize = 30
        contentViewContext.font = "bold " + fontSize + "px Arial"
        contentViewContext.fillStyle = 'black'
        contentViewContext.fillText(Math.floor(((move.amount / totalNumberOfLegalVotes) * 100)) + "%", (xOffset + move.move.toX * globalBlockSize + globalBlockSize / 2) - fontSize / 1, (yOffset + move.move.toY * globalBlockSize + globalBlockSize / 2) + fontSize / 3);
    })
}

function drawResignPercentage() {
    var fontSize = 20
    contentViewContext.font = "bold " + fontSize + "px Arial"
    contentViewContext.fillStyle = 'black'
    var value = (Number.isNaN(resignVotes / totalNumberOfLegalVotes)) ? 0 : (resignVotes / totalNumberOfLegalVotes)
    contentViewContext.fillText("!chess(resign) " + Math.floor((value * 100)) + "%", (xOffset + 4 * globalBlockSize + globalBlockSize / 2) - fontSize / 1, (yOffset + -0.75 * globalBlockSize) + fontSize / 3);
}