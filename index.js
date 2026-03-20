const state = [
    {
        id: "base",
        src: "image/indexImg/pico_base.gif",
        alt: "피코 평범 버전",
        time: 10000
    },
    {
        id: "hungry",
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
        time: 10000
    },
]

////////////////기본 게이지 설정 /////////////////

let currentLevel = localStorage.getItem("level");
if(currentLevel ==  null){
    localStorage.setItem("level", 0);
}

let currentHealth = localStorage.getItem("health");
if(currentHealth ==  null){
    localStorage.setItem("health", 50);
}

let lastState = 1;
localStorage.setItem("lastState", lastState);
///////////////////////////////////////////////////

////////키보드 이벤트//////////

document.addEventListener("keydown", (e) => {
    const game = document.getElementById("game");
    const toilet = document.getElementById("toilet");
    const food = document.getElementById("food");

    console.log(e.key);

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
        console.log("좌측");
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
        console.log("하측");
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
let randomState = 0;
let angryTimer = null;

startBase();

function startBase(){
    console.log("다마고치 쉬고 있음!!!!");

    main.src = state[0].src;

    setTimeout(() => {
        console.log("dkdkdkdkdkdkdk")
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
        if(randomIndex != lastState){
            continue;
        }else{
            localStorage.setItem("lastState", randomState);
            break;
        }
    }
    
   
    main.src = state[randomIndex].src;

    angryTimer = setTimeout(() => {
        console.log("반응 못함");
        getAngry();
    }, state[randomState].time);

}


function getAngry(){
    mainImg.src = state[4].src;
    
}

document.addEventListener("keydown", (e) => {
    let checkState = document.querySelectorAll(".check");
    if(e.key === "ArrowDown"){
        if(checkState[0].id === "game" && state[randomState].id == "bored"){
            if(angryTimer){
                console.log("게임 클릭!!! 휴 ");
                clearTimeout(angryTimer);
                angryTimer = "";
            }
        }else if(checkState[0].id === sta)
    }
})