const recognizer = speechCommands.create('BROWSER_FFT');

// Array of symbols corresponding to voice commands
const symbols = [
    { command: 'up', icon: '⬆️' },
    { command: 'down', icon: '⬇️' },
    { command: 'left', icon: '⬅️' },
    { command: 'right', icon: '➡️' },
    { command: 'one', icon: '1️⃣' },
    { command: 'two', icon: '2️⃣' },
    { command: 'three', icon: '3️⃣' },
    { command: 'four', icon: '4️⃣' },
    { command: 'five', icon: '5️⃣' },
    { command: 'six', icon: '6️⃣' },
    { command: 'seven', icon: '7️⃣' },
    { command: 'eight', icon: '8️⃣' },
    { command: 'nine', icon: '9️⃣' },
    { command: 'zero', icon: '0️⃣' },
    { command: 'yes', icon: '✔️' },
    { command: 'no', icon: '❌' },
    { command: 'go', icon: '🏁' },
    { command: 'stop', icon: '🛑' }
];

let currentSymbolIndex = 0; // Index to keep track of current symbol
let hintTimer, revealTimer; // Timers for hint and reveal

function displaySymbol() {
    // Update the symbol on the screen
    document.getElementById('symbol').innerText = symbols[currentSymbolIndex].icon;

    // Reset timers whenever a new symbol is shown
    clearTimeout(hintTimer);
    clearTimeout(revealTimer);

    // Start the hint timer (5 seconds for hint)
    hintTimer = setTimeout(showHint, 5000); 

    // Start the answer reveal timer (15 seconds for revealing the answer)
    revealTimer = setTimeout(revealAnswer, 10000);
}

function showHint() {
    const feedback = document.getElementById('feedback');
    feedback.innerText = `Hint: The command starts with "${symbols[currentSymbolIndex].command.charAt(0)}"`;
    feedback.style.color = "#FFEB3B"; // Bright yellow for the hint
}

function revealAnswer() {
    const feedback = document.getElementById('feedback');
    feedback.innerText = `The correct answer was "${symbols[currentSymbolIndex].command}"!`;
    feedback.style.color = "#FF5722"; // Orange for the reveal
    setTimeout(nextSymbol, 2000); // Move to the next symbol after 2 seconds
}

function giveFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    clearTimeout(hintTimer); // Cancel hint when they answer
    clearTimeout(revealTimer); // Cancel reveal when they answer

    if (isCorrect) {
        feedback.innerText = "That's correct! 🎉";
        feedback.style.color = "#4CAF50";
        feedback.style.fontSize = "30px";
        setTimeout(nextSymbol, 1500); // Move to next symbol after 1.5 seconds
    } else {
        feedback.innerText = "Try again!";
        feedback.style.color = "#F44336";
        feedback.style.fontSize = "28px";
    }
}

function nextSymbol() {
    // Move to the next symbol in the array
    currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
    displaySymbol();
}

function checkCommand(command) {
    if (command === symbols[currentSymbolIndex].command) {
        giveFeedback(true);
    } else {
        giveFeedback(false);
    }
}

async function init() {
    await recognizer.ensureModelLoaded();
    displaySymbol(); // Display the initial symbol

    document.getElementById('start').addEventListener('click', () => {
        recognizer.listen(result => {
            const scores = result.scores;
            const commands = recognizer.wordLabels();
            const command = commands[scores.indexOf(Math.max(...scores))];
            document.getElementById('command').innerText = `Recognized Answer: ${command}`;

            checkCommand(command); // Check if the recognized command matches the current symbol
        }, { probabilityThreshold: 0.75 });
    });
}

init();
