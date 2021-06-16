function parseMessage(message) {
    if (message.startsWith("!chess(") && message.endsWith(')')) {
        var strippedMessage = message.substring(7).substring(0, message.length - 8)
        var arrayOfValues = strippedMessage.split(',')
        if (arrayOfValues.length == 2) {
            if (arrayOfValues[0].length == 2 && arrayOfValues[1].length == 2) {
                if (isValidValue(arrayOfValues[0]) && isValidValue(arrayOfValues[1])) {
                    var messageModel = new MessageModel(arrayOfValues[0], arrayOfValues[0][1], arrayOfValues[1], arrayOfValues[1][1])
                }
            }
        } else if (arrayOfValues.length == 1) {
            if (arrayOfValues[0] == "resign") {
                resignVotes += 1
                totalNumberOfLegalVotes += 1
            }
        }
    }
    return messageModel
}

function isValidValue(value) {
    return isIntigerInRange(value[1], 1, 8) && isLetterValid(value)
}

function isIntigerInRange(string, min, max) {
    if (!Number.isNaN(string)) {
        if (string >= min && string <= max) {
            return true
        }
    }
    return false
}

function isLetterValid(str) {
    let n = str.charCodeAt(0);
    return (n >= 65 && n < 73) || (n >= 97 && n < 105)
}