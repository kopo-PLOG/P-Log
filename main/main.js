const state = [
    {
        id: "base",
        src: "../image/indexImg/pico_base.gif",
        alt: "피코 평범 버전",
        time: 10000,
        num: 0
    },
    {
        id: "food",
        src: "../image/indexImg/pico_hungry.gif",
        alt: "피코 배고픈 버전",
        time: 10000,
        num: 2
    },
    {
        id: "toilet",
        src: "../image/indexImg/pico_toilet.gif",
        alt: "피코 화장실 버전",
        time: 10000,
        num: 2
    },
    {
        id: "game",
        src: "../image/indexImg/pico_bored.gif",
        alt: "피코 심심한 버전",
        time: 10000,
        num: 3
    },
    {
        id: "angry",
        src: "../image/indexImg/pico_angry.gif",
        alt: "피코 화난 버전",
        time: 5000,
        num: 4
    },
    {
        id: "clear",
        src : "../image/indexImg/pico_clear.gif",
        alt : "피코 해결 후 버전",
        time : 3000,
        num: 5
    },
    {
        id : "adult",
        src : "../image/indexImg/pico_adult.gif",
        alt : "피코 성장 후 버전",
        time : 5000,
        num: 6
    },
    {
        id : "changing",
        src : "../image/indexImg/pico_changing.gif",
        alt : "피코 변신 버전",
        time : 3000,
        num: 7
    },
    {
        id : "tired",
        src : "../image/indexImg/pico_tired.gif",
        alt : "피코 피곤 버전",
        time : 10000,
        num: 8
    },
    {
        id : "wonder",
        src : "../image/indexImg/pico_wonder.jpg",
        alt : "피코 물음표 버전",
        time : 2000,
        num: 9
    }
]

const health = [
    {
        id : "heart_1",
        src : "../image/indexImg/heart_1.png",
        alt : "heart_1"
    },
    {
        id : "heart_2",
        src : "../image/indexImg/heart_2.png",
        alt : "heart_2"
    },
    {
        id : "heart_3",
        src : "../image/indexImg/heart_3.png",
        alt : "heart_3"
    },
    {
        id : "heart_4",
        src : "../image/indexImg/heart_4.png",
        alt : "heart_4"
    },
    {
        id : "heart_5",
        src : "../image/indexImg/heart_5.png",
        alt : "heart_5"
    }
]

const level = [
    {
        id : "gage_1",
        src : "../image/indexImg/gage_1.png",
        alt : "gage_1"
    },
    {
        id : "gage_2",
        src : "../image/indexImg/gage_2.png",
        alt : "gage_2"
    },
    {
        id : "gage_3",
        src : "../image/indexImg/gage_3.png",
        alt : "gage_3"
    },
    {
        id : "gage_4",
        src : "../image/indexImg/gage_4.png",
        alt : "gage_4"
    },
    {
        id : "gage_5",
        src : "../image/indexImg/gage_5.png",
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
let wonderTimer = null;

//중복 방지 flag값
let wrongState = 0;
let rightState = 0;

//현재가 요구사항이 있는 상황인지 아닌지 저장
let currentState = "";

//지금 진화 과정인지 아닌지 확인
let changingState = false;

//키보드 이벤트 막기용 flag
let cantKey = false;

//진화까지 다 끝나면 아예 동작 못하게 막기
let done = false;

const levelNum = parseInt(localStorage.getItem("level"));
const healthNum = parseInt(localStorage.getItem("health"));

////start
if(!(levelNum >= 120 && healthNum > 40)){
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
    if(levelGage >= 120 && healthGage > 40){

        //진화하는 과정중 표시
        cantKey = true;

        gage.src = level[4].src;
        main.src = state[7].src;

        setTimeout(() => {
            clearTimeout(angryTimer);
            const second = document.getElementById("second");
            changingState = true;
            second.innerHTML = `<div id="select_area">
                        <div id="select_text"><span>피코에게 무슨 변화가 일어나는 것 같습니다!</span></div>
                        <div id="select_select">
                            <span>▶진행하기</span>
                        </div>
                    </div>`

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
        console.log("탈진")
        main.src = state[8].src;
    }else{
        console.log("탈진")
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
        angryTimer = 0;
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

    setTimeout(() => {
        startBase();
    }, state[4].time);
}


document.addEventListener("keydown", (e) => {

    if(!changingState && !done && !cantKey){
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
        }else if(e.key === "ArrowDown"){
            let checkState = document.querySelectorAll(".check");
            console.log("select 이벤트!")

            if(rightState == 1 | wrongState == 1 || wonderTimer) return;

            
            console.log("select 이벤트! ArrowDown")

            console.log(checkState[0].id);
            console.log(state[randomState].id);
            console.log(currentState);

            
            if(currentState === "normal" && checkState[0].id != "game"){
                console.log("wonder!")
                if(wonderTimer) return;
                //예약된 setTimeout() 함수 취소
                clearTimeout(angryTimer);
                //clearTimeout(baseTimer);
                angryTimer = null;

                main.src = state[9].src;

                wonderTimer = setTimeout(() => {
                    wonderTimer = null;
                    startBase();
                }, state[9].time);

            }else if(currentState === "normal" && checkState[0].id === "game"){
                console.log("game");
                
                location.href = "../game_list/game_list.html"

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
                    
                    rightState = 1;

                    
                    setTimeout(() => {
                        if(checkState[0].id === "game"){
                            location.href = "../game_list/game_list.html"
                        }else{
                            startBase();
                        }
                    }, state[5].time);
                    
                    
                }
            }else{

                // //요구에 잘못된 행동 선택
                console.log("잘못 선택했습니다!!!")
                
                clearTimeout(angryTimer);
                angryTimer = "";
                wrongState = 1;
                getAngry();
            }
        }
    }else if(changingState && !done && e.key === "ArrowDown"){
        const select_select = document.getElementById("select_select");

        select_select.style = "color: red";
        const second = document.getElementById("second");
        setTimeout(() => {
            //console.log("!!!!!!!red!!!!!!!");
            second.innerHTML = `<img src="../image/indexImg/pico_adult.gif" alt="피코 닭 버전">`
            done = true;
            ending();
        }, 300);
    }else if(done){
        // const last_check = document.querySelectorAll(".last_check");
        // const select_yes = document.getElementById("select_yes");
        // const select_no = document.getElementById("select_no");

        if(e.key === "ArrowRight" || e.key === "ArrowLeft"){
            console.log("!!!!!!!!!!!!!!!!!!!!!선태개애애애앵");
            const last_check = document.querySelectorAll(".last_check");
            const select_yes = document.getElementById("select_yes");
            const select_no = document.getElementById("select_no");

            if(last_check[0].id === "select_yes"){
                select_yes.classList.remove("last_check");
                select_yes.firstElementChild.innerText = ""
                select_no.firstElementChild.innerText = "▶"
                select_no.classList.add("last_check");
            }else{
                select_no.classList.remove("last_check");
                select_no.firstElementChild.innerText = ""
                select_yes.firstElementChild.innerText = "▶"
                select_yes.classList.add("last_check");
            }
        }else if(e.key === "ArrowDown"){
            const last_check = document.querySelectorAll(".last_check");
            localStorage.setItem("health", 80);
            localStorage.setItem("level", 0);
            console.log("!!!!!!!!!!!!!!!!!!!!!yese");
            if(last_check[0].id === "select_yes"){
                location.href = "../index.html";
            }else{
                location.href = "ending.html";
            }
        }
    }
})
    

//////////// 엔딩 ///////////////
function ending(){
    
    setTimeout(() => {
        const second = document.getElementById("second");
        changingState = true;
        second.innerHTML = `<div id="select_area">
                        <div id="last_select"><span>피코가 멋있는 닭이 되었습니다! <br> 게임을 다시 하시겠습니까?</span></div>
                        <div id="select_box">
                            <div id="select_yes" class="last_check">
                                <div class="arrowSelect" >▶</div>
                                <div class="answer"><span>예</span></div>
                            </div>
                            <div id="select_no">
                                <div class="arrowSelect"></div>
                                <div class="answer"><span>아니요</span></div>
                            </div>
                        </div>
                        
                    </div>`
    }, state[6].time);
}