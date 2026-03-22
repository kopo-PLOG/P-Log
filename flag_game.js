const totalRounds = 10;
const answerTime = 3000;
const MAX_LEVEL = 120; // 최대 게이지
const LEVEL_STEP = 10; // 증가/감소 값

let currentRound = 1;
let score = 0;
let currentAnswer = '';
let gameOver = false;
let inputLocked = true;
let isEnding = false;

let questionTimeout = null;
let countdownInterval = null;
let shuffledProblems = []; //문제섞기
let problemIndex = 0;

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

const roundEl = document.getElementById('round');
const scoreEl = document.getElementById('score');
const commandEl = document.getElementById('command');
const timerEl = document.getElementById('timer');
const picoEl = document.getElementById('pico');
const blueBtn = document.getElementById('blue-btn');
const whiteBtn = document.getElementById('white-btn');

const READY_IMAGE = './image/flag/삐코_청기백기2.jpg';
const BLUE_IMAGE = './image/flag/blue_up.jpg';
const WHITE_IMAGE = './image/flag/white_up.jpg';
const HAPPY_IMAGE = './image/삐코_환호.png';
const SAD_IMAGE = './image/삐코_머쓱.png';


if (localStorage.getItem('level') === null) {
    localStorage.setItem('level', '0');
}

function changeStoredLevel(amount) {
    let level = parseInt(localStorage.getItem('level'), 10) || 0;

    level += amount;

    // 범위 제한 (0 ~ 120)
    if (level < 0) level = 0;
    if (level > MAX_LEVEL) level = MAX_LEVEL;

    localStorage.setItem('level', level);
}

//상단문제 및 점수 업데이트
function updateTopBar() {
    roundEl.textContent = `${currentRound}/${totalRounds}`;
    scoreEl.textContent = score;
}

//타이머,중복방지
function clearTimers() {
    clearTimeout(questionTimeout);
    clearInterval(countdownInterval);
}

//문제 랜덤
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

//준비상태
function setReadyState() {
    picoEl.src = READY_IMAGE;
    commandEl.textContent = '준비!';
    inputLocked = true;
}
//시작전 카운트
function startIntroCountdown() {
    clearTimers();
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

//문제 세팅
function setNewProblem() {
    if (problemIndex >= shuffledProblems.length) {
        resetProblemQueue();
    }
    const selected = shuffledProblems[problemIndex];
    problemIndex++;

    currentAnswer = selected.answer;
    commandEl.textContent = selected.text;
    inputLocked = false;

    picoEl.src = READY_IMAGE;
    blueBtn.textContent = '←청기';
    whiteBtn.textContent = '백기 →';
    blueBtn.disabled = false;
    whiteBtn.disabled = false;


    startQuestionTimer();
}
//문제 타이머
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

    //시간초과 처리
    questionTimeout = setTimeout(() => {
        handleTimeout();
    }, answerTime);
}
//시간초과
function handleTimeout() {
    if (gameOver || inputLocked) return;

    inputLocked = true;
    commandEl.textContent = '시간 초과!';
    picoEl.src = READY_IMAGE;

    setTimeout(() => {
        nextRound();
    }, 500);
}

function showRaisedFlag(userInput) {
    if (userInput === 'blue') {
        picoEl.src = BLUE_IMAGE;
    } else {
        picoEl.src = WHITE_IMAGE;
    }
}

//정답체크
function checkAnswer(userInput) {
    if (gameOver || inputLocked) return;

    inputLocked = true;
    clearTimers();

    showRaisedFlag(userInput);

    if (userInput === currentAnswer) {
        score++;
        commandEl.textContent = '정답';
    } else {
        commandEl.textContent = '오답';
    }

    updateTopBar();

    setTimeout(() => {
        nextRound();
    }, 500);
}
function nextRound() {
    clearTimers();

    if (currentRound >= totalRounds) {
        showEndScreen();
        return;
    }

    currentRound++;
    updateTopBar();
    setNewProblem();
}
function showEndScreen() {
    gameOver = true;
    isEnding = true;
    inputLocked = true;
    clearTimers();

    timerEl.textContent = '';

    if (score >= 7) {
        picoEl.src = HAPPY_IMAGE;
        commandEl.innerHTML = `${totalRounds}문제 중 ${score}문제 정답!<br>게이지 +10<br>다시 하시겠습니까?`;
        changeStoredLevel(LEVEL_STEP);
    } else {
        picoEl.src = SAD_IMAGE;
        commandEl.innerHTML = `${totalRounds}문제 중 ${score}문제 정답!<br>게이지 -10<br>다시 하시겠습니까?`;
        changeStoredLevel(-LEVEL_STEP);
    }

    blueBtn.textContent = '예';
    whiteBtn.textContent = '아니오';
    blueBtn.disabled = false;
    whiteBtn.disabled = false;
}
function restartGame() {
    clearTimers();

    currentRound = 1;
    score = 0;
    currentAnswer = '';
    gameOver = false;
    inputLocked = true;
    isEnding = false;

    resetProblemQueue();
    updateTopBar();

    blueBtn.textContent = '←청기';
    whiteBtn.textContent = '백기 →';
    blueBtn.disabled = false;
    whiteBtn.disabled = false;

    startIntroCountdown();
}
function handleEndingChoice(choice) {
    if (!isEnding) return;
    if (choice === 'yes') {
        restartGame();
    } else {
     
        commandEl.innerHTML = `게임을 종료했어요!<br>수고했어요 :)`;
        timerEl.textContent = '';
        blueBtn.disabled = true;
        whiteBtn.disabled = true;
    }
}

//키보드 입력
document.addEventListener('keydown', (event) => {
    if (isEnding) {
        if (event.key === 'ArrowLeft') {
            handleEndingChoice('yes');
        } else if (event.key === 'ArrowRight') {
            handleEndingChoice('no');
        }
        return;
    }

    if (gameOver || inputLocked) return;
    if (event.key === 'ArrowLeft') {
        checkAnswer('blue');
    } else if (event.key === 'ArrowRight') {
        checkAnswer('white');
    }
});

blueBtn.addEventListener('click', () => {
    if (isEnding) {
        handleEndingChoice('yes');
        return;
    }
    checkAnswer('blue');
});

whiteBtn.addEventListener('click', () => {
    if (isEnding) {
        handleEndingChoice('no');
        return;
    }
    checkAnswer('white');
});

resetProblemQueue();
updateTopBar();
startIntroCountdown();