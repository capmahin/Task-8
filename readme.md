# Performance Test & Optimization

This project demonstrates the performance difference between a naive implementation and an optimized implementation of rendering 300 cubes using Three.js.

## What was implemented

### Version 1 (Naive Implementation)
- Created 300 individual Mesh objects, each with its own geometry and material
- Each cube has unique position, color, and animation properties
- Higher CPU and GPU overhead due to multiple draw calls

### Version 2 (Optimized Implementation)
- Uses a single InstancedMesh with 300 instances
- Shares geometry and material across all instances
- Significantly reduced draw calls from 300 to 1
- Better GPU utilization and lower CPU overhead

### App.js
- Manages switching between Version 1 and Version 2
- Handles the comparison view showing both versions side-by-side
- Implements proper cleanup and disposal of resources when switching views
- Added DOMContentLoaded check for proper initialization
- Fixed FPS update intervals and resource management

### Index.html
- Provides UI with buttons to switch between versions
- Displays performance comparison information
- Shows FPS counters for both versions
- Responsive layout with single view and comparison view
- Properly loads Three.js from CDN and local script files

## Key Optimizations
- Fixed renderer sizing issues that prevented cubes from being visible
- Added proper window resize handling for both camera and renderer
- Implemented safe DOM element removal to prevent errors
- Improved resource disposal to prevent memory leaks
- Enhanced animation loop efficiency

## Interactive Controls
- **Rotate**: Click and drag to rotate the camera around the scene
- **Zoom**: Scroll up/down to zoom in/out
- **Pan**: Right-click and drag to pan the view
- **Smooth damping**: Natural-feeling camera movements with automatic slowing