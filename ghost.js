class Ghost { 
  constructor(x, y , width, height, speed, imageX, imageY, imageWidth, imageHeight, range){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT;
    this.nextDirection = this.direction;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.range = range;
  }

  // Method to process Pacman's movement logic
  moveProcess() {
    this.changeDirectionsIfPossible(); // change direction if the new one is possible
    this.moveForwards(); // move pacman forward in the current direction
    if(this.checkCollisions()){ // check for wall collisions
      this.moveBackwards(); // if collision occurs, move pacman backwards
    }
  }
  // Method for pacman eating food logic
  eat() {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
         // Check if the current map position has food and if Pacman's current position matches the food's position
        if(map[i][j] == 2 && 
          this.getMapX() == j && 
          this.getMapY() == i
        ) {
          map[i][j] = 3; // Change the map value to 3, indicating the food has been eaten
          score++; // Increase the score after eating the food
        }
      }
    }
  }
  // Move pacman backwards based on the current direction
  moveBackwards() {
    switch(this.direction){
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;
      case DIRECTION_DOWN:
        this.y -= this.speed;
        break;
    }
  }
  // Move pacman forwards based on the current direction
  moveForwards() {
    switch(this.direction){
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;
      case DIRECTION_DOWN:
        this.y += this.speed;
        break;
    }
  }
  // Check if pacman collides with a wall
  checkCollisions() {
     // Check for collisions using Pacman's current position and the right side of Pacman
    if (
      map[this.getMapY()][this.getMapX()] == 1 || // Check top left corner
      map[this.getMapYRightSide()][this.getMapXRightSide()] == 1 || // check bottom right corner
      map[this.getMapY()][this.getMapXRightSide()] == 1 ||  // Check top right corner
      map[this.getMapYRightSide()][this.getMapX()] == 1 // Check bottom left corner
    ) {
      return true // Collision detected
    }
    return false // No collision

  }

  checkGhostCollisions() {

  }
  // Checks if it's possible to change direction and applies the new direction if valid
  changeDirectionsIfPossible() {
    if (this.direction == this.nextDirection) return; // If already moving in new direction, do nothing

    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards(); // Attempt moving new direction
    if(this.checkCollisions()){ // If there's a collision, revert to the original direction
      this.moveBackwards();
      this.direction = tempDirection;
    } 
    else{
      this.moveBackwards();
    }
  } 
  // Updates the current frame of the Pacman animation
  changeAnimation() {
    this.currentFrame = (this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1);
  }
  // Draws Pacman on the canvas with rotation based on direction
  draw() {
    canvasContext.save(); // Saves the current canvas state
    // Draw pacman using the current animation frame
    canvasContext.drawImage(
      ghostFrames, // image src for pacman
      this.imageX, // x position of the frame in the sprite sheet
      this.imageY, // y position in the sprite sheet
      this.imageWidth, // Width of the frame
      this.imageHeight,  // Height of the frame
      this.x, // Pacman's x position on the canvas
      this.y, // Pacman's y position on the canvas
      this.width, // Pacman's width
      this.height // Pacman's height
    );

    canvasContext.restore(); // Restore the canvas state after drawing
  }
  // Get Pacman's X position on the map grid
  getMapX() {
    return parseInt(this.x / oneBlockSize); // Convert x coordinate into a grid index
  }
  // Get Pacman's Y position on the map grid
  getMapY() {
    return parseInt(this.y / oneBlockSize); // Convert the Y coordinate into a grid index
  }
  // Get Pacman's X position for the right side of its body on the map grid
  getMapXRightSide(){
    return parseInt((this.x + 0.99999 * oneBlockSize) / oneBlockSize); // Adjust for right edge of Pacman
  }
  // Get Pacman's Y position for the right side of its body on the map grid
  getMapYRightSide(){
    return parseInt((this.y + 0.99999 * oneBlockSize) / oneBlockSize); // Adjust for bottom edge of Pacman
  }

}