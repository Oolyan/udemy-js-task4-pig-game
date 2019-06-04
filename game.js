(function() {
  var gameState = {};

  function init() {
    addNewGameButtonHandler();
    addRollDicesButtonHandler();
    addHoldScoresButtonHandler();
    startGame();
  }

  function startGame() {
    setGameState({
      players: generatePlayers(),
      firstDiceScore: 0,
      secondDiceScore: 0,
      prevFirstDiceScore: 0,
      prevSecondDiceScore: 0,
      roundScore: 0,
      activePlayerIndex: 0,
      isActiveGame: true,
      maxScore: getMaxScore(),
      isMaxScoreConfirmed: false,
      isWarning: false
    });
    renderStart();
  }

  function generatePlayers() {
    return [{ name: "Grisha", score: 0 }, { name: "Olga", score: 0 }];
  }

  function setGameState(newGameState) {
    gameState = Object.assign(gameState, newGameState);
    console.log(JSON.stringify(Object.assign({}, gameState), null, "  "));
    render();
  }

  function getGameState() {
    return gameState;
  }

  function getMaxScore() {
    var maxScoreString = document.getElementById("max-score").value;
    return !isNaN(maxScoreString) ? Number(maxScoreString) : 100;
  }

  function getRandomDiceScore() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function nextPlayer() {
    setGameState({
      activePlayerIndex: getNextPlayerIndex(),
      roundScore: 0,
      isWarning: true
    });
  }

  function rollDices() {
    var state = getGameState();
    if (!state.isMaxScoreConfirmed) {
      setGameState({ maxScore: getMaxScore(), isMaxScoreConfirmed: true });
    }
    if (state.isActiveGame) {
      setGameState({
        prevFirstDiceScore: state.firstDiceScore,
        prevSecondDiceScore: state.secondDiceScore,
        firstDiceScore: getRandomDiceScore(),
        secondDiceScore: getRandomDiceScore(),
        isWarning: false
      });
      state = getGameState();
      if (state.firstDiceScore === 1 || state.secondDiceScore === 1) {
        nextPlayer();
      } else if (
        (state.firstDiceScore === state.prevFirstDiceScore) === 6 ||
        (state.secondDiceScore === state.prevSecondDiceScore) === 6
      ) {
        setActivePlayerScore(0);
        nextPlayer();
      } else {
        setGameState({
          roundScore:
            state.roundScore + state.firstDiceScore + state.secondDiceScore
        });
      }
    }
  }

  function holdScores() {
    var state = getGameState();
    if (state.isActiveGame) {
      setActivePlayerScore(state.roundScore + getActivePlayerScore());
      if (isGameFinished()) {
        setGameState({ isActiveGame: false });
      }
    }
  }

  function isGameFinished() {
    return getActivePlayerScore() >= getGameState().maxScore;
  }

  function getActivePlayerScore() {
    var state = getGameState();
    return state.players[state.activePlayerIndex].score;
  }

  function setActivePlayerScore(score) {
    var state = getGameState();
    var newPlayers = state.players.slice();
    newPlayers[state.activePlayerIndex].score = score;
    setGameState({ players: newPlayers });
  }

  function getNextPlayerIndex() {
    var state = getGameState();
    if (state.activePlayerIndex == state.players.length - 1) {
      return 0;
    } else {
      return state.activePlayerIndex + 1;
    }
  }

  function addRollDicesButtonHandler() {
    document.querySelector(".btn-roll").addEventListener("click", function() {
      rollDices();
    });
  }

  function addHoldScoresButtonHandler() {
    document.querySelector(".btn-hold").addEventListener("click", function() {
      holdScores();
      if (getGameState().isActiveGame) {
        nextPlayer();
      }
    });
  }

  function addNewGameButtonHandler() {
    document.querySelector(".btn-new").addEventListener("click", function() {
      startGame();
    });
  }

  function render() {
    renderDices();
    renderRoundScores();
    renderScores();
    renderActivePlayerMark();
    if (isGameFinished()) {
      renderWinner();
    }
  }

  function renderStart() {
    var state = getGameState();
    document.getElementById("max-score").disabled = false;
    state.players.forEach(function(player, playerIndex) {
      document.getElementById("score-" + playerIndex).textContent =
        player.score;
      document.getElementById("name-" + playerIndex).textContent = player.name;
      document
        .querySelector(".player-" + playerIndex + "-panel")
        .classList.remove("winner");
    });
  }

  function renderDices() {
    var state = getGameState();
    if (state.isWarning) {
      document.querySelector(".dices").classList.add("warning");
    } else {
      document.querySelector(".dices").classList.remove("warning");
    }
    document.getElementById("max-score").disabled = true;
    if (state.firstDiceScore > 0 && state.secondDiceScore > 0) {
      var diceDOM = document.querySelector(".dice");
      var diceDOM2 = document.querySelector(".dice2");
      diceDOM.src = "dice-" + state.firstDiceScore + ".png";
      diceDOM2.src = "dice-" + state.secondDiceScore + ".png";
      diceDOM.style.display = "block";
      diceDOM2.style.display = "block";
    } else {
      document.querySelector(".dice").style.display = "none";
      document.querySelector(".dice2").style.display = "none";
    }
  }

  function renderRoundScores() {
    var state = getGameState();
    state.players.forEach(function(player, playerIndex) {
      var playerRoundScoreSelector = document.getElementById(
        "current-" + playerIndex
      );
      if (playerIndex === state.activePlayerIndex) {
        playerRoundScoreSelector.textContent = state.roundScore;
      } else {
        playerRoundScoreSelector.textContent = "0";
      }
    });
  }

  function renderScores() {
    var state = getGameState();
    state.players.forEach(function(player, playerIndex) {
      document.getElementById("score-" + playerIndex).textContent =
        player.score;
    });
  }

  function renderActivePlayerMark() {
    var state = getGameState();
    state.players.forEach(function(player, playerIndex) {
      if (playerIndex === state.activePlayerIndex) {
        document
          .querySelector(".player-" + playerIndex + "-panel")
          .classList.add("active");
      } else {
        document
          .querySelector(".player-" + playerIndex + "-panel")
          .classList.remove("active");
      }
    });
  }

  function renderWinner() {
    document
      .querySelector(".player-" + getGameState().activePlayerIndex + "-panel")
      .classList.add("winner");
    document.getElementById(
      "name-" + getGameState().activePlayerIndex
    ).textContent = "WINNER!";
  }

  init();
})();
