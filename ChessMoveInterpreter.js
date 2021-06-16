var selectedBlockWithPiece = undefined
var allowForChatInput = false

function userClickedBlock(xBlock, yBlock) {
    var piece = globalBoard.spaceMatrix[yBlock][xBlock]
    var wasSelected = undefined
    if (selectedBlockWithPiece != undefined) {
        wasSelected = { x: selectedBlockWithPiece.x, y: selectedBlockWithPiece.y }
    }
    selectedBlockWithPiece = undefined
    resizeContentView(window.innerWidth, window.innerHeight)
    if (wasSelected == undefined && piece != undefined && piece.color == playerSide && globalBoard.currentSide == playerSide) {
        selectedBlockWithPiece = { x: xBlock, y: yBlock }
        drawSelectedPiece(xBlock, yBlock, globalBoard.spaceMatrix[yBlock][xBlock])
        drawAllowedMoves(piece.coverageMap)
    } else if (wasSelected != undefined) {
        var legal = isLegalMove(wasSelected, xBlock, yBlock)
        if (legal != false) {
            if (legal.from != undefined) {
                makeLegalMove(legal.from, legal.to, false)
            }
            makeLegalMove(wasSelected, { x: xBlock, y: yBlock }, true)
        }
    }
}

function isLegalMove(lastPositionClicked, currentX, currentY) {
    if (globalBoard.spaceMatrix[lastPositionClicked.y][lastPositionClicked.x] != undefined) {
        if (globalBoard.spaceMatrix[lastPositionClicked.y][lastPositionClicked.x].coverageMap[currentY][currentX] != false) {
            return globalBoard.spaceMatrix[lastPositionClicked.y][lastPositionClicked.x].coverageMap[currentY][currentX]
        }
    }
    return false
}

function findLegalMoves(xBlock, yBlock, board, insideLoop) {
    var coverageMap = [
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false]
    ]
    var piece = board.spaceMatrix[yBlock][xBlock]
    switch (piece.type) {
        case ChessPieceType.Pawn:
            coverageMap = findLegalMovesForPawn(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            break;
        case ChessPieceType.Rook:
            coverageMap = findLegalMovesForRook(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            break;
        case ChessPieceType.Bishop:
            coverageMap = findLegalMovesForBishop(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            break;
        case ChessPieceType.Knight:
            coverageMap = findLegalMovesForKnight(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            break;
        case ChessPieceType.Queen:
            coverageMap = findLegalMovesForRook(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            coverageMap = findLegalMovesForBishop(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            break;
        case ChessPieceType.King:
            coverageMap = findLegalMovesForKing(xBlock, yBlock, piece, coverageMap, board, insideLoop)
            break;
        default:
    }
    return coverageMap
}

function findLegalMovesForPawn(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    var white = piece.color == ChessPieceColor.White
    var moveOffset = white ? yBlock - 1 : yBlock + 1
    if (moveOffset < 0 || moveOffset > 7) {
        return coverageMap
    }
    if (white && yBlock == 6 && board.spaceMatrix[moveOffset][xBlock] == undefined && board.spaceMatrix[yBlock - 2][xBlock] == undefined) {
        coverageMap[yBlock - 2][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: yBlock - 2 }, piece, true, insideLoop)
    } else if (!white && yBlock == 1 && board.spaceMatrix[moveOffset][xBlock] == undefined && board.spaceMatrix[yBlock + 2][xBlock] == undefined) {
        coverageMap[yBlock + 2][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: yBlock + 2 }, piece, true, insideLoop)
    }
    if (board.spaceMatrix[moveOffset][xBlock - 1] != undefined) {
        if (board.spaceMatrix[moveOffset][xBlock - 1].color != piece.color) {
            coverageMap[moveOffset][xBlock - 1] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock - 1, y: moveOffset }, piece, true, insideLoop)
        }
    }
    if (board.spaceMatrix[moveOffset][xBlock + 1] != undefined) {
        if (board.spaceMatrix[moveOffset][xBlock + 1].color != piece.color) {
            coverageMap[moveOffset][xBlock + 1] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock + 1, y: moveOffset }, piece, true, insideLoop)
        }
    }
    if (board.spaceMatrix[moveOffset][xBlock] == undefined) {
        coverageMap[moveOffset][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: moveOffset }, piece, true, insideLoop)
    }
    coverageMap = checkEnPassant(xBlock, yBlock, piece, coverageMap, board, insideLoop)
    return coverageMap
}

function checkEnPassant(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    var targetYValue = (piece.color == ChessPieceColor.White ? 3 : 4)
    if (targetYValue == yBlock) {
        if (board.spaceMatrix[yBlock][xBlock - 1] != undefined) {
            if (board.spaceMatrix[yBlock][xBlock - 1].color != piece.color && board.spaceMatrix[yBlock][xBlock - 1].type == ChessPieceType.Pawn && JSON.stringify({ x: xBlock - 1, y: yBlock }) === JSON.stringify(board.lastMove.to) && JSON.stringify({ x: xBlock - 1, y: 1 }) === JSON.stringify(board.lastMove.from)) {
                coverageMap[yBlock - 1][xBlock - 1] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock - 1, y: yBlock - 1 }, piece, { from: { x: xBlock - 1, y: yBlock }, to: { x: xBlock - 1, y: yBlock - 1 } }, insideLoop)
            }
        }
        if (board.spaceMatrix[yBlock][xBlock + 1] != undefined) {
            if (board.spaceMatrix[yBlock][xBlock + 1].color != piece.color && board.spaceMatrix[yBlock][xBlock + 1].type == ChessPieceType.Pawn && JSON.stringify({ x: xBlock + 1, y: yBlock }) === JSON.stringify(board.lastMove.to) && JSON.stringify({ x: xBlock + 1, y: 1 }) === JSON.stringify(board.lastMove.from)) {
                coverageMap[yBlock - 1][xBlock + 1] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock + 1, y: yBlock - 1 }, piece, { from: { x: xBlock + 1, y: yBlock }, to: { x: xBlock + 1, y: yBlock - 1 } }, insideLoop)
            }
        }
    }
    return coverageMap
}

function findLegalMovesForRook(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    for (var i = xBlock + 1; i < 8; i++) {
        if (board.spaceMatrix[yBlock][i] != undefined) {
            if (board.spaceMatrix[yBlock][i].color != piece.color) {
                coverageMap[yBlock][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: yBlock }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[yBlock][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: yBlock }, piece, true, insideLoop)
    }
    for (var i = xBlock - 1; i > -1; i--) {
        if (board.spaceMatrix[yBlock][i] != undefined) {
            if (board.spaceMatrix[yBlock][i].color != piece.color) {
                coverageMap[yBlock][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: yBlock }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[yBlock][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: yBlock }, piece, true, insideLoop)
    }
    for (var i = yBlock + 1; i < 8; i++) {
        if (board.spaceMatrix[i][xBlock] != undefined) {
            if (board.spaceMatrix[i][xBlock].color != piece.color) {
                coverageMap[i][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: i }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[i][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: i }, piece, true, insideLoop)
    }
    for (var i = yBlock - 1; i > -1; i--) {
        if (board.spaceMatrix[i][xBlock] != undefined) {
            if (board.spaceMatrix[i][xBlock].color != piece.color) {
                coverageMap[i][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: i }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[i][xBlock] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock, y: i }, piece, true, insideLoop)
    }
    return coverageMap
}

function findLegalMovesForBishop(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    for (var i = xBlock + 1, j = yBlock + 1; i < 8 && j < 8; i++, j++) {
        if (board.spaceMatrix[j][i] != undefined) {
            if (board.spaceMatrix[j][i].color != piece.color) {
                coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
    }
    for (var i = xBlock - 1, j = yBlock - 1; i > -1 && j > -1; i--, j--) {
        if (board.spaceMatrix[j][i] != undefined) {
            if (board.spaceMatrix[j][i].color != piece.color) {
                coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
    }
    for (var i = xBlock + 1, j = yBlock - 1; i < 8 && j > -1; i++, j--) {
        if (board.spaceMatrix[j][i] != undefined) {
            if (board.spaceMatrix[j][i].color != piece.color) {
                coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
    }
    for (var i = xBlock - 1, j = yBlock + 1; i > -1 && j < 8; i--, j++) {
        if (board.spaceMatrix[j][i] != undefined) {
            if (board.spaceMatrix[j][i].color != piece.color) {
                coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
            }
            break;
        }
        coverageMap[j][i] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: i, y: j }, piece, true, insideLoop)
    }
    return coverageMap
}

function findLegalMovesForKnight(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    var availableMoves = [{ x: 2, y: 1 }, { x: 2, y: -1 }, { x: -2, y: 1 }, { x: -2, y: -1 }, { x: 1, y: 2 }, { x: 1, y: -2 }, { x: -1, y: 2 }, { x: -1, y: -2 }]
    availableMoves.forEach((element) => {
        if (-1 < yBlock + element.y && yBlock + element.y < 8 && -1 < xBlock + element.x && xBlock + element.x < 8) {
            if (board.spaceMatrix[yBlock + element.y][xBlock + element.x] != undefined) {
                if (board.spaceMatrix[yBlock + element.y][xBlock + element.x].color != piece.color) {
                    coverageMap[yBlock + element.y][xBlock + element.x] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock + element.x, y: yBlock + element.y }, piece, true, insideLoop)
                }
                return
            }
            coverageMap[yBlock + element.y][xBlock + element.x] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock + element.x, y: yBlock + element.y }, piece, true, insideLoop)
        }
    })
    return coverageMap
}

function findLegalMovesForKing(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    var availableMoves = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }]
    availableMoves.forEach((element) => {
        if (-1 < yBlock + element.y && yBlock + element.y < 8 && -1 < xBlock + element.x && xBlock + element.x < 8) {
            if (board.spaceMatrix[yBlock + element.y][xBlock + element.x] != undefined) {
                if (board.spaceMatrix[yBlock + element.y][xBlock + element.x].color != piece.color) {
                    coverageMap[yBlock + element.y][xBlock + element.x] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock + element.x, y: yBlock + element.y }, piece, true, insideLoop)
                }
                return
            }
            coverageMap[yBlock + element.y][xBlock + element.x] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: xBlock + element.x, y: yBlock + element.y }, piece, true, insideLoop)
        }
    })
    if (!piece.didMove) {
        coverageMap = checkIfCastlingIsAvailable(xBlock, yBlock, piece, coverageMap, board, insideLoop)
    }
    return coverageMap
}

function checkIfCastlingIsAvailable(xBlock, yBlock, piece, coverageMap, board, insideLoop) {
    if (piece.color == ChessPieceColor.White && board.spaceMatrix[7][0] != undefined && board.spaceMatrix[7][1] == undefined && board.spaceMatrix[7][2] == undefined && board.spaceMatrix[7][3] == undefined) {
        if (board.spaceMatrix[7][0].didMove == false && !checkIfBlockIsUnderAttack(4, 7, piece.color, board) && !checkIfBlockIsUnderAttack(3, 7, piece.color, board) && !checkIfBlockIsUnderAttack(2, 7, piece.color, board)) {
            coverageMap[7][2] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: 2, y: 7 }, piece, { from: { x: 0, y: 7 }, to: { x: 3, y: 7 } }, insideLoop)
        }
    }
    if (piece.color == ChessPieceColor.White && board.spaceMatrix[7][7] != undefined && board.spaceMatrix[7][6] == undefined && board.spaceMatrix[7][5] == undefined) {
        if (board.spaceMatrix[7][7].didMove == false && !checkIfBlockIsUnderAttack(6, 7, piece.color, board) && !checkIfBlockIsUnderAttack(5, 7, piece.color, board) && !checkIfBlockIsUnderAttack(4, 7, piece.color, board)) {
            coverageMap[7][6] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: 6, y: 7 }, piece, { from: { x: 7, y: 7 }, to: { x: 5, y: 7 } }, insideLoop)
        }
    }
    if (piece.color == ChessPieceColor.Black && board.spaceMatrix[0][0] != undefined && board.spaceMatrix[0][1] == undefined && board.spaceMatrix[0][2] == undefined && board.spaceMatrix[0][3] == undefined) {
        if (board.spaceMatrix[0][0].didMove == false && !checkIfBlockIsUnderAttack(4, 0, piece.color, board) && !checkIfBlockIsUnderAttack(3, 0, piece.color, board) && !checkIfBlockIsUnderAttack(2, 0, piece.color, board)) {
            coverageMap[0][2] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: 2, y: 0 }, piece, { from: { x: 0, y: 0 }, to: { x: 3, y: 0 } }, insideLoop)
        }
    }
    if (piece.color == ChessPieceColor.Black && board.spaceMatrix[0][7] != undefined && board.spaceMatrix[0][6] == undefined && board.spaceMatrix[0][5] == undefined) {
        if (board.spaceMatrix[0][7].didMove == false && !checkIfBlockIsUnderAttack(6, 0, piece.color, board) && !checkIfBlockIsUnderAttack(5, 0, piece.color, board) && !checkIfBlockIsUnderAttack(4, 0, piece.color, board)) {
            coverageMap[0][6] = checkIfMoveIsLegal({ x: xBlock, y: yBlock }, { x: 6, y: 0 }, piece, { from: { x: 7, y: 0 }, to: { x: 5, y: 0 } }, insideLoop)
        }
    }
    return coverageMap
}

function checkIfBlockIsUnderAttack(x, y, color, board) {
    var isBlockUnderAttack = false
    board.spaceMatrix.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
            if (item != undefined) {
                if (item.color != color && item.coverageMap[y][x] != false) {
                    isBlockUnderAttack = true
                }
            }
        })
    })
    return isBlockUnderAttack
}

function updateCoverageMaps(from, to, board, insideLoop) {
    updateCoverageForBlock(from.x, from.y, board, insideLoop)
    updateCoverageForBlock(to.x, to.y, board, insideLoop)
}

function updateCoverageForBlock(x, y, board, insideLoop) {
    board.spaceMatrix.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
            if (item != undefined) {
                item.coverageMap = findLegalMoves(itemIndex, rowIndex, board, insideLoop)
            }
        })
    })
}

function makeLegalMove(from, to, reset) {
    var piece = globalBoard.spaceMatrix[from.y][from.x]
    globalBoard.spaceMatrix[from.y][from.x] = undefined
    globalBoard.spaceMatrix[to.y][to.x] = piece
    globalBoard.spaceMatrix[to.y][to.x].didMove = true
    globalBoard.currentSide = piece.color == ChessPieceColor.White ? ChessPieceColor.Black : ChessPieceColor.White
    globalBoard.lastMove = { from: from, to: to }
    if (JSON.stringify(from) === JSON.stringify(globalBoard.whiteKingPosition)) {
        globalBoard.whiteKingPosition = to
    } else if (JSON.stringify(from) === JSON.stringify(globalBoard.blackKingPosition)) {
        globalBoard.blackKingPosition = to
    }
    if (piece.type == ChessPieceType.Pawn && (to.y == 7 || to.y == 0)) {
        piece.type = ChessPieceType.Queen
    }
    updateCoverageMaps(from, to, globalBoard, false)
    if (reset == true) {
        if ((globalBoard.currentSide != playerSide)) {
            allowForChatInput = true
            remainingChatTime = initialChatTime
        } else {
            allowForChatInput = false
            remainingPlayerTime += setupIncrementValue
        }
        legalMovesForChat = []
        totalNumberOfLegalVotes = 0
        resignVotes = 0
        var result = checkIfGameEndedFor(globalBoard.currentSide)
        if (result.didGameEnd) {
            if (result.isKingInCheck == true) {
                gameHasFinished(globalBoard.currentSide)
            } else {
                gameHasFinished(undefined)
            }
            return
        }
        calculateAdvantage()
        resizeContentView(window.innerWidth, window.innerHeight)
    }

}

function calculateAdvantage() {
    globalBoard.boardAdvantage = 0
    globalBoard.spaceMatrix.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
            if (item != undefined) {
                globalBoard.boardAdvantage += (item.color == ChessPieceColor.White ? item.getValue() : -item.getValue())
            }
        })
    })
}

function checkIfGameEndedFor(currentSideColor) {
    var didGameEnd = true
    var kingPosition = currentSideColor == ChessPieceColor.White ? globalBoard.whiteKingPosition : globalBoard.blackKingPosition
    var isKingInCheck = checkIfBlockIsUnderAttack(kingPosition.x, kingPosition.y, currentSideColor, globalBoard)
    globalBoard.spaceMatrix.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
            if (item != undefined) {
                if (item.color == currentSideColor) {
                    item.coverageMap.forEach((row, rowIndex) => {
                        row.forEach((coverageItem, itemIndex) => {
                            if (coverageItem == true) {
                                didGameEnd = false
                                return
                            }
                        })
                        if (didGameEnd == false) {
                            return
                        }
                    })
                }
            }
            if (didGameEnd == false) {
                return
            }
        })
        if (didGameEnd == false) {
            return
        }
    })

    return { didGameEnd: didGameEnd, isKingInCheck: isKingInCheck }
}

function checkIfMoveIsLegal(from, to, piece, positiveValue, insideLoop) {
    if (insideLoop) {
        return positiveValue
    }
    var boardCopy = JSON.parse(JSON.stringify(globalBoard));
    if (positiveValue != false, positiveValue != true) {
        var tempPiece = boardCopy.spaceMatrix[positiveValue.from.y][positiveValue.from.x]
        boardCopy.spaceMatrix[positiveValue.from.y][positiveValue.from.x] = undefined
        boardCopy.spaceMatrix[positiveValue.to.y][positiveValue.to.x] = tempPiece
        boardCopy.spaceMatrix[positiveValue.to.y][positiveValue.to.x].didMove = true
        updateCoverageMaps(positiveValue.from, positiveValue.to, boardCopy, true)
    }
    var tempPiece = boardCopy.spaceMatrix[from.y][from.x]
    boardCopy.spaceMatrix[from.y][from.x] = undefined
    boardCopy.spaceMatrix[to.y][to.x] = tempPiece
    boardCopy.spaceMatrix[to.y][to.x].didMove = true
    boardCopy.lastMove = { from: from, to: to }
    if (JSON.stringify(from) === JSON.stringify(boardCopy.whiteKingPosition)) {
        boardCopy.whiteKingPosition = to
    } else if (JSON.stringify(from) === JSON.stringify(boardCopy.blackKingPosition)) {
        boardCopy.blackKingPosition = to
    }
    updateCoverageMaps(from, to, boardCopy, true)
    var white = piece.color == ChessPieceColor.White
    if (!checkIfBlockIsUnderAttack(white ? boardCopy.whiteKingPosition.x : boardCopy.blackKingPosition.x, white ? boardCopy.whiteKingPosition.y : boardCopy.blackKingPosition.y, piece.color, boardCopy)) {
        return positiveValue
    }
    return false
}