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

});