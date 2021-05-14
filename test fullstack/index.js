// A. problem solving
// 1.Phần tử không trùng nhau

var arr1 = [1, 2, "a"];
var arr2 = [1, 3, "b"];
function unionTrueArray(arr1, arr2) {
  var newArr = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) {
      newArr.push(arr1[i]);
    }
  }
  for (let j = 0; j < arr2.length; j++) {
    if (arr1.indexOf(arr2[j]) === -1) {
      newArr.push(arr2[j]);
    }
  }
  console.log(newArr);
}
unionTrueArray(arr1, arr2);

// 2.ranking list
var array = [
  { name: "Arsenal", point: 99, GD: 45 },
  { name: "Chelsea", point: 75, GD: 39 },
  { name: "Manchester United", point: 60, GD: 29 },
  { name: "Liverpool", point: 88, GD: 39 },
];
array.sort(function (a, b) {
  return b.point - a.point;
});

var rank = 1;
for (var i = 0; i < array.length; i++) {
  // increase rank only if current score less than previous
  if (i > 0 && array[i].point < array[i - 1].point) {
    rank++;
  }
  array[i].rank = rank;
}
console.log(array);

// 2. Code challenge
// fetch(
//   "https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple"
// )
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//     appendData(data.results);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// function appendData(data) {
//   console.log(data[0].category);
//   var mainContainer = document.getElementById("myData");
//   for (var i = 0; i < data.length; i++) {
//     var div = document.createElement("div");

//     div.innerHTML = "Question: " + data.results[i].question;

//     mainContainer.appendChild(div);

//   }
// }
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];
fetch(
  "https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      console.log(formattedQuestion);

      return formattedQuestion;
    });
  })
  .catch((err) => {
    console.error(err);
  });
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});
