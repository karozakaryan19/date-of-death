const modal = document.querySelector(".modal");
const loading = document.querySelector(".loader-spinner");
const dateDeath = document.querySelector(".date_death");
const selectDay = document.querySelector("#selectDay");
const selectYear = document.querySelector("#selectYear");
const formAnswers = document.querySelectorAll(".form__answers");
const selectMonth = document.querySelector("#selectMonth");
const questionStep = document.querySelector(".question_step");
const modalWrapper = document.querySelector(".modal__wrapper");
const formAnswersBtn = document.querySelectorAll(".form__answers__btn");

let formValues = {};

const fakeTitles = [
  {
    title: "Уже совсем скоро Вы узнаете много интересного о своем будущем!",
    question: "УКАЖИТЕ СВОЮ ДАТУ РОЖДЕНИЯ:",
  },
  {
    title:
      "Смерть родного человека – одно из тяжелейших испытаний в жизни каждого из нас!",
    question: "Снятся ли Вам умершие люди?",
  },
  {
    title: "",
    question:
      "ЗАПИСЬ, КОТОРУЮ ВЫ УСЛЫШИТЕ, МОЖЕТ ШОКИРОВАТЬ ЛЮДЕЙ С НЕОКРЕПШЕЙ ПСИХИКОЙ. ВЫ ГОТОВЫ УЗНАТЬ, ЧТО ЖДЕТ ИМЕННО ВАС?",
  },
];

const fakeMassage = {
  junior:
    "По вам скучает очень близкий человек, которого больше нет в мире живых.",
  middle:
    "По вам скучает очень близкий человек, которого больше нет в мире живых. Возможно это дедушка или бабушка.",
  senior:
    "По вам скучает очень близкий человек, которого больше нет в мире живых. Возможно это кто-то из Ваших родителей.",
};

const arrYear = Array.from({ length: 72 }, (_, i) => i + 1932);
const arrDayes = Array.from({ length: 31 }, (_, i) => i + 1);
const arrMount = Array.from({ length: 12 }, (_, i) => i + 1);
const loadingItems = Array.from({ length: 12 }, (_, i) => i);

const goToNextStep = (e) => {
  e.preventDefault();
  const activeStep = Number(
    document.querySelector(".form__answers_active").getAttribute("data-step") ||
      0
  );
  if (activeStep === 0) {
    formValues.question_1 = e.target.innerText;
  }

  if (activeStep === 1) {
    let selectDay = document.getElementById("selectDay");
    let day = Number(selectDay.options[selectDay.selectedIndex].text);
    if (!day) {
      document.getElementById("selectDay").style.border = "1px solid red";
      return;
    }

    let selectMonth = document.getElementById("selectMonth");
    let month = Number(selectMonth.options[selectMonth.selectedIndex].text);
    if (!month) {
      document.getElementById("selectMonth").style.border = "1px solid red";
      return;
    }

    let selectYear = document.getElementById("selectYear");
    let year = Number(selectYear.options[selectYear.selectedIndex].text);
    if (!year) {
      document.getElementById("selectYear").style.border = "1px solid red";
      return;
    }

    formValues = {
      ...formValues,
      day,
      month,
      year,
    };

    const loader = document.querySelector(".loader");
    loader.style.display = "flex";
    setTimeout(() => {
      loader.style.display = "none";
    }, 3000);
  }

  if (activeStep === 2) {
    formValues = {
      ...formValues,
      question_2: e.target.innerText,
    };

    const { year } = formValues;
    myYear = new Date().getFullYear() - year;

    const tooltip = document.querySelector(".question_step__head__tooltip");
    tooltip.style.display = "block";

    if (myYear <= 35) {
      document.querySelector(".question_step__head__tooltip__text").innerText =
        fakeMassage.junior;
    } else if (myYear > 35 && myYear < 46) {
      document.querySelector(".question_step__head__tooltip__text").innerText =
        fakeMassage.middle;
    } else if (myYear >= 46) {
      document.querySelector(".question_step__head__tooltip__text").innerText =
        fakeMassage.senior;
    }

    const headerText = document.querySelector(".question_step__head__text");
    headerText.style.display = "none";
  }

  if (activeStep === 3) {
    const recorting = document.querySelector(".recorting");
    recorting.style.display = "block";
    setTimeout(() => {
      recorting.style.display = "none";
      questionStep.style.display = "none";
      dateDeath.style.display = "flex";
    }, 3000);

    formValues = {
      ...formValues,
      question_3: e.target.innerText,
    };
  }

  formAnswers[activeStep].classList.remove("form__answers_active");

  document.querySelector(".question_step__head__text").innerText =
    fakeTitles[activeStep]?.title;

  document.querySelector(".form__question").innerText =
    fakeTitles[activeStep]?.question;

  formAnswers[activeStep + 1]?.classList.add("form__answers_active");
  document.querySelector(".active-step").innerText = activeStep + 3;
};

document.querySelectorAll(".form__answers__btn").forEach((el) => {
  el.addEventListener("click", (e) => {
    goToNextStep(e);
  });

  loadingItems.map((_) => {
    const div = document.createElement("div");
    loading.appendChild(div);
  });

  arrDayes.map((item) => {
    const options = document.createElement("option");
    if (item <= 9) {
      options.innerHTML = `0${item}`;
    } else {
      options.innerHTML = item;
    }
    selectDay.appendChild(options);
  });

  arrMount.map((item) => {
    const options = document.createElement("option");
    if (item <= 9) {
      options.innerHTML = `0${item}`;
    } else {
      options.innerHTML = item;
    }
    selectMonth.appendChild(options);
  });

  arrYear.map((item) => {
    const options = document.createElement("option");
    options.innerHTML = item;
    selectYear.appendChild(options);
  });
});

document.querySelectorAll(".form__answers__select").forEach((el, i) => {
  el.addEventListener("change", (e) => {
    e.target.style.border = "none";
  });
});

document.querySelector(".callbtn").addEventListener("click", async () => {
  try {
    const data = await fetch("https://swapi.dev/api/people/1/").then((res) =>
      res.json()
    );
    modal.style.display = "flex";

    Object.keys(data).forEach((item) => {
      const value = data[item];
      if (typeof value === "string") {
        const p = document.createElement("p");
        const div = document.createElement("div");
        const span = document.createElement("span");

        p.innerText = `${item}:`;
        span.innerText = value;
        div.appendChild(p);
        div.appendChild(span);
        div.classList.add("modal__item");
        dateDeath.style.display = "none";
        modalWrapper.appendChild(div);
      }
    });
    console.log(data, "response");
  } catch (error) {
    alert(error);
  }
});
