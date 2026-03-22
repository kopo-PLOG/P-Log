document.addEventListener("keydown", (e) => {

    const flag = document.getElementById("flag");
    const memorizing = document.getElementById("memorizing");
    const quiz = document.getElementById("quiz");
    const exit = document.getElementById("exit")

    if(e.key === "ArrowRight"){
        if(flag.classList.contains("game_check")){
            flag.classList.remove("game_check");
            flag.firstElementChild.innerHTML = "";
            memorizing.classList.add("game_check");
            memorizing.firstElementChild.innerHTML="▶"
        }else if(memorizing.classList.contains("game_check")){
            memorizing.classList.remove("game_check");
            memorizing.firstElementChild.innerHTML = "";
            quiz.classList.add("game_check")
            quiz.firstElementChild.innerHTML="▶"
        }else if(quiz.classList.contains("game_check")){
            quiz.classList.remove("game_check");
            quiz.firstElementChild.innerHTML = "";
            exit.classList.add("game_check");
            exit.firstElementChild.innerHTML="▶";
        }
        else if(exit.classList.contains("game_check")){
            exit.classList.remove("game_check");
            exit.firstElementChild.innerHTML = "";
            flag.classList.add("game_check");
            flag.firstElementChild.innerHTML="▶";
        }
    }else if(e.key === "ArrowLeft"){
        if(flag.classList.contains("game_check")){
            flag.classList.remove("game_check");
            flag.firstElementChild.innerHTML = "";
            exit.classList.add("game_check");
            exit.firstElementChild.innerHTML="▶"
        }else if(memorizing.classList.contains("game_check")){
            memorizing.classList.remove("game_check");
            memorizing.firstElementChild.innerHTML = "";
            flag.classList.add("game_check")
            flag.firstElementChild.innerHTML="▶"
        }else if(quiz.classList.contains("game_check")){
            quiz.classList.remove("game_check");
            quiz.firstElementChild.innerHTML = "";
            memorizing.classList.add("game_check");
            memorizing.firstElementChild.innerHTML="▶";
        }else if(exit.classList.contains("game_check")){
            exit.classList.remove("game_check");
            exit.firstElementChild.innerHTML = "";
            quiz.classList.add("game_check");
            quiz.firstElementChild.innerHTML="▶";
        }
    }else if(e.key === "ArrowDown"){
        const game_check = document.querySelectorAll(".game_check");

        if(game_check[0].id === "flag"){
            location.href = "../flag_game/flag_game.html";
        }else if(game_check[0].id === "memorizing"){
            location.href = "../memorization_game/memorization_game.html";
        }else if(game_check[0].id === "quiz"){
            location.href = "../quiz_game/quiz_game.html";
        }else if(game_check[0].id === "exit"){
            const screen = document.getElementById("screen");
            location.href = "../main/main.html";
        }
    }
})

