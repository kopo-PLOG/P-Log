// 1. 난이도별 문제 데이터 준비
const allQuestions = {
    easy: [
        { q: "문제 1: 1 + 1 은?", options: ["1", "2", "3", "4"], ans: 1 },
        { q: "문제 2: 강아지가 내는 소리는?", options: ["야옹", "멍멍", "짹짹", "음매"], ans: 1 },
        { q: "문제 3: 바나나의 기본 색깔은?", options: ["빨강", "파랑", "노랑", "검정"], ans: 2 },
        { q: "문제 4: 대한민국의 수도는?", options: ["서울", "부산", "인천", "대전"], ans: 0 },
        { q: "문제 5: 여름에 주로 먹는 큰 과일은?", options: ["귤", "수박", "딸기", "사과"], ans: 1 },
        { q: "문제 6: 밤하늘에 없는 것은?", options: ["달", "해", "구름", "별"], ans: 1 },
        { q: "문제 7: 얼음이 녹으면 무엇이 되나요?", options: ["돌", "흙", "불", "물"], ans: 3 },
        { q: "문제 8: 다음 중 날 수 있는 동물은?", options: ["개", "고양이", "새", "거북이"], ans: 2 },
        { q: "문제 9: 병원에서 일하는 사람은?", options: ["의사", "교사", "경찰", "소방관"], ans: 0 },
        { q: "문제 10: 한 손의 손가락은 몇 개인가요?", options: ["3개", "4개", "5개", "6개"], ans: 2 }
    ],
    medium: [
        { q: "문제 1: 광명융합기술교육원의 위치는?", options: ["수원", "인천", "광주", "광명"], ans: 3 },
        { q: "문제 2: 웹 페이지의 뼈대를 구성하는 언어는?", options: ["CSS", "HTML", "JS", "JAVA"], ans: 1 },
        { q: "문제 3: 빛의 삼원색이 아닌 것은?", options: ["빨강", "노랑", "초록", "파랑"], ans: 1 },
        { q: "문제 4: 대한민국의 국화(나라꽃)는?", options: ["벚꽃", "장미", "무궁화", "들국화"], ans: 2 },
        { q: "문제 5: 1년은 대략 몇 주인가?", options: ["48주", "50주", "52주", "54주"], ans: 2 },
        { q: "문제 6: 태양계에서 가장 큰 행성은?", options: ["지구", "화성", "목성", "토성"], ans: 2 },
        { q: "문제 7: 물의 화학식은?", options: ["H2O", "CO2", "O2", "NaCl"], ans: 0 },
        { q: "문제 8: 한글을 창제한 왕은?", options: ["태조", "세종대왕", "영조", "정조"], ans: 1 },
        { q: "문제 9: 한반도에서 가장 높은 산은?", options: ["지리산", "한라산", "백두산", "설악산"], ans: 2 },
        { q: "문제 10: 10 + 15 * 2 의 값은?", options: ["40", "50", "25", "35"], ans: 0 }
    ],
    hard: [
        { q: "문제 1: HTML의 줄바꿈 태그는?", options: ["br", "hr", "p", "div"], ans: 0 },
        { q: "문제 2: 파이썬의 함수 선언 키워드는?", options: ["var", "let", "def", "fun"], ans: 2 },
        { q: "문제 3: OSI 1계층의 이름은?", options: ["물리", "링크", "망", "전송"], ans: 0 },
        { q: "문제 4: 브라우저 탭 종료 시 초기화되는 것은?", options: ["로컬", "세션", "쿠키", "캐시"], ans: 1 },
        { q: "문제 5: NoSQL 데이터베이스인 것은?", options: ["오라클", "몽고DB", "마리아", "레디스"], ans: 1 },
        { q: "문제 6: 2진수 1010을 10진수로 변환하면?", options: ["8", "10", "12", "14"], ans: 1 },
        { q: "문제 7: HTTP 상태 코드 'Not Found'는?", options: ["200", "403", "404", "500"], ans: 2 },
        { q: "문제 8: 객체 생성을 담당하는 디자인 패턴은?", options: ["싱글톤", "옵저버", "팩토리", "전략"], ans: 2 },
        { q: "문제 9: 리눅스에서 현재 경로를 확인하는 명령어는?", options: ["ls", "cd", "pwd", "rm"], ans: 2 },
        { q: "문제 10: 자바스크립트의 약자는?", options: ["JS", "JC", "JB", "JA"], ans: 0 }
    ]
};

// 상태 관리 변수
let currentQuestions = []; // 현재 선택된 난이도의 문제 배열을 담을 변수
let currentQuestionIndex = 0; 
let currentSelectionIndex = 0; 
let score = 0; 
let isAnimating = false; 
let isGameOver = false;
let isGameStarted = false;

// 난이도 관련 변수
let currentDiffIndex = 0; 
const diffLevels = ['easy', 'medium', 'hard'];

// DOM 요소 가져오기
const diffScreen = document.getElementById('difficulty-screen');
const quizScreen = document.getElementById('quiz-screen');
const text1 = document.getElementById('text1');
const screenEl = document.getElementById('screen'); 
const qts = [
    document.getElementById('qt1'),
    document.getElementById('qt2'),
    document.getElementById('qt3'),
    document.getElementById('qt4')
];
const characterImg = document.querySelector('#second img');
const diffButtons = document.querySelectorAll('.diff-btn');

// 난이도 선택 버튼 UI 업데이트
function updateDiffSelectionUI() {
    diffButtons.forEach((btn, index) => {
        if (index === currentDiffIndex) {
            btn.style.backgroundColor = 'lightblue';
        } else {
            btn.style.backgroundColor = 'white';
        }
    });
}

// 화면이 처음 로드될 때 난이도 버튼 초기화
updateDiffSelectionUI();

// 게임 시작 함수
function startGame(vel) {
    currentQuestions = allQuestions[vel]; // 선택된 난이도의 배열로 설정

    diffScreen.style.display = "none";
    quizScreen.style.display = "flex";

    currentQuestionIndex = 0;
    score = 0;
    isGameOver = false;
    isGameStarted = true;

    loadQuestion();
}

// 화면에 문제 렌더링 함수
function loadQuestion() {
    const currentQ = currentQuestions[currentQuestionIndex]; // currentQuestions 사용 통일
    text1.innerHTML = currentQ.q;
    
    qts.forEach((qt, index) => {
        qt.style.display = 'block'; 
        qt.innerText = currentQ.options[index];
    });
    
    currentSelectionIndex = 0; 
    updateSelectionUI();
    characterImg.src = 'image/삐코_물음표.jpg';
    characterImg.classList.remove('shrink-image');

    screenEl.classList.remove('blink-blue', 'blink-red'); 

    isAnimating = false; 
}

// 선택지 배경색 업데이트 함수
function updateSelectionUI() {
    qts.forEach((qt, index) => {
        if (index === currentSelectionIndex) {
            qt.style.backgroundColor = 'lightblue';
        } else {
            qt.style.backgroundColor = 'white'; 
        }
    });
}

// 키보드 이벤트 처리
document.addEventListener('keydown', (e) => {
    if (isAnimating) return; 

    // [1. 난이도 선택 화면일 때]
    if (!isGameStarted) {
        if (e.key === 'ArrowLeft') {
            currentDiffIndex = (currentDiffIndex - 1 + 3) % 3;
            updateDiffSelectionUI();
        } else if (e.key === 'ArrowRight') {
            currentDiffIndex = (currentDiffIndex + 1) % 3;
            updateDiffSelectionUI();
        } else if (e.key === 'ArrowDown') {
            startGame(diffLevels[currentDiffIndex]);
        }
        return; 
    }

    // [2. 게임 종료 상태일 때]
    if (isGameOver) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            currentSelectionIndex = currentSelectionIndex === 0 ? 1 : 0;
            updateSelectionUI();
        } else if (e.key === 'ArrowDown') {
            if (currentSelectionIndex === 0) {
                // '예' 선택 시: 난이도 선택 화면으로 복귀하도록 수정
                isGameOver = false;
                isGameStarted = false;
                quizScreen.style.display = 'none';
                diffScreen.style.display = 'flex';
                
                currentDiffIndex = 0;
                updateDiffSelectionUI();
            } else {
                // '아니오' 선택 시
                window.location.href = ""; 
            }
        }
        return; 
    }

    // [3. 문제 풀이 중일 때]
    if (e.key === 'ArrowLeft') {
        currentSelectionIndex = (currentSelectionIndex - 1 + 4) % 4;
        updateSelectionUI();
    } else if (e.key === 'ArrowRight') {
        currentSelectionIndex = (currentSelectionIndex + 1) % 4;
        updateSelectionUI();
    } else if (e.key === 'ArrowDown') {
        checkAnswer();
    }
});

// 정답 확인 및 이미지 애니메이션 처리
function checkAnswer() {
    isAnimating = true; 
    const currentQ = currentQuestions[currentQuestionIndex]; // currentQuestions 사용 통일
    
    screenEl.classList.remove('blink-blue', 'blink-red');
    void screenEl.offsetWidth;

    if (currentSelectionIndex === currentQ.ans) {
        score++;
        // 기존 제공해주신 파일명이 .jpg 인지 .png 인지 확인 후 맞춰주세요 (임시로 png로 둠)
        characterImg.src = 'image/삐코_O.png'; 
        characterImg.classList.remove('shrink-image');
        screenEl.classList.add('blink-blue'); 
    } else {
        characterImg.src = 'image/삐코_X.png';
        characterImg.classList.remove('shrink-image');
        screenEl.classList.add('blink-red'); 
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) { // currentQuestions 사용 통일
            loadQuestion();
        } else {
            showEndScreen();
        }
    }, 2000);
}

// 모든 문제를 풀었을 때의 결과 화면
function showEndScreen() {
    isGameOver = true; 
    isAnimating = false; 

    screenEl.classList.remove('blink-blue', 'blink-red');

    text1.innerHTML = `10문제 중 ${score}문제 정답!<br><br>다시 하시겠습니까?`;
    
    if (score >= 7) {
        characterImg.src = 'image/삐코_환호.png';
        characterImg.classList.remove('shrink-image');
    } else {
        characterImg.src = 'image/삐코_머쓱.png';
        characterImg.classList.add('shrink-image'); 
    }

    qts[2].style.display = 'none';
    qts[3].style.display = 'none';

    qts[0].innerText = "예";
    qts[1].innerText = "아니오";

    currentSelectionIndex = 0; 
    updateSelectionUI();
}

// 맨 아래에 있던 loadQuestion() 제거 (난이도 선택 후 실행되도록)