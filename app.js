var scores, roundScore, activePlayer, gamePlaying, prevDice, prevDice2;

function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.getElementById('name-0').textContent = 'player1';
    document.getElementById('name-1').textContent = 'player2';

}

init();

document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying) {
        var dice = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;
        var diceDOM = document.querySelector('.dice');
        var diceDOM2 = document.querySelector('.dice2');
        diceDOM.src = 'dice-' + dice +'.png';
        diceDOM2.src = 'dice-' + dice2 +'.png';
        diceDOM.style.display = 'block';    
        diceDOM2.style.display = 'block'; 
        if (dice !== 1 && dice2 !== 1) {
            roundScore += dice + dice2;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
            if ((dice === 6 && prevDice === 6) || (dice2 === 6 && prevDice2 === 6)) {
                scores[activePlayer] = 0;
                document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
                nextPlayer();
            }
            prevDice = dice;
            prevDice2 = dice2;
        }
        else {
        nextPlayer();
        }
    
    }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
        var input = document.getElementById('max-score').value;
        var maxScore;
        if (input && input > 0) {
            maxScore = input;
        } else {
            maxScore = 5;
        }
        if (scores[activePlayer] >= maxScore) { 
            gamePlaying = false;
            document.getElementById('name-' + activePlayer).textContent = 'WINNER!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.dice2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        } else {
        nextPlayer();
        }
             
    }
});

function nextPlayer() {
    roundScore = 0;
    prevDice = 0;
    prevDice2 = 0;
    document.getElementById('current-' + activePlayer).textContent = roundScore;
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);