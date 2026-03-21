const state = [
    {
        id: "base",
        src: "./image/indexImg/pico_base.gif",
        alt: "피코 평범 버전",
        time: 10000,
        num: 0
    },
    {
        id: "food",
        src: "./image/indexImg/pico_hungry.gif",
        alt: "피코 배고픈 버전",
        time: 10000,
        num: 2
    },
    {
        id: "toilet",
        src: "./image/indexImg/pico_toilet.gif",
        alt: "피코 화장실 버전",
        time: 10000,
        num: 2
    },
    {
        id: "game",
        src: "./image/indexImg/pico_bored.gif",
        alt: "피코 심심한 버전",
        time: 10000,
        num: 3
    },
    {
        id: "angry",
        src: "./image/indexImg/pico_angry.gif",
        alt: "피코 화난 버전",
        time: 5000,
        num: 4
    },
    {
        id: "clear",
        src : "./image/indexImg/pico_clear.gif",
        alt : "피코 해결 후 버전",
        time : 3000,
        num: 5
    },
    {
        id : "adult",
        src : "./image/indexImg/pico_adult.gif",
        alt : "피코 성장 후 버전",
        time : 5000,
        num: 6
    },
    {
        id : "changing",
        src : "./image/indexImg/pico_changing.gif",
        alt : "피코 변신 버전",
        time : 3000,
        num: 7
    },
    {
        id : "tired",
        src : "./image/indexImg/pico_tired.gif",
        alt : "피코 피곤 버전",
        time : 10000,
        num: 8
    },
    {
        id : "wonder",
        src : "./image/indexImg/pico_wonder.jpg",
        alt : "피코 물음표 버전",
        time : 2000,
        num: 9
    }
]

const health = [
    {
        id : "heart_1",
        src : "./image/indexImg/heart_1.png",
        alt : "heart_1"
    },
    {
        id : "heart_2",
        src : "./image/indexImg/heart_2.png",
        alt : "heart_2"
    },
    {
        id : "heart_3",
        src : "./image/indexImg/heart_3.png",
        alt : "heart_3"
    },
    {
        id : "heart_4",
        src : "./image/indexImg/heart_4.png",
        alt : "heart_4"
    },
    {
        id : "heart_5",
        src : "./image/indexImg/heart_5.png",
        alt : "heart_5"
    }
]

const level = [
    {
        id : "gage_1",
        src : "./image/indexImg/gage_1.png",
        alt : "gage_1"
    },
    {
        id : "gage_2",
        src : "./image/indexImg/gage_2.png",
        alt : "gage_2"
    },
    {
        id : "gage_3",
        src : "./image/indexImg/gage_3.png",
        alt : "gage_3"
    },
    {
        id : "gage_4",
        src : "./image/indexImg/gage_4.png",
        alt : "gage_4"
    },
    {
        id : "gage_5",
        src : "./image/indexImg/gage_5.png",
        alt : "gage_5"
    },
]

////////////////기본 게이지 설정 /////////////////

//level 게이지 최대 : 120
//10 단위로 +/-
let currentLevel = localStorage.getItem("level");
if(currentLevel ==  null){
    localStorage.setItem("level", 0);
}

//health 게이지 최대 : 160
//10 단위로 +/-
let currentHealth = localStorage.getItem("health");
if(currentHealth ==  null){
    localStorage.setItem("health", 80);
}


///////////////////     전환      //////////////////////////

//전에 행동과 중복되는 걸 방지하기 위해 저장
let lastState = 1;
localStorage.setItem("lastState", lastState);

const main = document.getElementById("mainImg");
let randomState = 0;
let angryTimer = null;
let baseTimer = null;
let wonderTimer = null;

//중복 방지 flag값
let wrongState = 0;
let rightState = 0;

//현재가 요구사항이 있는 상황인지 아닌지 저장
let currentState = "";

const levelNum = parseInt(localStorage.getItem("level"));

////start
if(levelNum != 120){
    startBase();
}

drawHealth();
drawLevel()


//health 게이지 
function drawHealth(){

    const healthGage = parseInt(localStorage.getItem("health"));
    console.log("drawHealth");
    const heart1 = document.getElementById("heart1");
    const heart2 = document.getElementById("heart2");
    const heart3 = document.getElementById("heart3");
    const heart4 = document.getElementById("heart4");

    let s = "";

    if(healthGage % 40 === 10){
        s = health[1].src;
    }else if(healthGage % 40 === 20){
        s = health[2].src
    }else if(healthGage % 40 === 30){
        s = health[3].src
    }else if(healthGage % 40 === 0){
        s = health[4].src
    }

    if(healthGage > 0 && healthGage <= 40){
        heart1.firstElementChild.src = s;
        heart2.firstElementChild.src = health[0].src;
        heart3.firstElementChild.src = health[0].src;
        heart4.firstElementChild.src = health[0].src;
    }else if(healthGage > 40 && healthGage <= 80){
        heart1.firstElementChild.src = health[4].src;
        heart2.firstElementChild.src = s;
        heart3.firstElementChild.src = health[0].src;
        heart4.firstElementChild.src = health[0].src;
    }else if(healthGage >80 && healthGage <=120){
        heart1.firstElementChild.src = health[4].src;
        heart2.firstElementChild.src = health[4].src;
        heart3.firstElementChild.src = s;
        heart4.firstElementChild.src = health[0].src;
    }else if(healthGage > 120){
        heart1.firstElementChild.src = health[4].src;
        heart2.firstElementChild.src = health[4].src;
        heart3.firstElementChild.src = health[4].src;
        heart4.firstElementChild.src = health[4].src;
    }else if(healthGage === 0){
        heart1.firstElementChild.src = health[0].src;
        heart2.firstElementChild.src = health[0].src;
        heart3.firstElementChild.src = health[0].src;
        heart4.firstElementChild.src = health[0].src;
    }
}

//level 게이지
function drawLevel(){
    const levelGage = parseInt(localStorage.getItem("level"));
    const healthGage = parseInt(localStorage.getItem("health"));
    const gage = document.getElementById("gage").firstElementChild;

    const gageNum = document.getElementById("gageNum").firstElementChild;
    gageNum.innerText = `${levelGage}/120`

    //health + levelGage로 할까말까
    if(levelGage === 120 && healthGage > 40){

        gage.src = level[4].src;
        main.src = state[7].src;

        setTimeout(() => {
            ending();
        }, state[7].time);
    }else if(levelGage === 0){
        gage.src = level[0].src;
    }else if(levelGage > 0 && levelGage <= 30){
        gage.src = level[1].src;
    }else if(levelGage > 30 && levelGage <= 60){
        gage.src = level[2].src
    }else if(levelGage > 60 && levelGage <= 90){
        gage.src = level[3].src;
    }else if(levelGage > 90 && levelGage <= 120){
        gage.src = level[4].src;
    }
}

//평범 피코
function startBase(){

    const gage = parseInt(localStorage.getItem("health"));
    console.log(`statBase() : health = ${gage}`);

    currentState = "normal";

    if(gage <= 40){
        main.src = state[8].src;
    }else{
        main.src = state[0].src;
    }

    wrongState = 0;
    rightState = 0;

    setTimeout(() => {
        //console.log("dkdkdkdkdkdkdk")
        randomEvent();
    }, state[0].time);
}

function randomEvent(){

    // 모든 종류의 타이머를 먼저 초기화
    if(angryTimer) clearTimeout(angryTimer);
    if(baseTimer) clearTimeout(baseTimer);

    while(true){
        randomState = Math.floor(Math.random() * 3) + 1;
        const lastState = parseInt(localStorage.getItem("lastState"));
        console.log(randomState);
        console.log(lastState);
        if(randomState === lastState){
            continue;
        }else{
            localStorage.setItem("lastState", randomState);
            break;
        }
    }
    main.src = state[randomState].src;
    currentState = state[randomState].id
    angryTimer = setTimeout(() => {
        console.log("반응 못함");
        getAngry();
    }, state[randomState].time);

}

//10초동안 반응하지 않았을 때 화냄
function getAngry(){
    console.log("getAngry() 화냄!!");

    main.src = state[4].src;
    
    //반응 못하면 health -10 차감
    if(parseInt(localStorage.getItem("health")) > 0){
        localStorage.setItem("health", parseInt(localStorage.getItem("health")) - 10); 
    }
    
    drawHealth();

    baseTimer = setTimeout(() => {
        startBase();
    }, state[4].time);
}



document.addEventListener("keydown", (e) => {
    const game = document.getElementById("game");
    const toilet = document.getElementById("toilet");
    const food = document.getElementById("food");

    //console.log(e.key);

    //키보드 이벤트
    if(e.key === "ArrowRight"){
        if(toilet.classList.contains("check")){
            toilet.classList.remove("check")
            food.classList.add("check");
        }else if(food.classList.contains("check")){
            food.classList.remove("check");
            game.classList.add("check")
        }else if(game.classList.contains("check")){
            game.classList.remove("check");
            toilet.classList.add("check");
        }
    }else if(e.key === "ArrowLeft"){
        //console.log("좌측");
        if(game.classList.contains("check")){
            game.classList.remove("check");
            food.classList.add("check")
        }else if(food.classList.contains("check")){
            food.classList.remove("check");
            toilet.classList.add("check");
        }else if(toilet.classList.contains("check")){
            toilet.classList.remove("check");
            game.classList.add("check");
        }
    }



    //행동에 대한 키보드 이벤트
    let checkState = document.querySelectorAll(".check");
    console.log("select 이벤트!")
    if(e.key === "ArrowDown"){
        console.log("select 이벤트! ArrowDown")
        console.log(checkState[0].id);
        console.log(state[randomState].id);

        if(currentState === "normal"){
            console.log("wonder!")
            //예약된 setTimeout() 함수 취소
            clearTimeout(angryTimer);
            //clearTimeout(baseTimer);
            angryTimer = null;

            main.src = state[9].src;

            if(wonderTimer) return;

            wonderTimer = setTimeout(() => {
                startBase();
            }, state[5].time);

        }else if(checkState[0].id === state[randomState].id){


            //요구에 맞는 행동 선택
            if(angryTimer){
                console.log("게임 클릭!!! 휴 ");
                //클릭시 health +10
                if(parseInt(localStorage.getItem("health")) < 160){
                    localStorage.setItem("health", parseInt(localStorage.getItem("health")) + 10);
                }

                drawHealth();
                
                //예약된 setTimeout() 함수 취소
                clearTimeout(angryTimer);
                //clearTimeout(baseTimer);
                angryTimer = "";

                main.src = state[5].src;
                if(rightState === 0){
                    rightState = 1;
                    setTimeout(() => {
                    startBase();
                }, state[5].time);
                }
                
            }
        }else{

            // //요구에 잘못된 행동 선택
            console.log("잘못 선택했습니다!!!")
            
            clearTimeout(angryTimer);
            angryTimer = "";
            if(wrongState === 0){
                getAngry();
                wrongState = 1;
            }
            
        }
    }
})


//////////// 엔딩 ///////////////
function ending(){
    main.src = state[6].src;

    setTimeout(() => {

    }, state[6].time);
}