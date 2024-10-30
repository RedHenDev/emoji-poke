let currentArea = { x: 0, y: 0 };
let worldAreas = new Map();
let areaImages = new Map(); 
// Store rendered images of areas.

// Modified GameObject class 
// to include render order.
class GameObject {
  constructor(x, y, emoji, size,
               renderOrder = 0, solid = false) {
    this.x = x;
    this.y = y;
    this.emoji = emoji;
    this.size = size;
    this.renderOrder = renderOrder;
    this.solid = solid;
  }
}

class NoiseGenerator {
  constructor(seed) {
    this.seed = seed === 
      0 ? 1000 : seed;
    this.index = 0;
  }
  
  next() {
    this.index++;
    return abs(sin(this.seed *
                   this.index));
  }
  
  nextRange(min, max) {
    return min + this.next() * 
      (max - min);
  }
  
  nextInt(min, max) {
    return floor(
      this.nextRange(min, max + 1));
  }
  
  nextBool(probability = 0.5) {
    return this.next() < probability;
  }
}

// Worldseed formally 1637.
function generateSeedForArea(x, y) {
  const offsetX = x + 10000;
  const offsetY = y + 10000;
  return abs(sin(offsetX * worldSeed +
                 offsetY * 2621) *
             10000) + 1;
}

function renderAreaToImage(objects) {
  // Create an off-screen buffer.
  let buffer = 
      createGraphics(width, height);
  buffer.textAlign(CENTER, CENTER);
  buffer.background(0,156,0);
  
  // Draw all objects to the buffer.
  for (let obj of objects) {
    buffer.textSize(obj.size);
    buffer.text(obj.emoji, 
                obj.x, obj.y);
  }
  
  return buffer;
}

function generateAreaIfNeeded() {
  generateArea(currentArea.x,
               currentArea.y);
  cleanupDistantAreas();
}

function drawAreaObjects() {
  let key =
  `${currentArea.x},${currentArea.y}`;
  let areaImage = areaImages.get(key);
  
  if (areaImage) {
    // Draw the pre-rendered area.
    image(areaImage, 0, 0);
  }
}

// Memory management - remove 
// far away areas.
function cleanupDistantAreas() {
  for (let [key, value] of 
       worldAreas) {
    let [x, y] =
        key.split(',').map(Number);
    let distance = 
        abs(x - currentArea.x) + 
        abs(y - currentArea.y);
    
    if (distance > 5) { 
      // Remove areas more 
      // than 5 screens away.
      worldAreas.delete(key);
      areaImages.get(key).remove(); 
      // Clean up the graphics buffer.
      areaImages.delete(key);
    }
  }
}