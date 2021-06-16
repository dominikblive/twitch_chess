const ChessPieceType = {
    Pawn: "pawn",
    Rook: "rook",
    Bishop: "bishop",
    Knight: "knight",
    Queen: "queen",
    King: "king"
}
Object.freeze(ChessPieceType)

const ChessPieceColor = {
    White: "W",
    Black: "B"
}
Object.freeze(ChessPieceColor)

class ChessPieceModel {
    constructor(type, color) {
        this.type = type
        this.color = color
        this.didMove = false
        this.coverageMap = [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false]
        ]
    }

    getImage() {
        switch (this.type + this.color) {
            case "pawnW":
                return resources.pawnWImage
            case "pawnB":
                return resources.pawnBImage
            case "rookW":
                return resources.rookWImage
            case "rookB":
                return resources.rookBImage
            case "bishopW":
                return resources.bishopWImage
            case "bishopB":
                return resources.bishopBImage
            case "knightW":
                return resources.knightWImage
            case "knightB":
                return resources.knightBImage
            case "queenW":
                return resources.queenWImage
            case "queenB":
                return resources.queenBImage
            case "kingW":
                return resources.kingWImage
            case "kingB":
                return resources.kingBImage
        }
    }

    getValue() {
        switch (this.type) {
            case "pawn":
                return 1
            case "rook":
                return 5
            case "bishop":
                return 3
            case "knight":
                return 3
            case "queen":
                return 9
            case "king":
                return 0
        }
    }
}