const txtSize = 64;

let player = {
  x: 200,
  y: 200,
  speed: 10,
  emoji: '🦆',
  size: txtSize
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
       player.x,
       player.y);
}

function playerLocomotion(){
if (moving) {
    let dx = targetX - player.x;
    let dy = targetY - player.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      player.x += (dx / distance) *
        player.speed;
      player.y += (dy / distance) *
        player.speed;
    } else {
      moving = false;
    }
  }
  
  // Check screen boundaries
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