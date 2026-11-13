
// Set the quiz time to 10 minutes
var timeLeft = 600;
var timerInterval;
var startTime = Date.now();

// Start the timer

function startTimer() {
    timerInterval = setInterval(function() {
        timeLeft--;

        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;

        document.getElementById("timer").textContent =
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}


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

// Text shown for each correct answer
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

// Check the quiz answers
function submitQuiz() {
    var form = document.getElementById("quizForm");

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

    // Compare each answer with the correct answer
    questions.forEach(function(question, index) {
        var correct = false;

        if (question === "q10") {
            var selectedAnswers = userAnswers[question].sort();
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

        var resultText = document.createElement("p");

        if (correct) {
            resultText.textContent =
                "Question " + (index + 1) + ": Correct";
            resultText.className = "correct";
        } else {
            resultText.textContent =
                "Question " + (index + 1) + ": Incorrect. Correct answer: " +
                correctText[question];
            resultText.className = "incorrect";
        }

        results.appendChild(resultText);
    });

    // Calculate the time used
    var timeSpent = 600 - Math.max(timeLeft, 0);
    var minutesUsed = Math.floor(timeSpent / 60);
    var secondsUsed = timeSpent % 60;

    // Display the final score
    var finalResult = document.createElement("h2");

    if (score >= 6) {
        finalResult.textContent = "You Passed!";
        finalResult.className = "correct";
    } else {
        finalResult.textContent = "You Did Not Pass.";
        finalResult.className = "incorrect";
    }

    results.prepend(finalResult);

    var totalScore = document.createElement("p");
    totalScore.textContent = "Your Score: " + score + " out of 10";
    results.appendChild(totalScore);

    var timeResult = document.createElement("p");
    timeResult.textContent =
        "Time Used: " + minutesUsed + " minutes and " +
        secondsUsed + " seconds";
    results.appendChild(timeResult);

    // Prevent answers from being changed after submission
    form.querySelectorAll("input").forEach(function(item) {
        item.disabled = true;
    });

    form.querySelector('button[type="submit"]').disabled = true;
}

// Submit the quiz
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});

// Reset the quiz and restart the timer
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
        startTime = Date.now();

        document.getElementById("timer").textContent = "10:00";

        startTimer();
    }, 0);
});
