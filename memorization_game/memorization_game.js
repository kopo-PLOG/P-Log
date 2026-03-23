
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
const startOverlayEl = document.getElementById("start-overlay");
const backBtnEl = document.getElementById("back-btn");
const retryAreaEl = document.getElementById("retry-area");
const yesBtnEl = document.getElementById("yes-btn");
const noBtnEl = document.getElementById("no-btn");
const infoBoxEl = document.getElementById("info-box");
const timerBoxEl = document.getElementById("timer-box");
 
const stateImageEl = document.getElementById("state-image");
const inputBubbleWrapEl = document.getElementById("input-bubble-wrap");
const arrowTextEl = document.getElementById("arrow-text");
const memoWrapEl = document.querySelector(".memo-wrap");
 
const TOTAL_ROUNDS = 5;
const SEQUENCE_LENGTH = 7;
const PREVIEW_SECONDS = 5;
const INPUT_SECONDS = 10;
 
const MAX_LEVEL = 120;
const SUCCESS_LEVEL_STEP = 20;
const FAIL_LEVEL_STEP = 5;
 
let currentRound = 1;
let successRoundCount = 0;
let answerSequence = [];
let userSequence = [];
 
let previewTimer = null;
let inputTimer = null;
let stareDelayTimer = null;
let roundDelayTimer = null;
 
let previewLeft = PREVIEW_SECONDS;
let inputLeft = INPUT_SECONDS;
 
let gameStarted = false;
let isInputPhase = false;
let waitingForStart = true; // 시작 대기 상태 (아래 방향키 기다리는 중)
 
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
 
if (localStorage.getItem("level") === null) {
    localStorage.setItem("level", "0");
}
 
// ----------------------
// 초기 세팅
// ----------------------
initGame();
 
function initGame() {
    clearAllTimers();
 
    gameStarted = false;
    isInputPhase = false;
    waitingForStart = true;
 
    currentRound = 1;
    successRoundCount = 0;
    answerSequence = [];
    userSequence = [];
 
    roundEl.textContent = "0";
    scoreEl.textContent = "0";
    timeEl.textContent = "";
 
    inputDisplayEl.style.display = "none";
    inputDisplayEl.textContent = "";
 
    buttonAreaEl.style.display = "none";
 
    resultMessageEl.textContent = "";
    resultMessageEl.style.color = "";
 
    startBtn.style.display = "inline-flex";
    startOverlayEl.style.display = "none";
    retryAreaEl.style.display = "none";
    infoBoxEl.style.display = "flex"; // 라운드/성공 다시 표시
    timerBoxEl.style.display = "block"; // 남은 시간 다시 표시
 
    showInitialState();
}
 
// ----------------------
// 상태 별 이미지/말풍선 표시
// ----------------------
function showInitialState() {
    if (stateImageEl) {
        stateImageEl.src = "../image/삐코_암기게임.png";
        stateImageEl.style.display = "block";
    }
    if (inputBubbleWrapEl) {
        inputBubbleWrapEl.style.display = "none";
    }
    if (arrowTextEl) {
        arrowTextEl.textContent = "";
    }
}
 
// 암기 단계: 캐릭터 이미지 숨기고 말풍선만 표시
function showMemorizeState(sequenceText) {
    if (stateImageEl) {
        stateImageEl.style.display = "none"; // 이미지 숨김
    }
    if (inputBubbleWrapEl) {
        inputBubbleWrapEl.style.display = "block";
    }
    if (arrowTextEl) {
        arrowTextEl.textContent = sequenceText;
    }
}
 
// 입력 단계: 캐릭터 이미지 숨기고 말풍선만 표시
function showInputState(userText = "") {
    if (stateImageEl) {
        stateImageEl.style.display = "none"; // 이미지 숨김
    }
    if (inputBubbleWrapEl) {
        inputBubbleWrapEl.style.display = "block";
    }
    if (arrowTextEl) {
        arrowTextEl.textContent = userText;
    }
}
 
function showFinalSuccessState() {
    if (stateImageEl) {
        stateImageEl.src = "../image/삐코_환호.png";
        stateImageEl.style.display = "block";
    }
    if (inputBubbleWrapEl) {
        inputBubbleWrapEl.style.display = "none";
    }
    if (arrowTextEl) {
        arrowTextEl.textContent = "";
    }
}
 
function showFailState() {
    if (stateImageEl) {
        stateImageEl.src = "../image/삐코_암기게임.png";
        stateImageEl.style.display = "block";
    }
    if (inputBubbleWrapEl) {
        inputBubbleWrapEl.style.display = "none";
    }
    if (arrowTextEl) {
        arrowTextEl.textContent = "";
    }
}
 
// ----------------------
// 게임 시작 (오버레이 → 2초 후 본게임)
// ----------------------
function startGame() {
    if (!waitingForStart) return;
    waitingForStart = false;
 
    clearAllTimers();
 
    // "게임 시작!" 오버레이 2초 표시
    startBtn.style.display = "none";
    startOverlayEl.style.display = "flex";
    backBtnEl.style.display = "none"; // 게임 중 숨김
 
    stareDelayTimer = setTimeout(() => {
        startOverlayEl.style.display = "none";
 
        gameStarted = true;
        isInputPhase = false;
 
        currentRound = 1;
        successRoundCount = 0;
        answerSequence = [];
        userSequence = [];
 
        roundEl.textContent = currentRound;
        scoreEl.textContent = successRoundCount;
        resultMessageEl.textContent = "";
        resultMessageEl.style.color = "";
 
        inputDisplayEl.textContent = "";
        inputDisplayEl.style.display = "none";
        buttonAreaEl.style.display = "none";
        timeEl.textContent = "";
 
        showInitialState();
 
        // 잠깐 대기 후 첫 라운드
        roundDelayTimer = setTimeout(() => {
            startRound();
        }, 800);
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
    resultMessageEl.style.color = "";
 
    roundEl.textContent = currentRound;
    scoreEl.textContent = successRoundCount;
 
    answerSequence = generateRandomSequence(SEQUENCE_LENGTH);
    showMemorizeState(answerSequence.join(" "));
 
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
// 5초 미리보기
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
            previewTimer = null;
            startInputPhase();
        }
    }, 1000);
}
 
// ----------------------
// 입력 단계 시작
// ----------------------
function startInputPhase() {
    isInputPhase = true;
 
    inputDisplayEl.style.display = "none";
    buttonAreaEl.style.display = "flex";
 
    userSequence = [];
    showInputState(""); // 말풍선만, 이미지 숨김
 
    inputLeft = INPUT_SECONDS;
    timeEl.textContent = `${inputLeft}초`;
 
    inputTimer = setInterval(() => {
        inputLeft--;
        if (inputLeft > 0) {
            timeEl.textContent = `${inputLeft}초`;
        } else {
            clearInterval(inputTimer);
            inputTimer = null;
            failGame("시간 초과! 게임 실패");
        }
    }, 1000);
}
 
// ----------------------
// 키보드 입력 (마우스 버튼은 pointer-events: none으로 비활성화)
// ----------------------

document.addEventListener("keydown", (event) => {
    // 아래 방향키: 게임 시작 대기 중일 때 게임 시작
    if (event.key === "ArrowDown") {
        event.preventDefault();
        
        if (waitingForStart && retryAreaEl.style.display !=="flex") {
            startBtn.classList.add("active-key");
            setTimeout(()=>{
                startGame();
            }, 150);
        }
        return;
    }
 
    // 왼쪽 방향키: 초기 대기 화면에서 뒤로가기
    if (event.key === "ArrowLeft" && waitingForStart && retryAreaEl.style.display !== "flex") {
        event.preventDefault();
        backBtnEl.classList.add("active-key");
        // 버튼 효과 후 페이지 이동
        setTimeout(() => {
            location.href = "../game_list/game_list.html";
        }, 150);
        return;
    }
 
    // 재도전 선택 중일 때: 왼쪽=예, 오른쪽=아니오
    if (retryAreaEl.style.display === "flex") {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            yesBtnEl.classList.add("active-key");
            setTimeout(() => {
                retryAreaEl.style.display = "none";
                resultMessageEl.textContent = "";
                waitingForStart = true;
                yesBtnEl.classList.remove("active-key"); // 클래스 초기화
                startGame();
            }, 150);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            noBtnEl.classList.add("active-key");
            setTimeout(() => {
                location.href = "../game_list/game_list.html";
            }, 150);
        }
        return;
    }
 
    if (!gameStarted || !isInputPhase) return;
 
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleArrowInput("<");
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleArrowInput(">");
    }
});
 
function handleArrowInput(direction) {
    if (!gameStarted || !isInputPhase) return;
 
    userSequence.push(direction);
 
    const joinedInput = userSequence.join(" ");
    inputDisplayEl.textContent = joinedInput;
 
    // 말풍선 안에 입력한 방향 표시
    if (arrowTextEl) {
        arrowTextEl.textContent = joinedInput;
    }
 
    const currentIndex = userSequence.length - 1;
 
    if (userSequence[currentIndex] !== answerSequence[currentIndex]) {
        failGame("방향 입력 실패! 게임 실패");
        return;
    }
 
    if (userSequence.length === SEQUENCE_LENGTH) {
        clearInterval(inputTimer);
        inputTimer = null;
        isInputPhase = false;
 
        successRoundCount++;
        scoreEl.textContent = successRoundCount;
 
        if (currentRound === TOTAL_ROUNDS) {
            successGame();
        } else {
            resultMessageEl.textContent = `${currentRound}라운드 성공!`;
            resultMessageEl.style.color = "";
 
            // 파란 테두리 반짝 효과
            memoWrapEl.classList.remove('blink-blue');
            void memoWrapEl.offsetWidth;
            memoWrapEl.classList.add('blink-blue');
 
            // 1.5초 동안 말풍선에 "정답!"만 표시 (이미지 숨김)
            buttonAreaEl.style.display = "none";
            if (stateImageEl) stateImageEl.style.display = "none";
            if (inputBubbleWrapEl) inputBubbleWrapEl.style.display = "block";
            if (arrowTextEl) arrowTextEl.textContent = "정답!";
 
            currentRound++;
 
            roundDelayTimer = setTimeout(() => {
                startRound();
            }, 1500);
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
    waitingForStart = false; // 재도전 선택 대기 중
 
    buttonAreaEl.style.display = "none";
    inputDisplayEl.style.display = "none";
    startBtn.style.display = "none";
    backBtnEl.style.display = "none";
    infoBoxEl.style.display = "none"; // 라운드/성공 숨김
    timerBoxEl.style.display = "none"; // 남은 시간 숨김
 
    showFinalSuccessState();
 
    timeEl.textContent = "종료";
    resultMessageEl.textContent = "5라운드 모두 성공! 게이지 +20";
    resultMessageEl.style.color = "red";
 
    changeStoredLevel(SUCCESS_LEVEL_STEP);
 
    retryAreaEl.style.display = "flex";
}
 
function failGame(message) {
    clearAllTimers();
 
    gameStarted = false;
    isInputPhase = false;
    waitingForStart = false; // 재도전 선택 대기 중
 
    buttonAreaEl.style.display = "none";
    inputDisplayEl.style.display = "none";
    backBtnEl.style.display = "none"; // 실패 시 뒤로가기 숨김
    infoBoxEl.style.display = "none"; // 라운드/성공 숨김
    timerBoxEl.style.display = "none"; // 남은 시간 숨김
 
    // 실패 이미지
    if (stateImageEl) {
        stateImageEl.src = "../image/indexImg/pico_angry.gif";
        stateImageEl.style.display = "block";
    }
    if (inputBubbleWrapEl) {
        inputBubbleWrapEl.style.display = "none";
    }
 
    timeEl.textContent = "종료";
    resultMessageEl.textContent = `${message} / 게이지 -5`;
    resultMessageEl.style.color = "red";
 
    changeStoredLevel(-FAIL_LEVEL_STEP);
 
    // 재도전 UI 표시, 게임시작 버튼 숨김
    startBtn.style.display = "none";
    retryAreaEl.style.display = "flex";
}
 
// ----------------------
// 타이머 정리
// ----------------------
function clearAllTimers() {
    clearInterval(previewTimer);
    clearInterval(inputTimer);
 
    previewTimer = null;
    inputTimer = null;
 
    clearTimeout(stareDelayTimer);
    clearTimeout(roundDelayTimer);
 
    stareDelayTimer = null;
    roundDelayTimer = null;
}

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowDown") {
        startBtn.classList.remove("active-key");
    }
    if (event.key === "ArrowLeft") {
        backBtnEl.classList.remove("active-key");
        yesBtnEl.classList.remove("active-key");
    }
    if (event.key === "ArrowRight") {
        noBtnEl.classList.remove("active-key");
    }
});