//const txtSize = 64;

let player = {
  x: 200,
  y: 200,
  speed: 10,
  emoji: '🦆',
  size: 1
};

let targetX = 200;
let targetY = 200;
let moving = false;

function mousePressed() {
  targetX = mouseX;
  targetY = mouseY;
  moving = true;
}

function drawPlayer(){
  textSize(player.size);
  text(player.emoji,
       lerp(player.x,round(player.x/player.size)*player.size,0.7),
       lerp(player.y,round(player.y/player.size)*player.size,0.7));
}

// Collision auxiliary system.
function checkCollision(x, y, gameObjects) {
  // Convert pixel coordinates to grid coordinates.
  const gridX = Math.floor(x / player.size);
  const gridY = Math.floor(y / player.size);
  
  // Check if any solid object occupies this grid position
  for (let obj of gameObjects) {
    if (obj.solid=='1') {  // Add this property to your gameObjects
      const objGridX = Math.floor(obj.x / player.size);
      const objGridY = Math.floor(obj.y / player.size);
      
      if (gridX === objGridX && gridY === objGridY) {
        return true; // Collision detected!
      }
    }
  }
  return false; // No collision :)
}

function playerLocomotion() {
    if (moving) {
      let dx = targetX - player.x;
      let dy = targetY - player.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        // Calculate next position
        let nextX = player.x + (dx / distance) * player.speed;
        let nextY = player.y + (dy / distance) * player.speed;
        
        // Check if next position would cause collision.
        let objects = worldAreas.get(key);
        if (!checkCollision(nextX, nextY, objects)) {
          player.x = nextX;
          player.y = nextY;
        } else {
          // Stop movement when collision detected.
          moving = false;
          //console.log('Direct hit!').
        }
      } else {
        moving = false;
      }
    }
  
  // Check screen boundaries.
  if (player.x < player.size*0.5) {
    currentArea.x--;
    player.x = width-player.size;
    generateAreaIfNeeded();
  } else if (player.x > 
             width-player.size*0.5) {
    currentArea.x++;
    player.x = player.size*0.5;
    generateAreaIfNeeded();
  }
  
  if (player.y < player.size*0.5) {
    currentArea.y--;
    player.y = height-player.size*0.5;
    generateAreaIfNeeded();
  } else if (player.y > 
             height-player.size*0.5) {
    currentArea.y++;
    player.y = player.size*0.5;
    generateAreaIfNeeded();
  }
  
}