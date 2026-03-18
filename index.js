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
        id: "bored",
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

const main = document.getElementById("mainImg");

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
    let randomIndex = 0;
    while(true){
        randomIndex = Math.floor(Math.random() * 3) + 1;
        const lastState = parseInt(localStorage.getItem("lastState"));
        console.log(randomIndex);
        console.log(lastState);
        if(randomIndex != lastState){
            continue;
        }else{
            localStorage.setItem("lastSate", randomIndex);
            break;
        }
    }
    
   
    main.src = state[randomIndex].src;

    setTimeout(() => {
        console.log("반응 못함");
        main.src = state[4].src;
        startBase();
    }, state[randomIndex].time);

}
