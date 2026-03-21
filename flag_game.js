flag_game.js

const totalRounds = 10;
const answerTime = 3000;

let currentRound = 1;
let score = 0;
let currentAnswer = '';
let gameOver = false;
let inputLocked = true;
let questionTimeout = null;
let countdownInterval = null;

const problems = [
    { text: '청기 들어!', answer: 'blue' },
    { text: '백기 들어!', answer: 'white' },
    { text: '청기 들지 말고 백기 들어!', answer: 'white' },
    { text: '백기 들지 말고 청기 들어!', answer: 'blue' },
    { text: '청기 들고 백기 들지 마!', answer: 'blue' },
    { text: '백기 들고 청기 들지 마!', answer: 'white' },
    { text: '청기 말고 백기 들어!', answer: 'white' },
    { text: '백기 말고 청기 들어!', answer: 'blue' },
    { text: '청기는 들지 말고 백기만 들어!', answer: 'white' },
    { text: '백기는 들지 말고 청기만 들어!', answer: 'blue' },
];

let shuffledProblems = [];
let problemIndex = 0;

const roundEl = document.getElementById('round');
const scoreEl = document.getElementById('score');
const commandEl = document.getElementById('command');
const timerEl = document.getElementById('timer');
const picoEl = document.getElementById('pico');

const READY_IMAGE = './image/flag/삐코_청기백기2.jpg';
const BLUE_IMAGE = './image/flag/blue_up.jpg';
const WHITE_IMAGE = './image/flag/white_up.jpg';

//문제 진행 사항
function updateTopBar() {
    roundEl.textContent = `${currentRound}/${totalRounds}`;
    scoreEl.textContent = score;
}

//타이머
function clearTimers() {
    clearTimeout(questionTimeout);
    clearInterval(countdownInterval);
}

function shuffleArray(array) {
    const copied = [...array];
    for (let i = copied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
}

function resetProblemQueue() {
    shuffledProblems = shuffleArray(problems);
    problemIndex = 0;
}

function setReadyState() {
    picoEl.src = READY_IMAGE;
    commandEl.textContent = '준비!';
    inputLocked = true;
}

function startIntroCountdown() {
    setReadyState();

    let count = 3;
    timerEl.textContent = count;

    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            timerEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            timerEl.textContent = '';
            if (!gameOver) {
                setNewProblem();
            }
        }
    }, 1000);
}


function setNewProblem() {
    if (problemIndex >= shuffledProblems.length) {
        resetProblemQueue();
    }

    const selected = shuffledProblems[problemIndex];
    problemIndex++;

    currentAnswer = selected.answer;
    commandEl.textContent = selected.text;
    inputLocked = false;

    startQuestionTimer();
}

function startQuestionTimer() {
    let remaining = Math.ceil(answerTime / 1000); // 3,2,1
    timerEl.textContent = remaining;

    countdownInterval = setInterval(() => {
        remaining--;
        if (remaining > 0) {
            timerEl.textContent = remaining;
        } else {
            clearInterval(countdownInterval);
            timerEl.textContent = '';
        }
    }, 1000);

    questionTimeout = setTimeout(() => {
        handleTimeout();
    }, answerTime);
}

function handleTimeout() {
    if (gameOver || inputLocked) return;

    inputLocked = true;
    resultEl.textContent = '시간 초과!';
    picoEl.src = READY_IMAGE;

    setTimeout(() => {
        nextRound();
    }, 500);
}

function endGame() {
    gameOver = true;
    clearTimers();
    commandEl.textContent = '게임 종료!';
    timerEl.textContent = '';
    picoEl.src = READY_IMAGE;
    inputLocked = true;
}

function showRaisedFlag(userInput) {
    if (userInput === 'blue') {
        picoEl.src = BLUE_IMAGE;
    } else {
        picoEl.src = WHITE_IMAGE;
    }
}

function nextRound() {
    clearTimers();

    if (currentRound >= totalRounds) {
        endGame();
        return;
    }

    currentRound++;
    updateTopBar();
    picoEl.src = READY_IMAGE;
    setNewProblem();
}

function checkAnswer(userInput) {
    if (gameOver || inputLocked) return;

    inputLocked = true;
    clearTimers();

    showRaisedFlag(userInput);

    if (userInput === currentAnswer) {
        score++;
        resultEl.textContent = '정답';
    } else {
        resultEl.textContent = '오답';
    }

    updateTopBar();

    setTimeout(() => {
        picoEl.src = READY_IMAGE;
    }, 250);

    setTimeout(() => {
        nextRound();
    }, 500);
}

document.addEventListener('keydown', (event) => {
    if (gameOver || inputLocked) return;

    if (event.key === 'ArrowLeft') {
        checkAnswer('blue');
    } else if (event.key === 'ArrowRight') {
        checkAnswer('white');
    }
});

resetProblemQueue();
updateTopBar();
startIntroCountdown();