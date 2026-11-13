
// Set the quiz time to 10 minutes
var timeLeft = 600;
var timerInterval;

// Start the timer
function startTimer() {
    timerInterval = setInterval(function() {
        timeLeft--;

        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;

        document.getElementById("timer").textContent =
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        // Submit quiz when time runs out
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

// Start timer when page loads
startTimer();

// Correct answers
var answers = {
    q1: "hypertext markup language",
    q2: "p",
    q3: "a",
    q4: "b",
    q5: "c",
    q6: "a",
    q7: "c",
    q8: "a",
    q9: "b",
    q10: ["header", "nav", "main", "footer"]
};

// Correct answer descriptions
var correctText = {
    q1: "HyperText Markup Language",
    q2: "<p>",
    q3: "To structure webpage content",
    q4: "<h1>",
    q5: "href",
    q6: "<img>",
    q7: "head",
    q8: "The appearance of a webpage",
    q9: "footer",
    q10: "header, nav, main, footer"
};

// Answer choices for multiple-choice questions
var choiceText = {
    q3: {
        a: "To structure webpage content",
        b: "To edit photos",
        c: "To create databases"
    },
    q4: {
        a: "<p>",
        b: "<h1>",
        c: "<img>"
    },
    q5: {
        a: "src",
        b: "alt",
        c: "href"
    },
    q6: {
        a: "<img>",
        b: "<table>",
        c: "<ul>"
    },
    q7: {
        a: "body",
        b: "footer",
        c: "head"
    },
    q8: {
        a: "The appearance of a webpage",
        b: "The internet connection",
        c: "The computer's operating system"
    },
    q9: {
        a: "header",
        b: "footer",
        c: "nav"
    }
};

// Check quiz answers
function submitQuiz() {

    var form = document.getElementById("quizForm");

    // Prevent submitting more than once
    if (form.dataset.submitted === "yes") {
        return;
    }

    clearInterval(timerInterval);
    form.dataset.submitted = "yes";

    var score = 0;
    var results = document.getElementById("results");

    results.innerHTML = "";

    var questions = [
        "q1", "q2", "q3", "q4", "q5",
        "q6", "q7", "q8", "q9", "q10"
    ];

    var userAnswers = {};

    // Collect answers from the form
    questions.forEach(function(question) {

        if (question === "q10") {

            userAnswers[question] = [];

            document.querySelectorAll(
                'input[name="q10"]:checked'
            ).forEach(function(item) {
                userAnswers[question].push(item.value);
            });

        } else if (question === "q1" || question === "q2") {

            userAnswers[question] =
                form.elements[question].value.trim().toLowerCase();

        } else {

            var selected = document.querySelector(
                'input[name="' + question + '"]:checked'
            );

            userAnswers[question] = selected ? selected.value : "";
        }
    });

    // Compare answers and display results
    questions.forEach(function(question, index) {

        var correct = false;

        if (question === "q10") {

            var selectedAnswers = userAnswers[question].slice().sort();
            var rightAnswers = answers[question].slice().sort();

            correct =
                JSON.stringify(selectedAnswers) ===
                JSON.stringify(rightAnswers);

        } else {

            correct = userAnswers[question] === answers[question];

        }

        if (correct) {
            score++;
        }

        // Get the answer selected by the user
        var userAnswer = userAnswers[question];

        if (question === "q10") {

            userAnswer = userAnswer.length > 0 ?
                userAnswer.join(", ") : "No answer";

        } else if (choiceText[question]) {

            userAnswer = choiceText[question][userAnswer] || "No answer";

        } else {

            userAnswer = userAnswer || "No answer";

        }

        // Create the result for each question
        var resultText = document.createElement("p");

        resultText.textContent =
            "Question " + (index + 1) +
            ": " + (correct ? "Correct" : "Incorrect") +
            ". Your answer: " + userAnswer +
            ". Correct answer: " + correctText[question];

        if (correct) {
            resultText.className = "correct";
        } else {
            resultText.className = "incorrect";
        }

        results.appendChild(resultText);
    });

    // Calculate time used
    var timeSpent = 600 - Math.max(timeLeft, 0);
    var minutesUsed = Math.floor(timeSpent / 60);
    var secondsUsed = timeSpent % 60;

    // Display pass or fail
    var finalResult = document.createElement("h2");

    if (score >= 6) {
        finalResult.textContent = "You Passed!";
        finalResult.className = "correct";
    } else {
        finalResult.textContent = "You Did Not Pass.";
        finalResult.className = "incorrect";
    }

    results.prepend(finalResult);

    // Display total score
    var totalScore = document.createElement("p");

    totalScore.textContent = "Your Score: " + score + " out of 10";

    results.appendChild(totalScore);

    // Display time used
    var timeResult = document.createElement("p");

    timeResult.textContent =
        "Time Used: " + minutesUsed +
        " minutes and " + secondsUsed + " seconds";

    results.appendChild(timeResult);

    // Disable answers after submission
    form.querySelectorAll("input").forEach(function(item) {
        item.disabled = true;
    });

    form.querySelector('button[type="submit"]').disabled = true;
}

// Submit the quiz when the button is clicked
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});

// Reset quiz and restart timer
document.getElementById("resetButton").addEventListener("click", function() {

    setTimeout(function() {

        clearInterval(timerInterval);

        var form = document.getElementById("quizForm");

        form.dataset.submitted = "no";

        form.querySelectorAll("input, button").forEach(function(item) {
            item.disabled = false;
        });

        document.getElementById("results").innerHTML = "";

        timeLeft = 600;

        document.getElementById("timer").textContent = "10:00";

        startTimer();

    }, 0);
});
