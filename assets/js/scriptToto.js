document.addEventListener('DOMContentLoaded', () => {

    // --- INTRO SOUND SEQUENCER ---
    const tvSound = document.getElementById('tv-on-sound');
    const scarySound = document.getElementById('scary-sound');

    // 1. Play TV turn-on immediately (0.5s mark in our timeline)
    if (tvSound) {
        setTimeout(() => {
             tvSound.volume = 0.4;
             tvSound.play().catch(e => console.log("Autoplay prevented:", e));
        }, 500);
    }

    // 2. Play Scary Movie sound at 2.5 seconds
    if (scarySound) {
        setTimeout(() => {
            scarySound.volume = 0.6; // Adjust volume as needed
            scarySound.play().catch(e => console.log("Autoplay prevented:", e));
        }, 2500);
    }

    // Get all the HTML elements we need for Toto effect
    const totoButton = document.getElementById('toto-button');
    const totoAudio = document.getElementById('toto-audio');
    const rainAudio = document.getElementById('rain-audio');

    // This is our "on/off" switch
    let isRaining = false;
    
    // This variable will hold our 'setInterval' function so we can stop it later
    let rainInterval;
    
    // Variables for DVD screensaver effect
    let posX = 0;       // Current X position
    let posY = 0;       // Current Y position
    let velocityX = 1;  // Speed and direction on X axis
    let velocityY = 1;  // Speed and direction on Y axis
    let animationFrameId; // To control the animation loop
    
    // This function creates one falling digit
    function createRainDigit() {
        const digit = document.createElement('span');
        digit.classList.add('rain-digit');
        
        // Set its text to a 0 or 1
        digit.innerText = Math.random() < 0.5 ? '0' : '1';
        
        // Start it at a random horizontal position
        digit.style.left = Math.random() * 100 + 'vw';
        
        // Give it a random fall speed (3 to 5 seconds)
        digit.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        // Add the new digit to the page
        document.body.appendChild(digit);
        
        // Remove the digit after 5 seconds (when it's off-screen)
        setTimeout(() => {
            digit.remove();
        }, 5000);
    }

    // This function removes all digits from the screen
    function stopRainEffect() {
        // Stop creating new digits
        clearInterval(rainInterval);
        
        // Find all digits currently on the page
        const allDigits = document.querySelectorAll('.rain-digit');
        
        // Remove each one
        allDigits.forEach(digit => digit.remove());
    }

    // --- DVD Screensaver Animation Function ---
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
            if (posX < 0) posX = 0;
            if (posX + buttonWidth > screenWidth) posX = screenWidth - buttonWidth;
        }

        // Bounce off vertical walls
        if (posY + buttonHeight > screenHeight || posY < 0) {
            velocityY *= -1; // Reverse Y direction
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

    // Listen for a mouse down (press) on the Toto button
    totoButton.addEventListener('mousedown', () => {
        
        if (isRaining === false) {
            // --- START THE EFFECT ---
            
            totoAudio.currentTime = 0;
            totoAudio.play();
            
            rainAudio.play();
            
            rainInterval = setInterval(createRainDigit, 100);
            
            isRaining = true;

            // --- START LOGIC ---
            // Get the button's current position *before* making it fixed
            const rect = totoButton.getBoundingClientRect();
            posX = rect.left;
            posY = rect.top;

            // Add the class to make it 'position: fixed'
            totoButton.classList.add('toto-moving');
            
            // Start the animation
            animationFrameId = requestAnimationFrame(animateTotoButton);

        } else {
            // --- STOP THE EFFECT ---
            
            totoAudio.pause();
            rainAudio.pause();
            rainAudio.currentTime = 0;
            
            stopRainEffect();
            
            isRaining = false;

            // Stop the animation
            cancelAnimationFrame(animationFrameId);
            
            // --- STOP LOGIC ---
            // Remove the moving class
            totoButton.classList.remove('toto-moving');
            
            // Remove the inline styles so it snaps back to the footer
            totoButton.style.left = '';
            totoButton.style.top = '';
        }
    });

});