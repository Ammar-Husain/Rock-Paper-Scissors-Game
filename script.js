// import score from local storage 
let comModeScore, pvspModeScore
comModeScore = JSON.parse(localStorage.getItem('comModeScore')) || {wins : 0, losses : 0, draws : 0} ;
pvspModeScore = JSON.parse(localStorage.getItem('pvspModeScore')) || {wins : 0, losses : 0, draws : 0};

//playing the game
theMode = 'com';
playTheGame();
async function playTheGame(mode = theMode) {
	if (mode === 'com') {
		pchoice = getChoice();
		computerChoice = getComputerChoice();
		getResult (await pchoice, computerChoice, 'YOU', 'COM');
	}	else {
		let player1Choice = getChoice();
		player1Choice.then (async function(value){
			let player2Choice = getChoice();
			getResult(value, await player2Choice, 'Player1', 'Player2');
		});
	}
}
async function getChoice() {
	let choosingDone = new Promise(function(myResolve) {
		updateScore()
		document.querySelector('.rock').addEventListener('click', function() {
			myResolve('rock')
		});
		document.querySelector('.paper').addEventListener('click', function() {
			myResolve('paper')
		});
		document.querySelector('.scissors').addEventListener('click', function() {
			myResolve('scissors')
		});
	})
	return await choosingDone
	}
function getComputerChoice() {
	const choices = ['rock' , 'paper' , 'scissors'] ;
	return choices[Math.floor(Math.random()*3)]	
}
function getResult (player1Choice, player2Choice, player1Name, player2Name) {
	let result, emoji1, emoji2;
	if (theMode === 'com'){
		score = comModeScore;
		emoji1 = '&#129395';
		emoji2 = '&#x1F921';
	} else {
		emoji1 = '&#129395';
		emoji2 = '&#129395';
		score = pvspModeScore;
	};
	if  ((player1Choice === 'rock' && player2Choice === 'scissors') || 
	(player1Choice === 'paper' && player2Choice === 'rock') || 
	(player1Choice === 'scissors' && player2Choice === 'paper')) {
	result =
		`
		<div class='the-result-text win'>
			${player1Name} WIN ${emoji1};
		<div>
		` ; 
	score.wins ++ ;
} 
	else if ((player2Choice === 'rock' && player1Choice === 'scissors') || 
	(player2Choice === 'paper' && player1Choice === 'rock') || 
	(player2Choice === 'scissors' && player1Choice === 'paper')) {
		result = 
		`
			<div class='the-result-text lose'>
				${player2Name} WIN ${emoji2}
			</div>
		` ;
		score.losses ++ ;
	 } else {
		result =
		`	<div class='the-result-text draw'>
				DRAW &#129309;
			</div>
		`
		 ; 
	;
		score.draws ++ ;
	} ; 
	document.querySelector('.js-result')
	.innerHTML =
	`
	<div class='choices'>
	<div class='side-choice'>
		${player1Name} <img src='${player1Choice}.png' class='result-icon'>
	</div>
	<div class='side-choice'>
		<img src='${player2Choice}.png' class='result-icon'> ${player2Name}
	</div>
	</div>
		${result}
		`
	updateScore() ;
	playTheGame()
} 
function updateScore() {
	if (theMode === 'com') {
		document.querySelector('#wins').innerHTML =
			`\Wins : ${comModeScore.wins}`
		document.querySelector('#losses').innerHTML =
			`\Losses : ${comModeScore.losses}`
		document.querySelector('#draws').innerHTML =
			`\Draws : ${comModeScore.draws}`;
		localStorage.setItem('comModeScore' , JSON.stringify(comModeScore)) ;
	} else {
		document.querySelector('#wins').innerHTML =
			`\Player1 : ${pvspModeScore.wins}`
		document.querySelector('#losses').innerHTML =
			`\Player2 : ${pvspModeScore.losses}`
		document.querySelector('#draws').innerHTML =
			`\Draws : ${pvspModeScore.draws}`;
		localStorage.setItem('pvspModeScore' , JSON.stringify(pvspModeScore)) ;
	}
}

// options buttons
const autoPlayButton = document.querySelector('.auto-play');
const reserScoreButton = document.querySelector('.resetScore');
const modeButton = document.querySelector('.mode');

// buttons click listening 
modeButton.onclick = setTheMode ;
reserScoreButton.onclick = resetScore;
autoPlayButton.onclick = autoPlay;

//buttons functions
function setTheMode() {
	if (modeButton.innerHTML === 'Mode: COM') {
		theMode = 'pvscom'
		modeButton.innerHTML = 'Mode: PvsP'
		modeButton.classList.add('pvspMode')
	} else {
		theMode = 'com'
		modeButton.innerHTML = 'Mode: COM'
		modeButton.classList.remove('pvspMode')
	};
	document.querySelector('.js-result')
		.innerHTML = '';
	updateScore();
}
function resetScore () {
	if (theMode ===  'com') {
		comModeScore = {wins : 0 , losses : 0 , draws : 0}
	} else {
		pvspModeScore = {wins: 0 , losses: 0 , draws: 0}
	};
	updateScore()
}
let autoPlayInterval;
function autoPlay() {
	if (autoPlayButton.innerHTML !== 'Stop') {
		autoPlayInterval = setInterval(function() {
			choice1 = getComputerChoice();
			choice2 = getComputerChoice();
			getResult(choice1, choice2, 'COM1', 'COM2')
		}, 1000)
		autoPlayButton.innerHTML = 'Stop'
		autoPlayButton.classList.add('stop')
	} else {
		clearInterval(autoPlayInterval);
		autoPlayButton.innerHTML = 'Auto Play';
		autoPlayButton.classList.remove('stop')
	}
}
