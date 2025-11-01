// Wait for the whole page to load before we try to find our button
document.addEventListener('DOMContentLoaded', () => {

    // Get all the HTML elements we need
    const totoButton = document.getElementById('toto-button');
    const totoAudio = document.getElementById('toto-audio');
    const rainAudio = document.getElementById('rain-audio');

    // This is our "on/off" switch
    let isRaining = false;

    // This variable will hold our 'setInterval' function so we can stop it later
    let rainInterval;

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

    // Listen for a click on the Toto button
    totoButton.addEventListener('click', () => {

        // Check our "on/off" switch
        if (isRaining === false) {
            // --- START THE EFFECT ---

            // Play the click sound (and reset it first)
            totoAudio.currentTime = 0;
            totoAudio.play();

            // Play the rain sound
            rainAudio.play();

            // Start the rain interval (create a new digit every 100ms)
            rainInterval = setInterval(createRainDigit, 100);

            // Flip our switch to "on"
            isRaining = true;

        } else {
            // --- STOP THE EFFECT ---

            // Pause and reset both sounds
            totoAudio.pause();
            rainAudio.pause();
            rainAudio.currentTime = 0;

            // Stop and remove all the rain
            stopRainEffect();

            // Flip our switch to "off"
            isRaining = false;
        }
    });

});
