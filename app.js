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

function displaySymbol() {
    // Update the symbol on the screen
    document.getElementById('symbol').innerText = symbols[currentSymbolIndex].icon;
}

function giveFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerText = "That's correct! 🎉";
        feedback.style.color = "#4CAF50";
        feedback.style.fontSize = "30px";
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
        setTimeout(nextSymbol, 1500); // Move to next symbol after 1.5 seconds
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
