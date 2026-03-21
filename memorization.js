const arrowDisplay = document.getElementById("arrow-display");
const roundText = document.getElementById("round");
const scoreText = document.getElementById("score");
const resultMessage = document.getElementById("result-message");
const startBtn = document.getElementById("start-btn");

let totalRound = 10;
let currentRound = 0;
let score = 0;
let currentAnswer = "";
let gameStarted = false;
let gameEnded = false;

// 화살표 랜덤 생성
function showRandomArrow() {
    const random = Math.random() < 0.5 ? "left" : "right";

    currentAnswer = random;

    if (random === "left") {
        arrowDisplay.textContent = "←";
    } else {
        arrowDisplay.textContent = "→";
    }
}

// 게임 시작
function startGame() {
    currentRound = 0;
    score = 0;
    gameStarted = true;
    gameEnded = false;

    scoreText.textContent = score;
    roundText.textContent = totalRound;
    resultMessage.textContent = "";
    startBtn.disabled = true;

    showRandomArrow();
}

// 게임 종료
function endGame() {
    gameEnded = true;
    gameStarted = false;
    arrowDisplay.textContent = "-";
    startBtn.disabled = false;

    if (score >= 7) {
        resultMessage.textContent = "성공! 게이지 +1";
        
        // 여기에 메인화면 게이지 증가 처리 추가
        // 예: localStorage.setItem("gauge", 1);
    } else {
        resultMessage.textContent = "실패! 다시 도전하세요";
    }
}

// 사용자 입력 처리
function checkAnswer(userInput) {
    if (!gameStarted || gameEnded) return;

    if (userInput === currentAnswer) {
        score++;
        scoreText.textContent = score;
    }

    currentRound++;
    roundText.textContent = totalRound - currentRound;

    if (currentRound >= totalRound) {
        endGame();
    } else {
        showRandomArrow();
    }
}

// 방향키 입력
document.addEventListener("keydown", function(event) {
    if (!gameStarted || gameEnded) return;

    if (event.key === "ArrowLeft") {
        checkAnswer("left");
    } else if (event.key === "ArrowRight") {
        checkAnswer("right");
    }
});

// 시작 버튼
startBtn.addEventListener("click", startGame);