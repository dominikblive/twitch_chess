class MessageModel {
    constructor(fromX, fromY, toX, toY) {
        this.fromX = this.reverseXIfNeeded(this.changeLetterToInt(fromX)) - 1
        this.fromY = this.reverseYIfNeeded(fromY) - 1
        this.toX = this.reverseXIfNeeded(this.changeLetterToInt(toX)) - 1
        this.toY = this.reverseYIfNeeded(toY) - 1
    }

    changeLetterToInt(letter) {
        var temp = letter.toUpperCase()
        var code = temp.charCodeAt(0)
        return code - 64
    }

    reverseXIfNeeded(int) {
        return globalBoard.flipBoard ? 9 - int : int
    }
    reverseYIfNeeded(int) {
        return globalBoard.flipBoard ? int : 9 - int
    }
}