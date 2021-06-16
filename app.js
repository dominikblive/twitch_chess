  const tmi = require('tmi.js');
  const client = new tmi.Client({
      connection: { reconnect: true },
      channels: [(localStorage.getItem('name') ? localStorage.getItem('name') : "name")]
  });

  client.connect();

  client.on('message', (channel, tags, message, self) => {
      if (!allowForChatInput) {
          return
      }
      //console.log(`${tags['display-name']}: ${message}`);
      var messageObject = parseMessage(message)
      if (messageObject != undefined) {
          messageInterpreter(messageObject)
      }
  });

  function resizeWindow() {
      var height = window.innerHeight
      var width = window.innerWidth
      resizeContentView(width, height)
  }
  var globalOptionsVisible = false
  window.addEventListener('resize', resizeWindow);


  const contentView = document.getElementById("contentView");
  var contentViewContext = contentView.getContext("2d");
  var globalBoard = new BoardModel()
  var resources = new Resources()
  var playerScore = 0
  var chatScore = 0
  var playerSide = "W"

  contentView.addEventListener('mousedown', e => {
      onClick(e.x, e.y)
  });
  var gameTimer

  function setupNewGame() {
      var wasBoardFliped = globalBoard.flipBoard
      window.clearInterval(gameTimer)
      globalBoard = new BoardModel()
      if (playerScore != 0 || chatScore != 0) {
          globalBoard.flipBoard = !wasBoardFliped
          playerSide = (playerSide == ChessPieceColor.White) ? ChessPieceColor.Black : ChessPieceColor.White
      } else if (setupPlayerSide == ChessPieceColor.Black) {
          globalBoard.flipBoard = true
      }
      globalBoard.spaceMatrix.forEach((row, rowIndex) => {
          row.forEach((item, itemIndex) => {
              if (item != undefined) {
                  item.coverageMap = findLegalMoves(itemIndex, rowIndex, globalBoard, false)
              }
          })
      })

      remainingPlayerTime = setupTimeValue * 60
      remainingChatTime = initialChatTime
      if (globalBoard.currentSide != playerSide) {
          allowForChatInput = true
      } else {
          allowForChatInput = false
      }
      gameTimer = window.setInterval(updateGameState, 1000)
  }

  function updateGameState() {
      if (globalBoard.currentSide != playerSide) {
          remainingChatTime -= 1
      } else {
          remainingPlayerTime -= 1
      }
      if (remainingPlayerTime == 0) {
          gameHasFinished(playerSide)
          return
      }
      if (remainingChatTime == 0) {
          remainingChatTime = initialChatTime
          if (legalMovesForChat.length == 0) {
              var white = playerSide == ChessPieceColor.White
              gameHasFinished(white ? "B" : "W")
              return
          }
          makeChosenMove()
          return
      }
      resizeContentView(window.innerWidth, window.innerHeight)
  }


  setupOptions()
  showOptions()

  /////////////////////// DEBUG
  //   window.setInterval(receiveMessage, 1000)
  //   const randomLetter = ["b"]; //, "e", "f", "g", "h"

  //   function receiveMessage() {
  //       if (!allowForChatInput) {
  //           return
  //       }
  //       var randomLetter = getRandomLetter()
  //           //var message = "!chess(" + randomLetter + 7 + "," + randomLetter + 5 + ")"
  //       var message = "!chess(" + randomLetter + 2 + "," + randomLetter + 4 + ")"
  //       var messageObject = parseMessage(message)
  //       if (messageObject != undefined) {
  //           messageInterpreter(messageObject)
  //       }
  //   }


  ////////////////////////

  function getRandomInt() {
      return Math.round(Math.random() * 8)
  }

  function getRandomLetter() {

      return randomLetter[Math.floor(Math.random() * randomLetter.length)];
  }