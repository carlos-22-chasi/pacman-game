class Ghost { 
  constructor(x, y , width, height, speed, imageX, imageY, imageWidth, imageHeight, range){
    this.x = x;
    this.y = y; 
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.range = range; // range within which ghost detects Pacman
    this.randomTargetIndex = parseInt(Math.random() * 4);
    this.target = randomTargetsForGhosts[this.randomTargetIndex];

    setInterval(() => {  // change the ghost's direction every second
        this.changeRandomDirection();
    }, 1000);
  }

  // Check if Pacman is within range of the ghost
  isInRange() {
    let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
     // Check if the Euclidean distance between Pacman and the ghost is less than or equal to the ghost's range
    if (Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range) {
        return true;
    }
    return false;
}
  // Change the ghost's target direction randomly
  changeRandomDirection() {
    this.randomTargetIndex += 1; // Update the random target index
    this.randomTargetIndex = this.randomTargetIndex % 4; // Ensure the index wraps around (0 to 3)
  }

  // Method to process ghost's movement logic
  moveProcess() {
    if (this.isInRange()) {  // If Pacman is within range, the ghost will target Pacman
      this.target = pacman;
    } else {   // Otherwise, it will follow one of the random predefined targets
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
    }
    this.changeDirectionsIfPossible(); // change direction if the new one is possible
    this.moveForwards(); // move pacman forward in the current direction
    if(this.checkCollisions()){ // check for wall collisions
      this.moveBackwards(); // if collision occurs, move pacman backwards
    }
  }

  // Move ghost backwards based on the current direction
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
  // Move ghost forwards based on the current direction
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
  // Check if ghost collides with a wall
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

  // Checks if it's possible to change direction and applies the new direction if valid
  changeDirectionsIfPossible() {
    let tempDirection = this.direction;
    // Calculate a new direction based on the target's location
    this.direction = this.calculateNewDirection(
        map,
        parseInt(this.target.x / oneBlockSize),
        parseInt(this.target.y / oneBlockSize)
    );
    // If no valid direction is calculated, revert to the original direction
    if (typeof this.direction == "undefined"){
      this.direction = tempDirection;
      return;
    }

    this.moveForwards(); // Attempt moving new direction
    if(this.checkCollisions()){ // If there's a collision, revert to the original direction
      this.moveBackwards();
      this.direction = tempDirection;
    } 
    else{
      this.moveBackwards();
    }
  } 

  // Calculates the new direction based on the current map and the target's coordinates
  calculateNewDirection(map, destX, destY) {
    // Create a copy of the map to avoid modifying the original
    let mp = [];
    for (let i = 0; i < map.length; i++) {
        mp[i] = map[i].slice(); // Clone each row of the map
    }
    // Initialize a queue with the ghost's current position and empty moves
    let queue = [
        {
            x: this.getMapX(),
            y: this.getMapY(),
            rightX: this.getMapXRightSide(),
            rightY: this.getMapYRightSide(),
            moves: [],
        },
    ];

    // Perform BFS to find the shortest path to the destination
    while (queue.length > 0) {
        let poped = queue.shift(); // Dequeue the first element
         // If the current node matches the target's coordinates, return the first move in the path
        if (poped.x == destX && poped.y == destY) {
            return poped.moves[0];
        } else {
            mp[poped.y][poped.x] = 1; // Mark the current position as visited
            let neighborList = this.addNeighbors(poped, mp);  // Get all valid neighboring positions
            for (let i = 0; i < neighborList.length; i++) {
                queue.push(neighborList[i]); // Add neighbors to the queue for further exploration
            }
        }
    }
    return DIRECTION_UP; // If no path is found, return a default direction
  }

  // Adds valid neighboring positions (unvisited and within bounds) to the queue
  addNeighbors(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfColumns = mp[0].length;
     // Check if the left neighbor is valid
    if (poped.x - 1 >= 0 && poped.x - 1 < numOfRows && mp[poped.y][poped.x - 1] != 1) {
        let tempMoves = poped.moves.slice(); // Copy the current move list
        tempMoves.push(DIRECTION_LEFT); // Add left move to the list
        queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves }); // Add the neighbor to the queue
    }
    // Check if the right neighbor is valid 
    if (poped.x + 1 >= 0 && poped.x + 1 < numOfRows && mp[poped.y][poped.x + 1] != 1) {
      let tempMoves = poped.moves.slice(); // Copy the current move list
      tempMoves.push(DIRECTION_RIGHT); // Add right move to the list
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves }); // Add the neighbor to the queue
    }
    // Check if the upper neighbor is valid 
    if (poped.y - 1 >= 0 && poped.y - 1 < numOfColumns && mp[poped.y - 1][poped.x] != 1) {
      let tempMoves = poped.moves.slice(); // Copy the current move list
      tempMoves.push(DIRECTION_UP); // Add up move to the list
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves }); // Add the neighbor to the queue
    }
    // Check if the bottm neighbor is valid 
    if (poped.y + 1 >= 0 && poped.y + 1 < numOfColumns && mp[poped.y + 1][poped.x] != 1) {
      let tempMoves = poped.moves.slice(); // Copy the current move list
      tempMoves.push(DIRECTION_DOWN); // Add down move to the list
      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves }); // Add the neighbor to the queue
    }
    return queue;
  }

  // Draws ghost on the canvas with rotation based on direction
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

    // !!! draw the range of the ghosts  !!!!
    // canvasContext.beginPath();
    // canvasContext.strokeStyle = "red"
    // canvasContext.arc(
    //   this.x + oneBlockSize / 2,
    //   this.y + oneBlockSize / 2,
    //   this.range * oneBlockSize, 
    //   0, 
    //   2 * Math.PI
    // );
    // canvasContext.stroke();
  }

  // Get ghosts's X position on the map grid
  getMapX() {
    return parseInt(this.x / oneBlockSize); // Convert x coordinate into a grid index
  }
  // Get ghosts's Y position on the map grid
  getMapY() {
    return parseInt(this.y / oneBlockSize); // Convert the Y coordinate into a grid index
  }
  // Get ghosts's X position for the right side of its body on the map grid
  getMapXRightSide(){
    return parseInt((this.x + 0.99999 * oneBlockSize) / oneBlockSize); // Adjust for right edge of Pacman
  }
  // Get ghosts's Y position for the right side of its body on the map grid
  getMapYRightSide(){
    return parseInt((this.y + 0.99999 * oneBlockSize) / oneBlockSize); // Adjust for bottom edge of Pacman
  }
}