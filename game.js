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
let wallInnerColor = "black"
let foodColor = "#FEB897"

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
// Main game loop where it updates and redraws the game at each frame
let gameLoop = () => {
  update()
  draw()
};
// Update function to handle pacman movement 
let update = () => {
  pacman.moveProcess()
};
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
// Main drawing function clears the canvas and draws all elements
let draw = () => {
  createRect(0, 0, canvas.width, canvas.height, "blue");
  drawWalls();
  drawFoods();
  pacman.draw(); //draw pacman
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
// Create a new Pacman instance
let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5
  )
};

createNewPacman();
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