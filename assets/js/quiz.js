String.prototype.toHtmlEntities = function () {
  return this.replace(/./gm, function (s) {
    return s.match(/[a-z0-9\s]+/i) ? s : "&#" + s.charCodeAt(0) + ";";
  });
};
let startTimeInterval;
let lineBarInterval;
let answer = {
  success: 0,
  wrong: 0,
  none: 0,
};
class Quiz {
  constructor({ questions, ui }) {
    this.questions = questions;
    this.ui = ui;

    this.index = 0;

    this.question = this.getQuestion();

    this.ui.totalQuestion.innerHTML = this.questions.length;
    this.ui.currentQuestion.innerHTML = this.index + 1;

    this.startTime(10);
    this.startLineBar(0);
  }
  /*
    Get Question
    -Tek bir sual getirmek ucun ist olunur
  */
  getQuestion() {
    return this.questions[this.index];
  }
  /*
    Create Question Options
    -Sualin cavablarini DOM-da yaratmaq ucun ist olunur
  */
  createOptions(variant, text) {
    return `
            <div data-variant="${variant}" class="cursor-pointer py-[9px] px-[12px] border rounded-lg"> 
                <b>${variant}.</b> ${text.toHtmlEntities()}
            </div>
        `;
  }
  /*
    clear
    -Intervallari temizlemek ucun ist olunur
  */
  clear() {
    clearInterval(startTimeInterval);
    clearInterval(lineBarInterval);
  }
  /*
    clickOptionss
    -Sualin cavablarina klikledikde bas verecek hadiseleri tutmaq ucun ist olunur
  */
  clickOptions() {
    this.ui.options.addEventListener("click", (e) => {
      const variant = e.target.getAttribute("data-variant");

      if (variant) {
        this.clear();
        this.checkVariant(variant);
      }
    });
  }
  /*
    Create Question 
    -DOM-da sual yaratmaq ucun ist olunur
  */
  createQuestion() {
    this.ui.questionTitle.innerHTML = `<b>${this.index + 1}.</b> ${
      this.question.text
    }`;
    this.ui.options.innerHTML = "";
    for (let opt of Object.keys(this.question.options)) {
      options.innerHTML += this.createOptions(opt, this.question.options[opt]);
    }
  }
  /*
    check variant
    -secilen cavabin duzgunluyunu yoxlamaq ucun ist olunur
    @variant - istifadecinin secdiyi variant
    @noneCheck - bu methodun sistem terefinden islendiyini bilmek ucun  ist olunur
  */
  checkVariant(variant, noneCheck = false) {
    const el = options.querySelector(`[data-variant="${variant}"]`);
    this.ui.options.style.pointerEvents = "none";
    if (this.index + 1 < this.questions.length) {
      this.ui.nextQuestion.classList.remove("hidden");
    }

    if (
      this.question.current.toString().toLowerCase() ===
      variant.toString().toLowerCase()
    ) {
      el.classList.add("bg-[#D4FFBA]");
      if (!noneCheck) {
        answer.success += 1;
      }
    } else {
      el.classList.add("bg-[#FFDEDE]");
      answer.wrong += 1;
      const success = options.querySelector(
        `[data-variant="${this.question.current}"]`
      );
      success.classList.add("bg-[#D4FFBA]");
    }
    if (this.index === this.questions.length - 1) {
      this.finish();
    }
  }
  /*
    Next EVent
    -bu method next buttonda event dinleyir
  */
  nextEvent() {
    this.ui.nextQuestion.addEventListener("click", () => {
      this.next();
      this.createQuestion();
      this.startTime(10);
      this.startLineBar(0);
    });
  }
  /*
    Next
    -Novbeti suala kecmek ucun ist olunur
  */
  next() {
    if (this.index < this.questions.length - 1) {
      this.index++;
    }
    this.ui.nextQuestion.classList.add("hidden");
    this.ui.options.style.pointerEvents = "initial";
    this.ui.currentQuestion.innerHTML = this.index + 1;
    this.question = this.getQuestion();
  }
  /*
    startTime
    -Quiz ucun gerisayim basladir
  */
  startTime(time) {
    this.ui.timeContent.textContent = time;
    startTimeInterval = setInterval(timer, 1000);
    const obj = this;

    function timer() {
      time--;
      obj.ui.timeContent.textContent = time;

      if (time < 1) {
        answer.none += 1;
        clearInterval(startTimeInterval);
        obj.checkVariant(obj.question.current, true);
      }
    }
  }
  /*
    Start Linebar
    -vaxta gore line bari isledir
  */
  startLineBar(width) {
    lineBarInterval = setInterval(timer, 100);
    const obj = this;
    function timer() {
      width += 1;
      obj.ui.lineBar.style.width = width + "%";

      if (width === 100) {
        clearInterval(lineBarInterval);
      }
    }
  }
  /*
    Start
    -Quizi baslatmaq ucun ist olunur
  */
  start() {
    this.ui.start.addEventListener("click", (e) => {
      e.target.parentElement.classList.add("hidden");
      this.ui.quizElement.classList.remove("hidden");
      this.createQuestion();
    });
  }
  /*
    Finish
    -Quizi bitirmek ve neticeni gostermek ucun ist olunur
  */
  finish() {
    this.ui.quizContent.classList.add("hidden");
    this.ui.answerContent.classList.remove("hidden");
    this.ui.successAnswer.textContent = this.answer.success;
    this.ui.wrongAnswer.textContent = this.answer.wrong;
    this.ui.noneAnswer.textContent = this.answer.none;
  }
  /*
    Refresh
    -Quizi yeniden baslatmaq ucun ist olunur
  */
  refresh() {
    this.ui.refresh.addEventListener("click", (e) => {
      this.ui.answerContent.classList.add("hidden");
      this.ui.quizContent.classList.remove("hidden");

      answer = {
        success: 0,
        wrong: 0,
        none: 0,
      };
      this.ui.options.style.pointerEvents = "initial";
      this.createQuestion();
    });
  }
  /*
    Events
    -butun eventleri isletmek ucun ist olunur
  */
  events() {
    this.start();
    this.refresh();
    this.clickOptions();
    this.nextEvent();
  }
}

export default Quiz;
