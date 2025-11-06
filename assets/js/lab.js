document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // EXPERIMENT 1: ADVANCED DICE ROLLER
    // =========================================
    
    const rollBtn = document.getElementById('roll-btn');
    const resultsArea = document.getElementById('dice-results-area');
    const totalValueSpan = document.getElementById('total-value');
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

    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            let grandTotal = 0;
            let breakdownParts = [];

            // 1. Loop through each dice type
            diceTypes.forEach(die => {
                const countInput = document.getElementById(die.id);
                const count = parseInt(countInput.value) || 0; // Default to 0 if empty

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

                    // Add to breakdown: "3d6 (4, 1, 6)"
                    breakdownParts.push(`${count}d${die.sides} (${individualRolls.join(', ')})`);
                }
            });

            // 2. Handle Modifier
            const modInput = document.getElementById('roll-modifier');
            const modifier = parseInt(modInput.value) || 0;

            if (modifier !== 0) {
                grandTotal += modifier;
                // Add "+" sign if positive, automatically has "-" if negative
                const sign = modifier > 0 ? '+' : '';
                breakdownParts.push(`Modifier (${sign}${modifier})`);
            }

            // 3. Display Results
            if (breakdownParts.length === 0) {
                // User didn't select ANYTHING
                totalValueSpan.innerText = "0";
                breakdownDiv.innerText = "Please select at least one die.";
            } else {
                totalValueSpan.innerText = grandTotal;
                // Join parts with " + " for a nice formula look
                breakdownDiv.innerText = breakdownParts.join(' + ');
            }
            
            // 4. Show the results area
            resultsArea.style.display = 'block';

            // Optional: Color crits for d20 ONLY if exactly ONE d20 was rolled
            const d20Count = parseInt(document.getElementById('d20-count').value) || 0;
            if (d20Count === 1 && breakdownParts.length === 1 && modifier === 0) {
                 // Simple check: is the grandTotal 20 or 1?
                 if (grandTotal === 20) totalValueSpan.style.color = '#28a745';
                 else if (grandTotal === 1) totalValueSpan.style.color = '#dc3545';
                 else totalValueSpan.style.color = '#333';
            } else {
                totalValueSpan.style.color = '#333'; // Reset color for multi-rolls
            }

        });
    }

});