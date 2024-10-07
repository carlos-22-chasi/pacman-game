// Get the canvas element and its 2D drawing context
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
// Get the image elements for Pacman and ghost animations
const pacmanFrames = document.getElementById("animations")
const ghostFrames = document.getElementById("ghosts")

// Function to draw rectangles onto the board 
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
let createRect = (x, y , width, height, color) =>{
  canvasContext.fillStyle = color; // Set the fill color
  canvasContext.fillRect(x,y,width,height, color); // Draw the rectangle
};

let fps = 30;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.6;  // Space inside walls for transparent look
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;  // Offset for inner wall drawing
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostImageLocations = [{x: 0, y: 0}, {x: 176 , y: 0}, {x: 0, y: 121}, {x: 176, y: 121}]
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_DOWN = 1

// we now create the map of the walls. if 1 wall, if 2 fruit,  if 0 not wall
// 21 columns // 23 rows
let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for(let i = 0; i < map.length; i++){
  for(let j = 0; j < map[0].length; j++){
      if(map[i][j] == 2){
       foodCount++
    }
  }
}

let randomTargetsForGhosts = [
  {x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  {x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  {x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize}
];

// Main game loop where it updates and redraws the game at each frame
let gameLoop = () => {
  draw();
  update();
};
// Update function to handle pacman movement 
let update = () => {
  pacman.moveProcess();
  pacman.eat();
  for (let i = 0; i < ghosts.length; i++){
    ghosts[i].moveProcess();
  }
  if(pacman.checkGhostCollisions()){
    restartGame();
  }
  if (score >= foodCount) {
    winGame();
  }
};

let winGame = () => {
  clearInterval(gameInterval);
  drawWin();
};

let drawWin = () => {
  canvasContext.font = "bold 50px Arial";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("You Won!", 60, 235);
};

let restartGame = () => {
  createNewPacman();
  createGhosts();
  lives--;
  if (lives == 0){
    gameOver();
  }
};

let gameOver = () => {
  clearInterval(gameInterval);
  drawGameOver();
};

let drawGameOver = () => {
  canvasContext.font = "bold 50px Arial";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Game Over!", 60, 235);
};

let drawLives = () => {
  canvasContext.font = "bold 30px Arial";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 200, oneBlockSize * (map.length + 1) + 10);
  for (let i = 0; i < lives; i++){
    canvasContext.drawImage(
      pacmanFrames, // image src for pacman
      2 * oneBlockSize, // x position of the frame in the sprite sheet
      0, // y position in the sprite sheet
      oneBlockSize, // Width of the frame
      oneBlockSize,  // Height of the frame
      290 + (i * 1.5) * oneBlockSize, // Pacman's x position on the canvas
      oneBlockSize * map.length + 10, // Pacman's y position on the canvas
      oneBlockSize, // Pacman's width
      oneBlockSize // Pacman's height
    )
  }
}

// Function to draw food on the map
let drawFoods = () => {
  for(let i = 0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
        if(map[i][j] == 2){
          // Draw the food as a small square
          createRect(
            j * oneBlockSize + oneBlockSize / 3,
            i * oneBlockSize + oneBlockSize / 3,
            oneBlockSize / 3,
            oneBlockSize / 3,
            foodColor
          );
        }
    }
  }
};

// Function to the the score on the bottom of the canvas
let drawScore = () => {
  canvasContext.font = "bold 30px Arial";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(`Score: ${score}`, 0, oneBlockSize * (map.length + 1) + 10);
};

// Function to draw all the ghosts in the game 
let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++){
    ghosts[i].draw();
  }
}

// Main drawing function clears the canvas and draws all elements
let draw = () => {
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  drawFoods();
  pacman.draw(); //draw pacman
  drawScore();
  drawGhosts(); // draw the ghosts
  drawLives();
};
// Start the game loop at the defined frame rate
let gameInterval = setInterval(gameLoop, 1000/fps)

let drawWalls = () => {
  for(let i = 0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
      if(map[i][j] == 1){ // then it is a wall
        // draws outer part of walls 
        createRect(
          j * oneBlockSize, 
          i * oneBlockSize, 
          oneBlockSize, 
          oneBlockSize, 
          wallColor
        );

        // draw inner transparent spaces inside walls for better visuals 
        if (j > 0 && map[i][j-1] == 1){ // draw rectangle if theres a wall to the left
          createRect(
            j * oneBlockSize, 
            i * oneBlockSize + wallOffset, 
            wallSpaceWidth + wallOffset, 
            wallSpaceWidth, 
            wallInnerColor 
          );
        }

        if(j < map[0].length - 1 && map[i][j + 1] == 1){ // draw rectangle if theres a wall to the right
          createRect(
            j * oneBlockSize + wallOffset, 
            i * oneBlockSize + wallOffset, 
            wallSpaceWidth + wallOffset, 
            wallSpaceWidth, 
            wallInnerColor 
          );
        }

        if (i > 0 && map[i-1][j] == 1){ // draw rectangle if theres a wall on the bottom 
          createRect(
            j * oneBlockSize + wallOffset, 
            i * oneBlockSize, 
            wallSpaceWidth, 
            wallSpaceWidth + wallOffset, 
            wallInnerColor 
          );
        }

        if(i < map.length - 1 && map[i + 1][j] == 1){ //draw retangle if there's a wall on top
          createRect(
            j * oneBlockSize + wallOffset, 
            i * oneBlockSize + wallOffset, 
            wallSpaceWidth, 
            wallSpaceWidth + wallOffset, 
            wallInnerColor 
          );
        }
      }
    }
  }
};

// Create instances of Ghosts 
let createGhosts = () => {
  ghosts = []
  for (let i = 0; i < 4; i++) {
    let newGhost = new Ghost(
        9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
        10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        pacman.speed / 2,
        ghostImageLocations[i % 4].x,
        ghostImageLocations[i % 4].y,
        124,
        116,
        6 + i
    );
    ghosts.push(newGhost);
  }
};

// Create a new Pacman instance
let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5
  )
};

createNewPacman();
createGhosts();
gameLoop(); // Start the game loop 

// Event listener for keydown events to change Pacman's direction
window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  // Change pacman's direction based on arrow keys or WASD
  setTimeout(() => {
    if (k == 37 || k == 65){ // left
      pacman.nextDirection = DIRECTION_LEFT
    }
    else if (k == 38 || k == 87){ // up
      pacman.nextDirection = DIRECTION_UP
    }
    else if (k == 39 || k == 68){ // right
      pacman.nextDirection = DIRECTION_RIGHT
    }
    else if (k == 40 || k == 83){ // down
      pacman.nextDirection = DIRECTION_DOWN
    }
  }, 1) 
});