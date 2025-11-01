document.addEventListener('DOMContentLoaded', () => {

    const totoButton = document.getElementById('toto-button');
    const totoAudio = document.getElementById('toto-audio');
    const rainAudio = document.getElementById('rain-audio');

    let isRaining = false;
    let rainInterval;
    
    // Variables for DVD screensaver effect
    let posX = 0;       // Current X position
    let posY = 0;       // Current Y position
    let velocityX = 2;  // Speed and direction on X axis
    let velocityY = 2;  // Speed and direction on Y axis
    let animationFrameId; // To control the animation loop
    
    // Function to create falling digits (unchanged)
    function createRainDigit() {
        const digit = document.createElement('span');
        digit.classList.add('rain-digit');
        digit.innerText = Math.random() < 0.5 ? '0' : '1';
        digit.style.left = Math.random() * 100 + 'vw';
        digit.style.animationDuration = (Math.random() * 2 + 3) + 's';
        document.body.appendChild(digit);
        setTimeout(() => {
            digit.remove();
        }, 5000);
    }

    // Function to stop all rain digits (unchanged)
    function stopRainEffect() {
        clearInterval(rainInterval);
        const allDigits = document.querySelectorAll('.rain-digit');
        allDigits.forEach(digit => digit.remove());
    }

    // --- NEW: DVD Screensaver Animation Function ---
    function animateTotoButton() {
        const buttonWidth = totoButton.offsetWidth;
        const buttonHeight = totoButton.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Update position
        posX += velocityX;
        posY += velocityY;

        // Bounce off horizontal walls
        if (posX + buttonWidth > screenWidth || posX < 0) {
            velocityX *= -1; // Reverse X direction
            // Keep within bounds if it overshot
            if (posX < 0) posX = 0;
            if (posX + buttonWidth > screenWidth) posX = screenWidth - buttonWidth;
        }

        // Bounce off vertical walls
        if (posY + buttonHeight > screenHeight || posY < 0) {
            velocityY *= -1; // Reverse Y direction
            // Keep within bounds if it overshot
            if (posY < 0) posY = 0;
            if (posY + buttonHeight > screenHeight) posY = screenHeight - buttonHeight;
        }

        // Apply new position
        totoButton.style.left = `${posX}px`;
        totoButton.style.top = `${posY}px`;

        // Continue the animation loop if raining
        if (isRaining) {
            animationFrameId = requestAnimationFrame(animateTotoButton);
        }
    }

    // Listen for a click on the Toto button
    totoButton.addEventListener('click', () => {
        if (isRaining === false) {
            // --- START THE EFFECT ---
            
            totoAudio.currentTime = 0;
            totoAudio.play();
            
            rainAudio.play();
            
            rainInterval = setInterval(createRainDigit, 100);
            
            isRaining = true;

            // NEW: Start the DVD screensaver animation
            animationFrameId = requestAnimationFrame(animateTotoButton);

        } else {
            // --- STOP THE EFFECT ---
            
            totoAudio.pause();
            rainAudio.pause();
            rainAudio.currentTime = 0;
            
            stopRainEffect();
            
            isRaining = false;

            // NEW: Stop the DVD screensaver animation
            cancelAnimationFrame(animationFrameId);
            
            // NEW: Reset button position
            totoButton.style.left = `50px`; // Or any initial position
            totoButton.style.top = `50px`;  // Or any initial position
            posX = 50; // Reset position tracking
            posY = 50;
        }
    });

});
