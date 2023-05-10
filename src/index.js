/**
 * DOM SELECTORS
 */

const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");
const chronoAudio = new Audio("./assets/chrono.mp3");
chronoAudio.addEventListener("canplaythrough", () => {
});

padContainer.classList.add('js-pad-container');
setTimeout(() => padContainer.classList.remove('js-pad-container'), 500);

/**
 * VARIABLES
 */
let computerSequence = [];
let playerSequence = [];
let maxRoundCount = 0;
let roundCount = 0;

const pads = [
  {
    color: "purple-cabbage",
    selector: document.querySelector(".js-pad-purple-cabbage"),
    sound: new Audio("./assets/simon-says-sound-1.mp3"),
  },
  {
    color: "indigo",
    selector: document.querySelector(".js-pad-indigo"),
    sound: new Audio("./assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue-mist",
    selector: document.querySelector(".js-pad-blue-mist"),
    sound: new Audio("./assets/simon-says-sound-3.mp3"),
  },
  {
    color: "summer-sky",
    selector: document.querySelector(".js-pad-summer-sky"),
    sound: new Audio("./assets/simon-says-sound-4.mp3"),
  },
];
const colors = ["purple-cabbage", "indigo", "blue-mist", "summer-sky"];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

const skillLevelDropdown = document.getElementById('skill-level');
const container = document.getElementById("container");

skillLevelDropdown.addEventListener('change', (event) => {
  const selectedSkillLevel = parseInt(event.target.value, 10);
  setLevel(selectedSkillLevel);
});

/**
 * EVENT HANDLERS
 */
function startButtonHandler() {
  const selectedSkillLevel = parseInt(skillLevelDropdown.value, 10);
  setLevel(selectedSkillLevel);
  roundCount = 1;
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  playComputerTurn();
  chronoAudio.pause(); // stop the audio

  return { startButton, statusSpan };
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color || !event.target.classList.contains('active')) return;

  activatePad(color);
  checkPress(color);
}

/**
 * HELPER FUNCTIONS
 */

// Define the shake function
function shake() {
  // Set the container's position to relative
  container.style.position = "relative";

  // Create a random displacement in the x and y directions
  const displacement = 10;
  const randomX = Math.floor(Math.random() * (2 * displacement + 1)) - displacement;
  const randomY = Math.floor(Math.random() * (2 * displacement + 1)) - displacement;

  // Apply the displacement to the container's position
  container.style.left = `${randomX}px`;
  container.style.top = `${randomY}px`;

  // Shake for 500 milliseconds
  setTimeout(() => {
    container.style.left = "0px";
    container.style.top = "0px";
  }, 500);
}

// Call the shake function every 14 seconds
setInterval(shake, 14000);
function setLevel(sequences) {
  maxRoundCount = sequences;
}

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function setText(element, text) {
  element.textContent = text;
}

function activatePad(color) {
  const pad = pads.find(pad => pad.color === color);
  pad.selector.classList.add("activated");
  playSound(color);
  setTimeout(() => pad.selector.classList.remove("activated"), 300);
}

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => activatePad(color), index * 600);
  });
}

function playSound(color) {
  const pad = pads.find(pad => pad.color === color);
  const sound = new Audio(pad.sound.src);
  sound.play();
}

function playComputerTurn() {
  const color = getRandomItem(pads).color;
  computerSequence.push(color);
  activatePads(computerSequence);
  setText(statusSpan, `Observe ${roundCount} chronal pads. Keep the flow intact.`);

  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000);
}

function playHumanTurn() {
  pads.forEach(pad => pad.selector.classList.add("active"));
  padContainer.classList.remove("unclickable");
  setText(statusSpan, `Your turn! Replicate the ${roundCount} chronal pads. Stay precise!`);
}

function checkPress(color) {
  const correctColor = computerSequence[playerSequence.length];

  if (color === correctColor) {
    playerSequence.push(color);

    if (playerSequence.length === computerSequence.length) {
      checkRound();
    }
  } else {
    resetGame("Temporal anomaly detected! Your sequence was out of sync with the timeline. The time machine has shut down, and you are trapped in this era forever! Game over.");
  }
}

function checkRound() {
  pads.forEach((pad) => pad.selector.classList.remove("active"));
  padContainer.classList.add("unclickable");

  if (roundCount === maxRoundCount) {
    setTimeout(
      () =>
        resetGame(
          "Temporal rift stabilized! You have successfully navigated the timestream and returned to the present. Well done, time traveler! You have completed all rounds."
        ),
      1000
    );
  } else {
    // Rotate the pad container by 45 degrees
    padContainer.style.transform = `rotate(${roundCount * 33.33}deg)`;
    
    // Advance to the next round
    roundCount++;
    updateBlur(roundCount);
    playerSequence = [];

    // Update the interface and start the computer's turn after a delay
    setText(statusSpan, `Round ${roundCount}`);
    setTimeout(() => playComputerTurn(), 1000);
  }
}


function resetGame(text) {
  alert(text);
  
  // Play the audio immediately
  chronoAudio.play();
  
  setText(heading, "Chrono Conquest");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");

  // Reset the game variables
  roundCount = 1;
  maxRoundCount = null;
  computerSequence = [];
  playerSequence = [];
}


function updateBlur(round) {
  const blurAmount = round * 1;
  document.querySelector(".background-blur").style.backdropFilter = `blur(${blurAmount}px)`;
}



/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
