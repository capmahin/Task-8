let currentVersion1 = null;
let currentVersion2 = null;
let comparisonVersion1 = null;
let comparisonVersion2 = null;

function switchToVersion1() {
    // Hide comparison view
    document.getElementById('comparisonView').style.display = 'none';
    document.getElementById('singleView').style.display = 'flex';
    
    // Clean up existing scenes
    if (currentVersion1) currentVersion1.dispose();
    if (currentVersion2) currentVersion2.dispose();
    
    // Clear container
    const container = document.getElementById('scene1');
    container.innerHTML = '';
    
    // Initialize Version 1
    currentVersion1 = new Version1Naive('scene1');
    
    // Update info panel
    updateInfoPanel('Version 1 - Naive', currentVersion1);
    
    // Start FPS updates
    startFPSUpdates(currentVersion1);
}

function switchToVersion2() {
    // Hide comparison view
    document.getElementById('comparisonView').style.display = 'none';
    document.getElementById('singleView').style.display = 'flex';
    
    // Clean up existing scenes
    if (currentVersion1) currentVersion1.dispose();
    if (currentVersion2) currentVersion2.dispose();
    
    // Clear container
    const container = document.getElementById('scene1');
    container.innerHTML = '';
    
    // Initialize Version 2
    currentVersion2 = new Version2Optimized('scene1');
    
    // Update info panel
    updateInfoPanel('Version 2 - Optimized', currentVersion2);
    
    // Start FPS updates
    startFPSUpdates(currentVersion2);
}

function showComparison() {
    // Show comparison view
    document.getElementById('singleView').style.display = 'none';
    document.getElementById('comparisonView').style.display = 'flex';
    
    // Clean up existing scenes
    if (currentVersion1) currentVersion1.dispose();
    if (currentVersion2) currentVersion2.dispose();
    if (comparisonVersion1) comparisonVersion1.dispose();
    if (comparisonVersion2) comparisonVersion2.dispose();
    
    // Clear containers
    document.getElementById('comparisonScene1').innerHTML = '';
    document.getElementById('comparisonScene2').innerHTML = '';
    
    // Initialize both versions for comparison
    comparisonVersion1 = new Version1Naive('comparisonScene1');
    comparisonVersion2 = new Version2Optimized('comparisonScene2');
    
    // Start FPS updates for comparison
    startComparisonFPSUpdates();
}

function updateInfoPanel(versionName, scene) {
    document.getElementById('versionInfo').textContent = `Version: ${versionName}`;
    document.getElementById('objectCount').textContent = `Objects: ${scene.getObjectCount()}`;
}

function startFPSUpdates(scene) {
    const fpsElement = document.getElementById('fpsCounter');
    const objectCountElement = document.getElementById('objectCount');
    
    const updateInterval = setInterval(() => {
        if ((scene === currentVersion1 || scene === currentVersion2) && 
            document.getElementById('comparisonView').style.display === 'none') {
            fpsElement.textContent = `FPS: ${scene.getFPS()}`;
            objectCountElement.textContent = `Objects: ${scene.getObjectCount()}`;
        } else {
            clearInterval(updateInterval);
        }
    }, 200);
}

function startComparisonFPSUpdates() {
    const fps1Element = document.getElementById('fps1');
    const fps2Element = document.getElementById('fps2');
    
    const updateInterval = setInterval(() => {
        if (document.getElementById('comparisonView').style.display === 'flex') {
            if (comparisonVersion1) {
                fps1Element.textContent = `FPS: ${comparisonVersion1.getFPS()}`;
            }
            if (comparisonVersion2) {
                fps2Element.textContent = `FPS: ${comparisonVersion2.getFPS()}`;
            }
        } else {
            clearInterval(updateInterval);
        }
    }, 200);
}

// Initialize with Version 1 by default
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', switchToVersion1);
} else {
    switchToVersion1();
}