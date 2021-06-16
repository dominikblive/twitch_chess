var uiElements = []
var setupPlayerSide = ChessPieceColor.White
var setupTimeValue = 10
var setupIncrementValue = 0
var remainingPlayerTime = 600
var initialChatTime = 30
var remainingChatTime = 30
var disableChatPredictions = false


function setupOptions() {
    setupSaveButton()
    var nameInput = document.getElementById("nameInput")
    nameInput.value = localStorage.getItem('name') ? localStorage.getItem('name') : "name"
    setupWhiteSideButton()
    setupBlackSideButton()
    setup1minButton()
    setup3minButton()
    setup5minButton()
    setup10minButton()
    setup0secButton()
    setup2secButton()
    setup5secButton()
    setup30secButton()
    setup45secButton()
    setup60secButton()
    setupHidePredictionsButton()
    setupShowPredictionsButton()
    setupStartButton()
    setupNextGameButton()
    setupResignButton()
}

function showOptions() {
    globalOptionsVisible = true
    var overlay = document.getElementsByClassName("overlay")[0]
    overlay.style.display = 'block';
    var options = document.getElementsByClassName("options")[0]
    options.style.display = 'block';
    var gameState = document.getElementsByClassName("gameState")[0]
    gameState.style.display = 'none';
}

function setupSaveButton() {
    var button = document.getElementById("saveName")
    button.addEventListener("click", function() {
        saveName()
    });
}

function setupStartButton() {
    var button = document.getElementById("startGame")
    button.addEventListener("click", function() {
        hideOptions()
        setupNewGame()
    });
}

function setupNextGameButton() {
    var button = document.getElementById("startNextGame")
    button.addEventListener("click", function() {
        hideOptions()
        setupNewGame()
    });
}

function setupWhiteSideButton() {
    var button = document.getElementById("whiteColor")
    button.addEventListener("click", function() {
        setupColor(ChessPieceColor.White)
    });
}

function setupBlackSideButton() {
    var button = document.getElementById("blackColor")
    button.addEventListener("click", function() {
        setupColor(ChessPieceColor.Black)
    });
}

function setupColor(color) {
    setupPlayerSide = color
    playerSide = color
    var currentSide = document.getElementById("currentSide")
    currentSide.innerHTML = "currently: " + (color == ChessPieceColor.White ? "white" : "black")
}

function setup1minButton() {
    var button = document.getElementById("1min")
    button.addEventListener("click", function() {
        setupTime(1)
    });
}

function setup3minButton() {
    var button = document.getElementById("3min")
    button.addEventListener("click", function() {
        setupTime(3)
    });
}

function setup5minButton() {
    var button = document.getElementById("5min")
    button.addEventListener("click", function() {
        setupTime(5)
    });
}

function setup10minButton() {
    var button = document.getElementById("10min")
    button.addEventListener("click", function() {
        setupTime(10)
    });
}

function setupTime(time) {
    setupTimeValue = time
    var currentTime = document.getElementById("currentTime")
    currentTime.innerHTML = "currently: " + setupTimeValue + " min"
}

function setup0secButton() {
    var button = document.getElementById("0sec")
    button.addEventListener("click", function() {
        setupIncrementalTime(0)
    });
}

function setup2secButton() {
    var button = document.getElementById("2sec")
    button.addEventListener("click", function() {
        setupIncrementalTime(2)
    });
}

function setup5secButton() {
    var button = document.getElementById("5sec")
    button.addEventListener("click", function() {
        setupIncrementalTime(5)
    });
}

function setup30secButton() {
    var button = document.getElementById("30sec")
    button.addEventListener("click", function() {
        setupChatTime(30)
    });
}

function setup45secButton() {
    var button = document.getElementById("45sec")
    button.addEventListener("click", function() {
        setupChatTime(45)
    });
}

function setup60secButton() {
    var button = document.getElementById("60sec")
    button.addEventListener("click", function() {
        setupChatTime(60)
    });
}

function setupShowPredictionsButton() {
    var button = document.getElementById("showPredictions")
    button.addEventListener("click", function() {
        disablePredictions(false)
    });
}

function setupHidePredictionsButton() {
    var button = document.getElementById("hidePredictions")
    button.addEventListener("click", function() {
        disablePredictions(true)
    });
}

function disablePredictions(bool) {
    disableChatPredictions = bool
    var currentTime = document.getElementById("showPredictionsState")
    currentTime.innerHTML = "currently: " + (disableChatPredictions ? "Hide" : "Show")
}

function setupChatTime(time) {
    initialChatTime = time
    remainingChatTime = time
    var currentTime = document.getElementById("chatResponseTime")
    currentTime.innerHTML = "currently: " + initialChatTime + " sec"
}

function setupIncrementalTime(time) {
    setupIncrementValue = time
    var currentTime = document.getElementById("incrementalTime")
    currentTime.innerHTML = "currently: " + setupIncrementValue + " sec"
}

function saveName() {
    var button = document.getElementById("saveName")
    localStorage.setItem('name', nameInput.value)
    button.innerHTML = "PLEASE RESET APPLICATION"
}

function hideOptions() {
    var overlay = document.getElementsByClassName("overlay")[0]
    overlay.style.display = 'none';
    var options = document.getElementsByClassName("options")[0]
    options.style.display = 'none';
    var gameState = document.getElementsByClassName("gameState")[0]
    gameState.style.display = 'none';
    globalOptionsVisible = false
}

function gameHasFinished(losingColor) {
    window.clearInterval(gameTimer)
    var state = ""
    allowForChatInput = false
    if (losingColor != undefined) {
        var white = losingColor == ChessPieceColor.White ? true : false
        if ((white && globalBoard.flipBoard) || (!white && !globalBoard.flipBoard)) {
            playerScore += 1
            state = "STREAMER WON"
        } else {
            chatScore += 1
            state = "CHAT WON"
        }
    } else {
        state = "DRAW"
        chatScore += 0.5
        playerScore += 0.5
    }
    resizeContentView(window.innerWidth, window.innerHeight)
    showGameState(state)
}

function showGameState(state) {
    var gameStateLabel = document.getElementById("gameStateLabel")
    gameStateLabel.innerHTML = state
    var gameStateChat = document.getElementById("gameStateChat")
    gameStateChat.innerHTML = chatScore.toFixed(1)
    var gameStateStreamer = document.getElementById("gameStateStreamer")
    gameStateStreamer.innerHTML = playerScore.toFixed(1)
    globalOptionsVisible = true
    var overlay = document.getElementsByClassName("overlay")[0]
    overlay.style.display = 'block';
    var gameState = document.getElementsByClassName("gameState")[0]
    gameState.style.display = 'block';
    var options = document.getElementsByClassName("options")[0]
    options.style.display = 'none';
}

function setupResignButton() {
    var button = document.getElementById("resign")
    button.addEventListener("click", function() {
        gameHasFinished(playerSide)
    });
}