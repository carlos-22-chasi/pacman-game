// Function to initialize the start screen functionality
function initializeStartScreen() {
  const startButton = document.getElementById('start-button');
  const overlay = document.getElementById('overlay');
  const audio = document.getElementById('background-sound');

  // Event listener for Start Game button
  startButton.addEventListener('click', () => {
    // Hide the overlay
    overlay.style.display = 'none';
    // Play background audio
    audio.play();
    startGame()
  });
}

// Call the initialize function after the page loads
window.addEventListener('load', initializeStartScreen);
