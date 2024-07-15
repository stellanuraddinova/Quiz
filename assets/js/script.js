import questions from "./data.js";

const timeContent = document.querySelector("#time");
const questionTitle = document.querySelector("#question");
const options = document.querySelector("#options");
const nextQuestion = document.querySelector("#nextQuestion");
const currentQuestion = document.querySelector("#currentQuestion");
const totalQuestion = document.querySelector("#totalQuestion");
const lineBar = document.querySelector("#lineBar");
const successAnswer = document.querySelector("#successAnswer");
const wrongAnswer = document.querySelector("#wrongAnswer");
const noneAnswer = document.querySelector("#noneAnswer");
const quizContent = document.querySelector("#quizContent");
const answerContent = document.querySelector("#answerContent");
const quizElement = document.querySelector("#quiz");
const start = document.querySelector("#start");
const refresh = document.querySelector("#refresh");

String.prototype.toHtmlEntities = function () {
  return this.replace(/./gm, function (s) {
    return s.match(/[a-z0-9\s]+/i) ? s : "&#" + s.charCodeAt(0) + ";";
  });
};

let startTimeInterval;
let lineBarInterval;

class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.index = 0;
    this.answer = {
      success: 0,
      wrong: 0,
      none: 0,
    };

    this.question = this.getQuestion();

    totalQuestion.innerHTML = this.questions.length;
    currentQuestion.innerHTML = this.index + 1;

    nextQuestion.addEventListener("click", () => {
      this.nextQuestion();
      this.start();
      this.startTime(10);
      this.startLineBar(0);
    });

    this.startTime(10);
    this.startLineBar(0);
  }

  designOption(variant, text) {
    return `
            <div data-variant="${variant}" class="cursor-pointer py-[9px] px-[12px] border rounded-lg"> 
                <b>${variant}.</b> ${text.toHtmlEntities()}
            </div>
        `;
  }

  getQuestion() {
    return this.questions[this.index];
  }

  nextQuestion() {
    if (this.index < this.questions.length - 1) {
      this.index++;
    } else {
      this.finish();
    }
    nextQuestion.classList.add("hidden");
    options.style.pointerEvents = "initial";
    currentQuestion.innerHTML = this.index + 1;
    this.question = this.getQuestion();
  }

  checkVariant(variant, noneCheck = false) {
    const el = options.querySelector(`[data-variant="${variant}"]`);
    options.style.pointerEvents = "none";
    if (this.index + 1 < this.questions.length) {
      nextQuestion.classList.remove("hidden");
    }

    if (
      this.question.current.toString().toLowerCase() ===
      variant.toString().toLowerCase()
    ) {
      el.classList.add("bg-[#D4FFBA]");
      if (!noneCheck) {
        this.answer.success += 1;
      }
    } else {
      el.classList.add("bg-[#FFDEDE]");
      this.answer.wrong += 1;
      const success = options.querySelector(
        `[data-variant="${this.question.current}"]`
      );
      success.classList.add("bg-[#D4FFBA]");
    }
    if (this.index === this.questions.length - 1) {
      this.finish();
    }
  }
  startTime(time) {
    timeContent.textContent = time;
    startTimeInterval = setInterval(timer, 1000);

    const obj = this;

    function timer() {
      time--;
      timeContent.textContent = time;

      if (time < 1) {
        obj.answer.none += 1;
        clearInterval(startTimeInterval);
        obj.checkVariant(obj.question.current, true);
      }
    }
  }

  startLineBar(width) {
    lineBarInterval = setInterval(timer, 100);
    function timer() {
      width += 1;
      lineBar.style.width = width + "%";

      if (width === 100) {
        clearInterval(lineBarInterval);
      }
    }
  }

  start() {
    questionTitle.innerHTML = `<b>${this.index + 1}.</b> ${this.question.text}`;

    options.innerHTML = "";
    for (let option of Object.keys(this.question.options)) {
      options.innerHTML += this.designOption(
        option,
        this.question.options[option]
      );
    }
  }

  finish() {
    quizContent.classList.add("hidden");
    answerContent.classList.remove("hidden");
    successAnswer.textContent = this.answer.success;
    wrongAnswer.textContent = this.answer.wrong;
    noneAnswer.textContent = this.answer.none;
  }
}


start.addEventListener("click", (e) => {
  e.target.parentElement.classList.add("hidden");
  quizElement.classList.remove("hidden");

  const quiz = new Quiz(questions);
  quiz.start();

  options.addEventListener("click", (e) => {
    const variant = e.target.getAttribute("data-variant");

    if (variant) {
      clearInterval(startTimeInterval);
      clearInterval(lineBarInterval);
      quiz.checkVariant(variant);
    }
  });
});
refresh.addEventListener("click", (e) => {
  answerContent.classList.add("hidden");
  quizContent.classList.remove("hidden");
  const quiz = new Quiz(questions);
  quiz.start();

  options.addEventListener("click", (e) => {
    const variant = e.target.getAttribute("data-variant");

    if (variant) {
      clearInterval(startTimeInterval);
      clearInterval(lineBarInterval);
      quiz.checkVariant(variant);
    }
  });
});
