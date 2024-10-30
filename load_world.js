// Function to load world data from a specific file in the same directory
async function loadWorldDataFromFile(filename = 'world_data.txt') {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load file: ${response.statusText}`);
        }
        
        const fileContent = await response.text();
        return loadWorldData(fileContent);
    } catch (error) {
        console.error('Error loading world data file:', error);
        return false;
    }
}

// You can call this in your initialization code or setup function
async function initializeWorld() {
    const success = await loadWorldDataFromFile();
    if (success) {
        console.log('World data loaded successfully');
    } else {
        console.error('Failed to load world data');
    }
}

// Call during setup or when the application starts
//initializeWorld();

// Function to load world data from a text file
function loadWorldData(fileContent) {
    try {
        // Clear existing world data
        worldAreas.clear();
        
        let currentLoadingArea = null;
        let currentObjects = [];
        
        // Split content into lines and process each line
        const lines = fileContent.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            
            // Skip empty lines
            if (!line) {
                if (currentLoadingArea && currentObjects.length > 0) {
                    // Save current area objects before moving to next area
                    const areaKey = `${currentLoadingArea.x},${currentLoadingArea.y}`;
                    worldAreas.set(areaKey, currentObjects);
                    currentObjects = [];
                }
                continue;
            }
            
            // Check if line is an area header
            if (line.startsWith('Area')) {
                // Parse area coordinates (format: "Area x,y:")
                const match = line.match(/Area (-?\d+),(-?\d+):/);
                if (match) {
                    // Save previous area objects if they exist
                    if (currentLoadingArea && currentObjects.length > 0) {
                        const areaKey = `${currentLoadingArea.x},${currentLoadingArea.y}`;
                        worldAreas.set(areaKey, currentObjects);
                        currentObjects = [];
                    }
                    
                    // Set new current area
                    currentLoadingArea = {
                        x: parseInt(match[1]),
                        y: parseInt(match[2])
                    };
                }
            } else {
                // Take square size of smallest.
                let w = windowWidth >
                windowHeight ? 
                windowHeight :
                windowWidth;
                // Parse object data (format: "x,y,emoji,size,renderOrder,solid").
                // NB 6 parts at time of writing (solid is last).
                const parts = line.split(',');
                if (parts.length >= 6 && currentLoadingArea) {
                    const gameObject = new GameObject(
                        // Map x and y to current window size, w.
                        map(parseFloat(parts[0]),0,800,0,w),  // x
                        map(parseFloat(parts[1]),0,800,0,w),  // y
                        parts[2],              // emoji
                        parseFloat(parts[3]),  // size
                        parseInt(parts[4]),     // renderOrder
                        parts[5]==="1",     // solid
                    );
                    currentObjects.push(gameObject);
                }
            }
        }
        
        // Save last area if it exists.
        if (currentLoadingArea && currentObjects.length > 0) {
            const areaKey = `${currentLoadingArea.x},${currentLoadingArea.y}`;
            worldAreas.set(areaKey, currentObjects);
        }
        
        return true;
    } catch (error) {
        console.error('Error loading world data:', error);
        return false;
    }
}