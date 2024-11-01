

// 1. Basic djb2 hash - 
// simple but effective for most cases.
const djb2Hash = str => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) +
          str.charCodeAt(i);
    }
    return hash >>> 0; 
// Convert to unsigned 32-bit integer.
};

//let worldName=prompt('name?');
//let worldSeed=djb2Hash(worldName);
const worldSeed=1234;

function preload(){
  
  initializeWorld();
  //console.log(worldAreas);
  
}

function setup() {
  
  // Take square size of smallest for canvas.
  let w = windowWidth >
          windowHeight ? 
          windowHeight :
          windowWidth;
  createCanvas(w,w);

  textAlign(CENTER, CENTER);
  player.size=w/10;
  //generateArea(0,-1);
  //generateArea(0,0);
  //generateAreaIfNeeded();
  //drawAreaObjects();
  
}

function draw() {
  // Move player towards target.
  if (ready){
    playerLocomotion();
    drawAreaObjects();
    drawPlayer();
  }
  textSize(26);
  strokeWeight(4);
  stroke(0); fill(255);
  text(`area ${currentArea.x},${currentArea.y}`,64,20);
  text(`world seed ${worldSeed}`,
       width-170,height-20);
}