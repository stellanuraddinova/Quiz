import questions from "./data.js";

const timeContent = document.querySelector("#time");
const questionTitle = document.querySelector("#question");
const options = document.querySelector("#options");
const nextQuestion = document.querySelector("#nextQuestion");
const currentQuestion = document.querySelector("#currentQuestion");
const totalQuestion = document.querySelector("#totalQuestion");
const lineBar = document.querySelector("#lineBar");

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
    this.question = this.getQuestion();

    totalQuestion.innerHTML = this.questions.length;
    currentQuestion.innerHTML = this.index + 1;

    nextQuestion.addEventListener("click", () => {
      this.nextQuestion();
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
      console.log("Oyun Bitdi");
    }
    nextQuestion.classList.add("hidden");
    options.style.pointerEvents = "initial";
    currentQuestion.innerHTML = this.index + 1;
    this.question = this.getQuestion();
    this.start();
    this.startTime(10);
    this.startLineBar(0);
  }

  checkVariant(variant) {
    const el = options.querySelector(`[data-variant="${variant}"]`);
    options.style.pointerEvents = "none";
    nextQuestion.classList.remove("hidden");
    if (
      this.question.current.toString().toLowerCase() ===
      variant.toString().toLowerCase()
    ) {
      el.classList.add("bg-[#D4FFBA]");
    } else {
      el.classList.add("bg-[#FFDEDE]");
      const success = options.querySelector(`[data-variant="${this.question.current}"]`);   
      success.classList.add("bg-[#D4FFBA]");
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
        clearInterval(startTimeInterval);
        obj.checkVariant(obj.question.current);
      }
    }
  }

  startLineBar(width) {
    lineBarInterval = setInterval(timer, 100);
    const obj = this;
    function timer() {
      width += 1;
      lineBar.style.width = width + '%';

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

    options.addEventListener("click", (e) => {
      const variant = e.target.getAttribute("data-variant");

      if (variant) {
        clearInterval(startTimeInterval);
        clearInterval(lineBarInterval);
        this.checkVariant(variant);
      }
    });
  }
}

const quiz = new Quiz(questions);

quiz.start();
