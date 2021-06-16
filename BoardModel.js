class BoardModel {
    constructor() {
        this.spaceMatrix = []
        this.setupMatrix()
        this.flipBoard = false
        this.boardPositionIndicators = [
            ['8', '7', '6', '5', '4', '3', '2', '1'],
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        ]
        this.currentSide = ChessPieceColor.White
        this.lastMove = undefined
        this.blackKingPosition = { x: 4, y: 0 }
        this.whiteKingPosition = { x: 4, y: 7 }
        this.boardAdvantage = 0
    }
    setupMatrix() {
        this.spaceMatrix = [
            [new ChessPieceModel(ChessPieceType.Rook, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Knight, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Bishop, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Queen, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.King, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Bishop, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Knight, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Rook, ChessPieceColor.Black)],
            [new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.Black)],
            [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
            [new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Pawn, ChessPieceColor.White)],
            [new ChessPieceModel(ChessPieceType.Rook, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Knight, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Bishop, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Queen, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.King, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Bishop, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Knight, ChessPieceColor.White), new ChessPieceModel(ChessPieceType.Rook, ChessPieceColor.White)]
        ]
    }

    getAdvantageForTopPlayer() {
        if (this.boardAdvantage < 0 && this.flipBoard == false) {
            return " +" + (-this.boardAdvantage)
        } else if ((this.boardAdvantage > 0 && this.flipBoard == true)) {
            return " +" + (this.boardAdvantage)
        }
        return ""
    }
    getAdvantageForBottomPlayer() {
        if (this.boardAdvantage > 0 && this.flipBoard == false) {
            return " +" + (this.boardAdvantage)
        } else if ((this.boardAdvantage < 0 && this.flipBoard == true)) {
            return " +" + (-this.boardAdvantage)
        }
        return ""
    }
}


class BoardEdgeInsets {
    constructor(top, right, bottom, left) {
        this.top = top
        this.right = right
        this.bottom = bottom
        this.left = left
    }
}