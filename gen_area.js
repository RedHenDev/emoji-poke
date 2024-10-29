// Global so that we can display this etc.
let key;
function generateArea(areaX, areaY) {
  // txtSize used to scale objects.
  let txtSize=player.size;
  moving = false;
  key = `${areaX},${areaY}`;
  
  if (!worldAreas.has(key) || 
      key!=='0,0') {
    let objects = [];
    let baseSeed = generateSeedForArea(areaX, areaY);
    let noise = new NoiseGenerator(baseSeed);
    
    let treeNoise = new NoiseGenerator(baseSeed * 1.1);
    let flowerNoise = new NoiseGenerator(baseSeed * 1.2);
    let mushroomNoise = new NoiseGenerator(baseSeed * 1.3);
    
    let humidity = noise.nextRange(0, 1);
    let elevation = noise.nextRange(0, 1);
    
    // Define render order constants.
    const RENDER_ORDER = {
      PATH: 0,
      GROUND_DECORATION: 1,  // flowers, mushrooms
      TREE: 2
    };
    
    // Generate paths first (moved from bottom).
    if (noise.nextBool(0.6)) {
      let pathType = noise.nextInt(0, 1);
      let pathNoise = new NoiseGenerator(baseSeed * 1.4);
      
      if (pathType === 0) {
        let baseY = pathNoise.nextRange(height * 0.3, height * 0.7);
        let phase = pathNoise.nextRange(0, TWO_PI);
        for (let x = 0; x < width; x += 15) {
          let yOffset = sin(x * 0.015 + phase) * 30 + 
                       sin(x * 0.03 + phase * 2) * 15;
          objects.push(new GameObject(
            x,
            baseY + yOffset,
            'o',
            txtSize,
            RENDER_ORDER.PATH
          ));
          
          if (pathNoise.nextBool(0.1)) {
            objects.push(new GameObject(
              x + pathNoise.nextRange(-10, 10),
              baseY + yOffset + pathNoise.nextRange(-15, 15),
              '🌸',
              txtSize * 0.4,
              RENDER_ORDER.GROUND_DECORATION
            ));
          }
        }
      } else {
        let baseX = pathNoise.nextRange(width * 0.3, width * 0.7);
        let phase = pathNoise.nextRange(0, TWO_PI);
        for (let y = 0; y < height; y += 15) {
          let xOffset = sin(y * 0.015 + phase) * 30 + 
                       sin(y * 0.03 + phase * 2) * 15;
          objects.push(new GameObject(
            baseX + xOffset,
            y,
            '⬜',
            txtSize,
            RENDER_ORDER.PATH
          ));
          
          if (pathNoise.nextBool(0.1)) {
            objects.push(new GameObject(
              baseX + xOffset + pathNoise.nextRange(-15, 15),
              y + pathNoise.nextRange(-10, 10),
              '🌸',
              txtSize * 0.4,
              RENDER_ORDER.GROUND_DECORATION
            ));
          }
        }
      }
    }
    
    // Generate flower patches.
    const numFlowerPatches = flowerNoise.nextInt(3, 6);
    for (let patch = 0; patch < numFlowerPatches; patch++) {
      let patchX = flowerNoise.nextRange(50, width - 50);
      let patchY = flowerNoise.nextRange(50, height - 50);
      let patchSize = flowerNoise.nextInt(3, 8);
      
      for (let i = 0; i < patchSize; i++) {
        let radius = flowerNoise.nextRange(10, 40);
        let angle = flowerNoise.nextRange(0, TWO_PI);
        let flowerX = patchX + cos(angle) * radius;
        let flowerY = patchY + sin(angle) * radius;
        
        if (humidity > 0.3) {
          objects.push(new GameObject(
            flowerX,
            flowerY,
            '🌸',
            txtSize * (0.5 + flowerNoise.nextRange(-0.1, 0.1)),
            RENDER_ORDER.GROUND_DECORATION
          ));
        }
      }
    }
    
    // Generate mushroom circles
    if (humidity > 0.5) {
      const numMushroomCircles = mushroomNoise.nextInt(2, 4);
      for (let circle = 0; circle < numMushroomCircles; circle++) {
        let centerX = mushroomNoise.nextRange(50, width - 50);
        let centerY = mushroomNoise.nextRange(50, height - 50);
        let numMushrooms = mushroomNoise.nextInt(4, 8);
        
        for (let i = 0; i < numMushrooms; i++) {
          let angle = (TWO_PI / numMushrooms) * i;
          let radius = mushroomNoise.nextRange(15, 25);
          let mushroomX = centerX + cos(angle) * radius;
          let mushroomY = centerY + sin(angle) * radius;
          
          objects.push(new GameObject(
            mushroomX,
            mushroomY,
            '🍄',
            txtSize * (0.5 + mushroomNoise.nextRange(-0.1, 0.1)),
            RENDER_ORDER.GROUND_DECORATION
          ));
        }
      }
    }
    
    // Generate tree clusters last
    const numClusters = treeNoise.nextInt(2, 4);
    for (let cluster = 0; cluster < numClusters; cluster++) {
      let clusterX = treeNoise.nextRange(50, width - 50);
      let clusterY = treeNoise.nextRange(50, height - 50);
      let clusterSize = treeNoise.nextInt(4, 8);
      
      for (let i = 0; i < clusterSize; i++) {
        let angle = treeNoise.nextRange(0, TWO_PI);
        let radius = treeNoise.nextRange(10, 40);
        let treeX = clusterX + cos(angle) * radius;
        let treeY = clusterY + sin(angle) * radius;
        
        let treeSize = txtSize * (1.2 + treeNoise.nextRange(-0.2, 0.2));
        
        objects.push(new GameObject(
          treeX,
          treeY,
          '🌳',
          treeSize,
          RENDER_ORDER.TREE
        ));
      }
      
      let scatteredTrees = treeNoise.nextInt(2, 4);
      for (let i = 0; i < scatteredTrees; i++) {
        let angle = treeNoise.nextRange(0, TWO_PI);
        let radius = treeNoise.nextRange(45, 70);
        let treeX = clusterX + cos(angle) * radius;
        let treeY = clusterY + sin(angle) * radius;
        
        if (treeX > 0 && treeX < width && treeY > 0 && treeY < height) {
          objects.push(new GameObject(
            treeX,
            treeY,
            '🌳',
            txtSize * (1 + treeNoise.nextRange(-0.2, 0.2)),
            RENDER_ORDER.TREE
          ));
        }
      }
    }
    
    // Sort objects by render order before storing
    objects.sort((a, b) => a.renderOrder - b.renderOrder);
    
    worldAreas.set(key, objects);
    let areaImage = renderAreaToImage(objects);
    areaImages.set(key, areaImage);
  }
  // Render already created
  // area.
 let objects = worldAreas.get(key);
 let areaImage = renderAreaToImage(objects);
   areaImages.set(key, areaImage);
}

