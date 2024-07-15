import questions from "./data.js";
import Quiz from "./quiz.js";

const quiz = new Quiz({
    questions,
    ui: {
        timeContent: document.querySelector("#time"),
        questionTitle: document.querySelector("#question"),
        options: document.querySelector("#options"),
        nextQuestion: document.querySelector("#nextQuestion"),
        currentQuestion: document.querySelector("#currentQuestion"),
        totalQuestion: document.querySelector("#totalQuestion"),
        lineBar: document.querySelector("#lineBar"),
        successAnswer: document.querySelector("#successAnswer"),
        wrongAnswer: document.querySelector("#wrongAnswer"),
        noneAnswer: document.querySelector("#noneAnswer"),
        quizContent: document.querySelector("#quizContent"),
        answerContent: document.querySelector("#answerContent"),
        quizElement: document.querySelector("#quiz"),
        start: document.querySelector("#start"),
        refresh: document.querySelector("#refresh")
    }
})

quiz.events();