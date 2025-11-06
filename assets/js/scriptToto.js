document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. CINEMATIC INTRO SEQUENCER
    // =========================================
    const startButton = document.getElementById('start-button');
    const tvSound = document.getElementById('tv-on-sound');
    const scarySound = document.getElementById('scary-sound');

    // CHECK: Has the user already seen the intro this session?
    if (sessionStorage.getItem('introPlayed') === 'true') {
        // YES: Add the class to skip everything immediately
        document.body.classList.add('skip-intro');
    } else {
        // NO: Set up the click listener.
        if (startButton) {
            startButton.addEventListener('click', () => {
                // REMEMBER: Save this so it doesn't play again
                sessionStorage.setItem('introPlayed', 'true');

                // A. Start visual animations
                document.body.classList.add('animate-intro');

                // B. Play TV Sound IMMEDIATELY
                if (tvSound) {
                    tvSound.volume = 0.4;
                    tvSound.play().catch(e => console.log("Audio failed:", e));
                }

                // C. Play Scary Sound when name starts appearing (0.5s)
                if (scarySound) {
                    setTimeout(() => {
                        scarySound.volume = 0.6;
                        scarySound.play().catch(e => console.log("Audio failed:", e));
                    }, 500);
                }
            });
        }
    }

    // =========================================
    // 2. TOTO WOLFF EASTER EGG
    // =========================================

    // Get elements
    const totoButton = document.getElementById('toto-button');
    const totoAudio = document.getElementById('toto-audio');
    const rainAudio = document.getElementById('rain-audio');

    // State variables
    let isRaining = false;
    let rainInterval;
    
    // Movement variables (DVD screensaver effect)
    let posX = 0, posY = 0;
    let velocityX = 1, velocityY = 1;
    let animationFrameId;

    // --- Helper Function: Create Digital Rain ---
    function createRainDigit() {
        const digit = document.createElement('span');
        digit.classList.add('rain-digit');
        digit.innerText = Math.random() < 0.5 ? '0' : '1';
        digit.style.left = Math.random() * 100 + 'vw';
        digit.style.animationDuration = (Math.random() * 2 + 3) + 's';
        document.body.appendChild(digit);

        // Self-destruct after 5 seconds
        setTimeout(() => digit.remove(), 5000);
    }

    // --- Helper Function: Clean Up Rain ---
    function stopRainEffect() {
        clearInterval(rainInterval);
        document.querySelectorAll('.rain-digit').forEach(digit => digit.remove());
    }

    // --- Main Animation Loop (DVD Effect) ---
    function animateTotoButton() {
        if (!totoButton) return;

        const buttonWidth = totoButton.offsetWidth;
        const buttonHeight = totoButton.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Update position
        posX += velocityX;
        posY += velocityY;

        // Bounce off horizontal walls
        if (posX + buttonWidth > screenWidth || posX < 0) {
            velocityX *= -1;
            if (posX < 0) posX = 0;
            if (posX + buttonWidth > screenWidth) posX = screenWidth - buttonWidth;
        }

        // Bounce off vertical walls
        if (posY + buttonHeight > screenHeight || posY < 0) {
            velocityY *= -1;
            if (posY < 0) posY = 0;
            if (posY + buttonHeight > screenHeight) posY = screenHeight - buttonHeight;
        }

        // Apply new position
        totoButton.style.left = `${posX}px`;
        totoButton.style.top = `${posY}px`;

        // Continue loop if active
        if (isRaining) {
            animationFrameId = requestAnimationFrame(animateTotoButton);
        }
    }

    // --- Event Listener: Toggle Effect on Click (mousedown) ---
    if (totoButton) {
        totoButton.addEventListener('mousedown', () => {
            if (!isRaining) {
                // === START EFFECT ===
                isRaining = true;

                // Play sounds
                totoAudio.currentTime = 0;
                totoAudio.play();
                rainAudio.play();

                // Start rain
                rainInterval = setInterval(createRainDigit, 100);

                // Capture current position and switch to fixed mode
                const rect = totoButton.getBoundingClientRect();
                posX = rect.left;
                posY = rect.top;
                totoButton.classList.add('toto-moving');

                // Start movement loop
                animationFrameId = requestAnimationFrame(animateTotoButton);

            } else {
                // === STOP EFFECT ===
                isRaining = false;

                // Stop sounds
                totoAudio.pause();
                rainAudio.pause();
                rainAudio.currentTime = 0;

                // Stop rain and movement
                stopRainEffect();
                cancelAnimationFrame(animationFrameId);

                // Reset button to footer position
                totoButton.classList.remove('toto-moving');
                totoButton.style.left = '';
                totoButton.style.top = '';
            }
        });
    }
});