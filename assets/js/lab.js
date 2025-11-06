document.addEventListener('DOMContentLoaded', () => {

    // === EXPERIMENT 1: D20 DICE ROLLER ===
    const rollBtn = document.getElementById('roll-btn');
    const diceResult = document.getElementById('dice-result');

    if (rollBtn && diceResult) {
        rollBtn.addEventListener('click', () => {
            // 1. Add 'rolling' animation class
            diceResult.classList.add('rolling');
            
            // 2. Wait a fraction of a second for animation feel
            setTimeout(() => {
                // 3. Generate random number 1-20
                const result = Math.floor(Math.random() * 20) + 1;
                
                // 4. Update text
                diceResult.innerText = result;
                
                // 5. Crit success/fail styling
                if (result === 20) {
                    diceResult.style.color = '#28a745'; // Green for Nat 20
                } else if (result === 1) {
                    diceResult.style.color = '#dc3545'; // Red for Crit Fail
                } else {
                    diceResult.style.color = '#333'; // Normal black/grey
                }

                // 6. Remove animation class
                diceResult.classList.remove('rolling');
            }, 300);
        });
    }

});