const roundEl = document.getElementById("round");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

const inputDisplayEl = document.getElementById("input-display");
const arrowDisplayEl = document.getElementById("arrow-display");
const buttonAreaEl = document.getElementById("button-area");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const startBtn = document.getElementById("start-btn");
const resultMessageEl = document.getElementById("result-message");

const TOTAL_ROUNDS = 5; // 5라운드로 진행
const SEQUENCE_LENGTH = 7; // 방향 7개를 보여줌
const PREVIEW_SECONDS = 5; // 방향은 5초동안 보여줌
const INPUT_SECONDS = 10; // 보여준 방향 7개를 10초동안 작성

const MAX_LEVEL = 120; // 게이지는 120이 최대!
const LEVEL_STEP = 10; // 

let currentRound = 1;
let successRoundCount = 0;
let answerSequence = [];
let userSequence = [];

let previewTimer = null;
let inputTimer = null;

let previewLeft = PREVIEW_SECONDS;
let inputLeft = INPUT_SECONDS;

let gameStarted = false;
let isInputPhase = false;

// ----------------------
// localStorage 게이지 처리
// ----------------------
function getStoredLevel() {
    const saved = localStorage.getItem("level");
    const parsed = parseInt(saved, 10);
    return isNaN(parsed) ? 0 : parsed;
}

function setStoredLevel(value) {
    const clamped = Math.max(0, Math.min(MAX_LEVEL, value));
    localStorage.setItem("level", clamped);
}

function changeStoredLevel(amount) {
    const current = getStoredLevel();
    setStoredLevel(current + amount);
}

// level 값이 아예 없을 때 초기 세팅
if (localStorage.getItem("level") === null) {
    localStorage.setItem("level", "0");
}

// ----------------------
// 초기 세팅
// ----------------------
initGame();

function initGame() {
    roundEl.textContent = "0";
    scoreEl.textContent = "0";
    timeEl.textContent = "초";

    timeEl.textContent = ""; // 게임 초기 화면에는 [남은 시간] 문구가 표시되지 않게!!

    inputDisplayEl.style.display = "none";
    inputDisplayEl.textContent = "";

    buttonAreaEl.style.display = "none";

    resultMessageEl.textContent = "";
    startBtn.disabled = false;
    startBtn.style.display = "inline-block";
}

// ----------------------
// 게임 시작
// ----------------------
startBtn.addEventListener("click", startGame);

function startGame() {
    clearAllTimers();

    gameStarted = true;
    isInputPhase = false;

    currentRound = 1;
    successRoundCount = 0;
    answerSequence = [];
    userSequence = [];

    roundEl.textContent = currentRound;
    scoreEl.textContent = successRoundCount;
    resultMessageEl.textContent = "";

    inputDisplayEl.textContent = "";
    inputDisplayEl.style.display = "none";

    buttonAreaEl.style.display = "none";
    startBtn.style.display = "none";

    arrowDisplayEl.textContent = "게임 시작!";


    setTimeout(() => {
        startRound();
    }, 2000);
}

// ----------------------
// 라운드 시작
// ----------------------
function startRound() {
    isInputPhase = false;
    userSequence = [];
    inputDisplayEl.textContent = "";
    inputDisplayEl.style.display = "none";
    buttonAreaEl.style.display = "none";
    resultMessageEl.textContent = "";

    roundEl.textContent = currentRound;
    scoreEl.textContent = successRoundCount;

    answerSequence = generateRandomSequence(SEQUENCE_LENGTH);
    arrowDisplayEl.textContent = answerSequence.join(" ");

    startPreviewTimer();
}

function generateRandomSequence(length) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(Math.random() < 0.5 ? "<" : ">");
    }
    return arr;
}

// ----------------------
// 3초 미리보기
// ----------------------
function startPreviewTimer() {
    previewLeft = PREVIEW_SECONDS;
    timeEl.textContent = `${previewLeft}초`;

    previewTimer = setInterval(() => {
        previewLeft--;

        if (previewLeft > 0) {
            timeEl.textContent = `${previewLeft}초`;
        } else {
            clearInterval(previewTimer);
            startInputPhase();
        }
    }, 1000);
}

// ----------------------
// 입력 단계 시작
// ----------------------
function startInputPhase() {
    isInputPhase = true;

    arrowDisplayEl.textContent = "";
    inputDisplayEl.style.display = "flex";
    buttonAreaEl.style.display = "flex";

    inputLeft = INPUT_SECONDS;
    timeEl.textContent = `${inputLeft}초`;

    inputTimer = setInterval(() => {
        inputLeft--;

        if (inputLeft > 0) {
            timeEl.textContent = `${inputLeft}초`;
        } else {
            clearInterval(inputTimer);
            failGame("시간 초과! 게임 전체 실패");
        }
    }, 1000);
}

// ----------------------
// 버튼 입력
// ----------------------
leftBtn.addEventListener("click", () => handleArrowInput("<"));
rightBtn.addEventListener("click", () => handleArrowInput(">"));

document.addEventListener("keydown", (event) => {
    if(!gameStarted || !isInputPhase) return;

    if(event.key === "ArrowLeft"){
        event.preventDefault();
        handleArrowInput("<");
    } else if (event.key === "ArrowRight"){
        handleArrowInput(">");
    }
});

function handleArrowInput(direction) {
    if (!gameStarted || !isInputPhase) return;

    userSequence.push(direction);
    inputDisplayEl.textContent = userSequence.join(" ");

    const currentIndex = userSequence.length - 1;

    if (userSequence[currentIndex] !== answerSequence[currentIndex]) {
        failGame("방향 입력 실패! 게임 전체 실패");
        return;
    }

    if (userSequence.length === SEQUENCE_LENGTH) {
        clearInterval(inputTimer);
        isInputPhase = false;

        successRoundCount++;
        scoreEl.textContent = successRoundCount;

        if (currentRound === TOTAL_ROUNDS) {
            successGame();
        } else {
            resultMessageEl.textContent = `${currentRound}라운드 성공!`;
            currentRound++;

            setTimeout(() => {
                startRound();
            }, 800);
        }
    }
}

// ----------------------
// 게임 성공 / 실패
// ----------------------
function successGame() {
    clearAllTimers();

    gameStarted = false;
    isInputPhase = false;

    buttonAreaEl.style.display = "none";
    inputDisplayEl.style.display = "none";

    arrowDisplayEl.textContent = "성공!";
    timeEl.textContent = "종료";
    resultMessageEl.textContent = "5라운드 모두 성공! 게이지 +10";

    changeStoredLevel(LEVEL_STEP);

    startBtn.style.display = "inline-block";
    startBtn.disabled = false;
}

function failGame(message) {
    clearAllTimers();

    gameStarted = false;
    isInputPhase = false;

    buttonAreaEl.style.display = "none";
    inputDisplayEl.style.display = "none";

    arrowDisplayEl.textContent = "실패!";
    timeEl.textContent = "종료";
    resultMessageEl.textContent = `${message} / 게이지 -10`;

    changeStoredLevel(-LEVEL_STEP);

    startBtn.style.display = "inline-block";
    startBtn.disabled = false;
}

// ----------------------
// 타이머 정리
// ----------------------
function clearAllTimers() {
    clearInterval(previewTimer);
    clearInterval(inputTimer);
}