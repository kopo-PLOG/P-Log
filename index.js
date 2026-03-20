const state = [
    {
        id: "base",
        src: "image/indexImg/pico_base.gif",
        alt: "피코 평범 버전",
        time: 10000
    },
    {
        id: "food",
        src: "image/indexImg/pico_hungry.gif",
        alt: "피코 배고픈 버전",
        time: 10000
    },
    {
        id: "toilet",
        src: "image/indexImg/pico_toilet.gif",
        alt: "피코 화장실 버전",
        time: 10000
    },
    {
        id: "game",
        src: "image/indexImg/pico_bored.gif",
        alt: "피코 심심한 버전",
        time: 10000
    },
    {
        id: "angry",
        src: "image/indexImg/pico_angry.gif",
        alt: "피코 화난 버전",
        time: 5000
    },
    {
        id: "clear",
        src : "image/indexImg/pico_clear.gif",
        alt : "피코 해결 후 버전",
        time : 3000
    },
    {
        id : "adult",
        src : "image/indexImg/pico_adult.gif",
        alt : "피코 성장 후 버전",
        time : 5000
    },
    {
        id : "changing",
        src : "image/indexImg/pico_chaging.gif",
        alt : "피코 변신 버전",
        time : 5000
    },
    {
        id : "tired",
        src : "image/indexImg/pico_tired.gif",
        alt : "피코 피곤 버전",
        time : 5000
    }
]

const health = [
    {
        id : "heart_1",
        src : "image/indexImg/heart_1.png",
        alt : "heart_1"
    },
    {
        id : "heart_2",
        src : "image/indexImg/heart_2.png",
        alt : "heart_2"
    },
    {
        id : "heart_3",
        src : "image/indexImg/heart_3.png",
        alt : "heart_3"
    },
    {
        id : "heart_4",
        src : "image/indexImg/heart_4.png",
        alt : "heart_4"
    },
    {
        id : "heart_5",
        src : "image/indexImg/heart_5.png",
        alt : "heart_5"
    }
]

const level = [
    {
        id : "gage_1",
        src : "image/indexImg/gage_1.png",
        alt : "gage_1"
    },
    {
        id : "gage_2",
        src : "image/indexImg/gage_2.png",
        alt : "gage_2"
    },
    {
        id : "gage_3",
        src : "image/indexImg/gage_3.png",
        alt : "gage_3"
    },
    {
        id : "gage_4",
        src : "image/indexImg/gage_4.png",
        alt : "gage_4"
    },
    {
        id : "gage_5",
        src : "image/indexImg/gage_5.png",
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

let lastState = 1;
localStorage.setItem("lastState", lastState);
///////////////////////////////////////////////////

////////키보드 이벤트//////////

document.addEventListener("keydown", (e) => {
    const game = document.getElementById("game");
    const toilet = document.getElementById("toilet");
    const food = document.getElementById("food");

    //console.log(e.key);

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
    }else if(e.key === "ArrowDown"){
        //console.log("하측");
        if(game.classList.contains("check")){
            console.log("game 선택");
        }else if(toilet.classList.contains("check")){
            console.log("toilet 선택");
        }else if(food.classList.contains("check")){
            console.log("food 선택");
        }
    }
})


///////////////////     전환      //////////////////////////

const main = document.getElementById("mainImg");
let healthGage = parseInt(localStorage.getItem("health"));
let randomState = 0;
let angryTimer = null;

////start
if(healthGage > 80){
    startBase();
}else{
    getTired();
}


drawHealth();
drawLevel()


//health 게이지 
function drawHealth(){
    healthGage = parseInt(localStorage.getItem("health"));
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
        main.src = state[8].src;
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
    const level = parseInt(localStorage.getItem("level"));

    if(level >= 120){
        main.src = state[7].src;

        setTimeout(() => {
            ending();
        }, state[7].time);
    }
}

function startBase(){
    console.log("다마고치 쉬고 있음!!!!");

    main.src = state[0].src;

    setTimeout(() => {
        //console.log("dkdkdkdkdkdkdk")
        randomEvent();
    }, state[0].time);
}



function randomEvent(){
    //이전 타이머가 돌고 있다면 청소
    if(angryTimer) clearTimeout(angryTimer);

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

    angryTimer = setTimeout(() => {
        console.log("반응 못함");
        getAngry();
    }, state[randomState].time);

}

//10초동안 반응하지 않았을 때 화냄
function getAngry(){
    main.src = state[4].src;
    
    //반응 못하면 health -10 차감
    if(parseInt(localStorage.getItem("health")) > 0){
        localStorage.setItem("health", parseInt(localStorage.getItem("health")) - 10); 
    }
    
    drawHealth();

    setTimeout(() => {
        if(parseInt(localStorage.getItem("health")) <= 40){
            getTired();
        }else{
            startBase();
        }
    }, state[4].time);
}

function getTired(){
    main.src = state[8].src;

    setTimeout(() => {
        //console.log("dkdkdkdkdkdkdk")
        randomEvent();
    }, state[0].time);
}

document.addEventListener("keydown", (e) => {
    let checkState = document.querySelectorAll(".check");
    console.log("select 이벤트!")
    if(e.key === "ArrowDown"){
        console.log("select 이벤트! ArrowDown")
        console.log(checkState[0].id);
        console.log(state[randomState].id)
        if(checkState[0].id === state[randomState].id){
            if(angryTimer){
                console.log("게임 클릭!!! 휴 ");
                //클릭시 health +10
                if(parseInt(localStorage.getItem("health")) < 160){
                    localStorage.setItem("health", parseInt(localStorage.getItem("health")) + 10);
                }
                drawHealth();
                clearTimeout(angryTimer);
                angryTimer = "";
                main.src = state[5].src;
                setTimeout(() => {
                    if(parseInt(localStorage.getItem("health")) <= 40){
                        getTired();
                    }else{
                        startBase();
                    }
                    
                }, state[5].time);
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