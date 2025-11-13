//giving variables to html elements 
const theQuestion = document.getElementById("question");
const choices = document.getElementById("answer-options");
const nextButton = document.getElementById("nextQuestion");
const box = document.getElementById("quiz-content");

//10 Questions put into the questions object
const questions = {
    1: {
        q: "What is the capital of the Canada?",
        correct: "Ottawa",
        other1: "Washington D.C.",
        other2: "Brasilia",
        other3: "Bogota"
    },
    2: {
        q: "What Argentina's national animal?",
        correct: "Furnarius rufus",
        other1: "Jaguar",
        other2: "Puma",
        other3: "Andean condor"
    },
    3: {
        q: "What is Mexico's national dish?",
        correct: "Mole",
        other1: "Tacos",
        other2: "Enchiladas",
        other3: "Tamales"
    },
    4: {
        q: "What is Peru's official language?",
        correct: "Spanish",
        other1: "English",
        other2: "Quechua",
        other3: "Aymara"
    },
    5: {
        q: "What is the national anthem of Colombia?",
        correct: "Himno Nacional de la República de Colombia",
        other1: "Oh Gloria Inmarcesible",
        other2: "Canto a Colombia",
        other3: "Colombia Tierra Querida"
    },
    6: {
        q: "What is the official language of the United States?",
        correct: "None",
        other1: "English",
        other2: "Spanish",
        other3: "French"
    },
    7: {
        q: "What is Canada's national day?",
        correct: "July 1st",
        other1: "July 4th",
        other2: "May 5th",
        other3: "June 14th"
    },
    8: {
        q: "What is the capital of Colombia?",
        correct: "Bogota",
        other1: "Medellin",
        other2: "Cali",
        other3: "Cartagena"
    },
    9: {
        q: "What is Mexico's national tree?",
        correct: "Montezuma Bald Cypress",
        other1: "Ahuehuete",
        other2: "Oak",
        other3: "Pine"
    },
    10: {
        q: "How many countries are in the Americas?",
        correct: "35",
        other1: "30",
        other2: "40",
        other3: "25"
    }
}

//variable to keep track of their score 
var score = 0;

//variable to keep track of what question the user is on
var questionNum = 1;

//selects all answer choices to use in my functions
var allChoices = choices.querySelectorAll(".buttons");
console.log(allChoices);
//to hide the next button until they choose an answer
nextButton.classList.add("hide");

//function for checking if the answer chosen is correct
function checkAnswer(event){
    //checks to see if the user has already selected an answer so that they cannot answer twice
    var alreadyAnswered = 0;
    for(let i = 0; i < allChoices.length; i++){
        if(allChoices[i].classList.contains("correctAnswer") || allChoices[i].classList.contains("wrongAnswer")){
            alreadyAnswered++;
        }
    }
    if(alreadyAnswered > 0){
        return;
    }

    //gets the text of the button that the user clicked on
    var userAnswer = event.target.innerText;

    //adds the class correctAnswer to the button chosen if it is correct
    if (userAnswer === questions[questionNum].correct){
        event.target.classList.add("correctAnswer");
        console.log(event.target.classList);
        score++;
    }
    //adds the class wrongAnswer to the button chosen if it is wrong
    else{
        event.target.classList.add("wrongAnswer");
    }
    nextButton.classList.remove("hide");      
}

//function for going to the next question
function nextQuestion(){
    //removing the background colors from the answerss and hiding the next button
    for(let i = 0; i < allChoices.length; i++){
        allChoices[i].classList.remove("correctAnswer");
        allChoices[i].classList.remove("wrongAnswer");
    }
    nextButton.classList.add("hide");

    //checks if they are on the last question to calculate their score
    if(questionNum === 10){
        theQuestion.style.display = "none";
        choices.style.display = "none";
        nextButton.classList.add("hide");

        var scoreTitle = document.createElement("h1");
        scoreTitle.innerText = "Your Score:";
        scoreTitle.classList.add("title");
        box.appendChild(scoreTitle);
        var percentage = document.createElement("h2");
        percentage.innerText = score*10 + "%";
        percentage.classList.add("result");
        box.appendChild(percentage);
        var result = document.createElement("h2");
        result.innerText = "You got " + score + " out of 10 questions correct.";
        result.classList.add("result");
        box.appendChild(result);
        return;
    }
    
    //changing the question
    questionNum++;
    theQuestion.innerText = questions[questionNum].q;

    //for assigning a random position for the correct answer
    var answerOptions = "0123";
    var randomNum = Math.floor(Math.random() * 4);
    allChoices[randomNum].innerText = questions[questionNum].correct;

    //going through the answerOptions string to remove the index of where the correct value is
    for(var i = 0; i < answerOptions.length; i++){
        if (parseInt(answerOptions[i]) === randomNum){
            answerOptions = answerOptions.replace(answerOptions[i], "");
        }
    }

    //assigning the other answer choices to the other buttons
    allChoices[parseInt(answerOptions.charAt(0))].innerText = questions[questionNum].other1;
    allChoices[parseInt(answerOptions.charAt(1))].innerText = questions[questionNum].other2;
    allChoices[parseInt(answerOptions.charAt(2))].innerText = questions[questionNum].other3;
}


//event listener for clicking on one of the answer buttons
nextButton.addEventListener("click", nextQuestion);

//checking if user chose an answer
for(let i = 0; i < allChoices.length; i++){
    allChoices[i].addEventListener("click", checkAnswer);
}