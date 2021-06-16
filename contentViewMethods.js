var globalBlockSize = 0
var xOffset = 0
var yOffset = 0
var globalEdgeInsets = { top: 30, bottom: 30, left: 30, right: 30 }

function resizeContentView(width, height) {
    setupContentView(globalBoard, width, height)
}

function setupContentView(board, width, height) {
    contentViewContext.canvas.width = width
    contentViewContext.canvas.height = height
    contentViewContext.clearRect(0, 0, width, height)
    globalBlockSize = getBlockSize(width, height)
    setupMatrix(globalBlockSize, board.spaceMatrix.length, board.spaceMatrix[0].length, width, height, board.flipBoard)
    setupInfo(globalBlockSize, board.spaceMatrix.length, board.spaceMatrix[0].length, width, height, board.flipBoard)
    reloadUserInteractionUI()
}

function getBlockSize(width, height) {
    var widthBlockSize = (width - globalEdgeInsets.left - globalEdgeInsets.right) / 8
    var heightBlockSize = (height - globalEdgeInsets.top - globalEdgeInsets.bottom) / 10
    return widthBlockSize > heightBlockSize ? heightBlockSize : widthBlockSize
}

function setupMatrix(size, x, y, width, height, flipBoard) {
    var colorHelper = false
    xOffset = (width - size * x) / 2
    yOffset = (height - size * y) / 2
    for (let i = 0; i < x; i++) {
        colorHelper ^= true
        let indexI = flipBoard ? (x - i - 1) : i
        for (let j = 0; j < y; j++) {
            colorHelper ^= true
            let indexJ = flipBoard ? (y - j - 1) : j
            setupSpace(size * i + xOffset, size * j + yOffset, size, globalBoard.spaceMatrix[indexJ][indexI], colorHelper)
        }
    }
}

function setupSpace(Xpixles, Ypixels, size, piece, spaceColor) {
    contentViewContext.fillStyle = spaceColor ? 'rgb(100,100,100)' : 'rgb(150,150,150)'
    contentViewContext.fillRect(Xpixles, Ypixels, size, size)
    if (piece != undefined) {
        contentViewContext.drawImage(piece.getImage(), Xpixles, Ypixels, size, size);
    }
}

function setupInfo(size, x, y, width, height, flipBoard) {
    var fontSize = 30
    contentViewContext.font = fontSize + "px Arial";
    contentViewContext.fillStyle = 'black'

    xOffset = (width - size * x) / 2
    yOffset = (height - size * y) / 2
    for (let i = 0; i < x; i++) {
        let index = flipBoard ? (x - i - 1) : i
        setupBoardIndicator(xOffset - globalEdgeInsets.left, size * i + yOffset, fontSize, size, globalBoard.boardPositionIndicators[0][index], fontSize)
        setupBoardIndicator(size * i + xOffset, size * globalBoard.spaceMatrix[0].length + yOffset, size, globalEdgeInsets.left, globalBoard.boardPositionIndicators[1][index], fontSize)
        setupBoardIndicator(xOffset + size * globalBoard.spaceMatrix[0].length, size * i + yOffset, fontSize, size, globalBoard.boardPositionIndicators[0][index], fontSize)
        setupBoardIndicator(size * i + xOffset, yOffset - globalEdgeInsets.left, size, globalEdgeInsets.left, globalBoard.boardPositionIndicators[1][index], fontSize)
    }
    setupScoreInfo(size, width, height, flipBoard)
    setupPlayerStats(size, width, height, flipBoard)
}

function setupBoardIndicator(Xpixles, Ypixels, width, height, indicator, fontSize) {
    contentViewContext.strokeStyle = configurationBoardBorderColor
    contentViewContext.strokeRect(Xpixles, Ypixels, width, height)
    contentViewContext.fillText(indicator, (Xpixles + width / 2) - fontSize / 4, (Ypixels + height / 2) + fontSize / 3);
}

function setupPlayerStats(size, width, height, flipBoard) {
    var fontSize = 40
    contentViewContext.font = fontSize + "px Arial"
    contentViewContext.fillStyle = 'black'
    contentViewContext.fillText(" CHAT" + globalBoard.getAdvantageForTopPlayer(), width / 2 - 3 * size, height / 2 - 5 * size + 10)
    contentViewContext.fillText(" STREAMER" + globalBoard.getAdvantageForBottomPlayer(), width / 2 - 3 * size, height / 2 + 4 * size + 70)
    var fontSize = 30
    contentViewContext.font = fontSize + "px Arial"
    contentViewContext.fillStyle = 'black'
    contentViewContext.fillText(Math.floor(remainingChatTime / 60) + ":" + zeroPad(remainingChatTime % 60, 2), width / 2 + 3 * size, height / 2 - 5 * size)
    contentViewContext.fillText(Math.floor(remainingPlayerTime / 60) + ":" + zeroPad(remainingPlayerTime % 60, 2), width / 2 + 3 * size, height / 2 + 4 * size + 60)

}

function setupScoreInfo(size, width, height, flipBoard) {
    var fontSize = 40
    contentViewContext.font = "bold " + fontSize + "px Arial"
    contentViewContext.fillStyle = 'black'
    contentViewContext.strokeStyle = configurationBoardBorderColor
    contentViewContext.strokeRect(width / 2 - 4 * size, height / 2 - 5 * size - 30, size, size)
    contentViewContext.fillText(chatScore.toFixed(1), width / 2 - 3.333 * size - fontSize + 5, height / 2 - 4.666 * size);
    contentViewContext.strokeRect(width / 2 - 4 * size, height / 2 + 4 * size + 30, size, size)
    contentViewContext.fillText(playerScore.toFixed(1), width / 2 - 3.333 * size - fontSize + 5, height / 2 + 4.5 * size + fontSize);

}