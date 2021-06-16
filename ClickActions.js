function onClick(mouseX, mouseY) {
    if (globalOptionsVisible) {
        return
    }
    checkIfLegalMove(mouseX, mouseY)
}

function checkIfLegalMove(mouseX, mouseY) {
    if (mouseX > xOffset && mouseX < globalBlockSize * 8 + xOffset && mouseY > yOffset && mouseY < globalBlockSize * 8 + yOffset) {
        var xBlock = undefined
        var yBlock = undefined
        if (globalBoard.flipBoard == false) {
            xBlock = Math.floor(normalize(mouseX, globalBlockSize * 8 + xOffset, xOffset) * 8)
            yBlock = Math.floor(normalize(mouseY, globalBlockSize * 8 + yOffset, yOffset) * 8)
        } else {
            xBlock = 7 - Math.floor(normalize(mouseX, globalBlockSize * 8 + xOffset, xOffset) * 8)
            yBlock = 7 - Math.floor(normalize(mouseY, globalBlockSize * 8 + yOffset, yOffset) * 8)
        }
        console.log("x" + xBlock + " y" + yBlock)
        userClickedBlock(xBlock, yBlock)
    } else {
        selectedBlockWithPiece = undefined
        resizeContentView(window.innerWidth, window.innerHeight)
    }
}