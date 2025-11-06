document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // EXPERIMENT 1: ADVANCED DICE ROLLER
    // =========================================
    
    const rollBtn = document.getElementById('roll-btn');
    const resultsArea = document.getElementById('dice-results-area');
    const totalValueSpan = document.getElementById('total-value');
    const averageValueSpan = document.getElementById('average-value');
    const breakdownDiv = document.getElementById('roll-breakdown');

    // Config for all dice types
    const diceTypes = [
        { id: 'd4-count', sides: 4 },
        { id: 'd6-count', sides: 6 },
        { id: 'd8-count', sides: 8 },
        { id: 'd10-count', sides: 10 },
        { id: 'd12-count', sides: 12 },
        { id: 'd20-count', sides: 20 },
        { id: 'd100-count', sides: 100 }
    ];

    // --- NEW: ADD CLICK LISTENERS TO LABELS ---
    // This finds the <label> right before each input and makes it clickable
    diceTypes.forEach(die => {
        const input = document.getElementById(die.id);
        // Find the label immediately preceding the input
        const label = input.previousElementSibling;
        
        if (label && label.tagName === 'LABEL') {
            label.addEventListener('click', () => {
                // Get current value, default to 0 if empty
                let currentValue = parseInt(input.value) || 0;
                // Increment and update
                input.value = currentValue + 1;
            });
        }
    });

    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            let grandTotal = 0;
            let totalAverage = 0; // Track the statistical average
            let breakdownParts = [];

            // 1. Loop through each dice type
            diceTypes.forEach(die => {
                const countInput = document.getElementById(die.id);
                const count = parseInt(countInput.value) || 0;

                if (count > 0) {
                    let currentDiceTotal = 0;
                    let individualRolls = [];

                    // Roll this specific die 'count' times
                    for (let i = 0; i < count; i++) {
                        const roll = Math.floor(Math.random() * die.sides) + 1;
                        individualRolls.push(roll);
                        currentDiceTotal += roll;
                    }

                    grandTotal += currentDiceTotal;

                    // Calculate average for these dice: count * (sides + 1) / 2
                    // e.g., 2d6 avg = 2 * (6+1)/2 = 7
                    totalAverage += count * (die.sides + 1) / 2;

                    // Add to breakdown: "3d6 (4, 1, 6)"
                    breakdownParts.push(`${count}d${die.sides} (${individualRolls.join(', ')})`);
                }
            });

            // 2. Handle Modifier
            const modInput = document.getElementById('roll-modifier');
            const modifier = parseInt(modInput.value) || 0;

            if (modifier !== 0) {
                grandTotal += modifier;
                totalAverage += modifier; // Modifier also adds to the average
                
                const sign = modifier > 0 ? '+' : '';
                breakdownParts.push(`Modifier (${sign}${modifier})`);
            }

            // 3. Display Results
            if (breakdownParts.length === 0) {
                totalValueSpan.innerText = "0";
                averageValueSpan.innerText = "0";
                breakdownDiv.innerText = "Please select at least one die.";
            } else {
                totalValueSpan.innerText = grandTotal;
                // Display average, rounded to 1 decimal place if needed
                // Number.isInteger checks if it has a decimal part
                averageValueSpan.innerText = Number.isInteger(totalAverage) ? totalAverage : totalAverage.toFixed(1);
                
                breakdownDiv.innerText = breakdownParts.join(' + ');
            }
            
            resultsArea.style.display = 'block';

            // Optional: Color crits for d20 ONLY if exactly ONE d20 was rolled
            const d20Count = parseInt(document.getElementById('d20-count').value) || 0;
            if (d20Count === 1 && breakdownParts.length === 1 && modifier === 0) {
                 if (grandTotal === 20) totalValueSpan.style.color = '#28a745';
                 else if (grandTotal === 1) totalValueSpan.style.color = '#dc3545';
                 else totalValueSpan.style.color = '#333';
            } else {
                totalValueSpan.style.color = '#333';
            }

        });
    }

    // =========================================
    // EXPERIMENT 2: REAL-TIME TEXT ANALYSIS
    // =========================================
    const textInput = document.getElementById('text-analysis-input');
    const charCountSpan = document.getElementById('char-count');
    const wordCountSpan = document.getElementById('word-count');
    const sentenceCountSpan = document.getElementById('sentence-count');

    if (textInput) {
        // The 'input' event fires every time the text changes (typing, pasting, deleting)
        textInput.addEventListener('input', () => {
            const text = textInput.value;

            // 1. Character Count (easy!)
            charCountSpan.innerText = text.length;

            // 2. Word Count
            // We trim whitespace from ends, then split by any whitespace character (\s+)
            // We check if text is empty first to avoid counting an empty string as 1 word
            const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
            wordCountSpan.innerText = words.length;

            // 3. Sentence Count
            // Split by common sentence terminators (. ! ?)
            // filter(Boolean) removes empty entries caused by trailing punctuation
            const sentences = text.split(/[.!?]+/).filter(Boolean);
            sentenceCountSpan.innerText = sentences.length;
        });
    }

    // =========================================
    // EXPERIMENT 3: SPEED TYPING TEST
    // =========================================
    const racerDisplay = document.getElementById('racer-text-display');
    const racerInput = document.getElementById('racer-input');
    const startBtn = document.getElementById('racer-start-btn');
    const timeSpan = document.getElementById('racer-time');
    const wpmSpan = document.getElementById('racer-wpm');
    const errorSpan = document.getElementById('racer-errors');

    // Sample texts to type
    const quotes = [
        "The quick brown fox jumps over the lazy dog.",
        "To be or not to be, that is the question.",
        "Programs must be written for people to read, and only incidentally for machines to execute.",
        "Debugging is twice as hard as writing the code in the first place.",
        "It's not a bug, it's an undocumented feature."
    ];

    let startTime, timerInterval;
    let isRacing = false;

    if (startBtn && racerInput) {
        startBtn.addEventListener('click', () => {
            if (isRacing) {
                resetGame();
            } else {
                startGame();
            }
        });

        racerInput.addEventListener('input', () => {
            if (!isRacing) return;

            const arrayQuote = racerDisplay.querySelectorAll('span');
            const arrayValue = racerInput.value.split('');
            let correct = true;
            let errors = 0;

            // Loop through every character in the display text
            arrayQuote.forEach((characterSpan, index) => {
                const character = arrayValue[index];

                if (character == null) {
                    // Hasn't typed this far yet
                    characterSpan.classList.remove('char-correct');
                    characterSpan.classList.remove('char-incorrect');
                    correct = false;
                } else if (character === characterSpan.innerText) {
                    // Typed correctly
                    characterSpan.classList.add('char-correct');
                    characterSpan.classList.remove('char-incorrect');
                } else {
                    // Typed incorrectly
                    characterSpan.classList.remove('char-correct');
                    characterSpan.classList.add('char-incorrect');
                    errors++;
                    correct = false;
                }
            });

            errorSpan.innerText = errors;

            // Check if finished
            if (correct && arrayValue.length === arrayQuote.length) {
                endGame();
            }
        });
    }

    function startGame() {
        isRacing = true;
        startBtn.innerText = "Reset Test";
        racerInput.disabled = false;
        racerInput.value = '';
        racerInput.focus();

        // 1. Pick random quote
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[quoteIndex];

        // 2. Clear display and re-create it as individual spans
        racerDisplay.innerHTML = '';
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            racerDisplay.appendChild(characterSpan);
        });

        // 3. Start Timer
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000); // in seconds
        timeSpan.innerText = timeElapsed + 's';
        
        // Calculate WPM roughly every second
        calculateWPM(timeElapsed);
    }

    function calculateWPM(timeElapsed) {
        const wordsTyped = racerInput.value.length / 5; // Standard: 5 chars = 1 word
        const minutes = timeElapsed / 60;
        const wpm = Math.round(wordsTyped / minutes) || 0;
        wpmSpan.innerText = wpm;
    }

    function endGame() {
        clearInterval(timerInterval);
        isRacing = false;
        racerInput.disabled = true;
        startBtn.innerText = "Start New Test";
        
        // Final WPM calculation
        const timeElapsed = Math.floor((new Date() - startTime) / 1000);
        calculateWPM(timeElapsed);
    }

    function resetGame() {
        clearInterval(timerInterval);
        isRacing = false;
        racerInput.disabled = true;
        racerInput.value = '';
        racerDisplay.innerText = 'Click "Start Test" to begin...';
        timeSpan.innerText = '0s';
        wpmSpan.innerText = '0';
        errorSpan.innerText = '0';
        startBtn.innerText = "Start Test";
    }

    // =========================================
    // EXPERIMENT 4: SPEECH JAMMER (DAF)
    // =========================================
    const jammerBtn = document.getElementById('jammer-btn');
    const delaySlider = document.getElementById('delay-slider');
    const delayVal = document.getElementById('delay-val');
    const jammerStatus = document.getElementById('jammer-status');

    let audioCtx;
    let mediaStreamSource;
    let delayNode;
    let isJamming = false;

    // Update the ms display when slider moves
    if (delaySlider && delayVal) {
        delaySlider.addEventListener('input', () => {
            delayVal.innerText = delaySlider.value;
            if (delayNode) {
                // Convert ms to seconds for the Web Audio API
                delayNode.delayTime.value = delaySlider.value / 1000;
            }
        });
    }

    if (jammerBtn) {
        jammerBtn.addEventListener('click', async () => {
            if (!isJamming) {
                // --- START JAMMER ---
                try {
                    // 1. Request Microphone Access
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    
                    // 2. Create Audio Context if it doesn't exist
                    if (!audioCtx) {
                        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    }
                    
                    // 3. Resume context (needed for some browsers' autoplay policies)
                    if (audioCtx.state === 'suspended') {
                        await audioCtx.resume();
                    }

                    // 4. Create the audio nodes
                    mediaStreamSource = audioCtx.createMediaStreamSource(stream);
                    delayNode = audioCtx.createDelay(1.0); // Max 1 second delay capacity
                    delayNode.delayTime.value = delaySlider.value / 1000; // Set initial delay

                    // 5. Connect: Mic -> Delay -> Speakers
                    mediaStreamSource.connect(delayNode);
                    delayNode.connect(audioCtx.destination);

                    // 6. Update UI
                    isJamming = true;
                    jammerBtn.innerText = "Stop Jammer";
                    jammerBtn.style.backgroundColor = "#dc3545"; // Turn button red
                    jammerStatus.style.display = "block";

                } catch (err) {
                    console.error("Microphone access denied or error occurred:", err);
                    alert("Could not access microphone. Please allow permissions and try again.");
                }
            } else {
                // --- STOP JAMMER ---
                if (mediaStreamSource && delayNode) {
                    // Disconnect the nodes to stop the audio processing
                    mediaStreamSource.disconnect();
                    delayNode.disconnect();
                }
                
                // Stop the actual microphone stream (turns off the browser recording dot)
                if (mediaStreamSource && mediaStreamSource.mediaStream) {
                     mediaStreamSource.mediaStream.getTracks().forEach(track => track.stop());
                }

                // Update UI
                isJamming = false;
                jammerBtn.innerText = "Start Jammer";
                jammerBtn.style.backgroundColor = ""; // Reset button color
                jammerStatus.style.display = "none";
            }
        });
    }

});