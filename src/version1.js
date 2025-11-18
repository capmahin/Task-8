class Version1Naive {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.cubes = [];
        this.clock = new THREE.Clock();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
        
        this.init();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 25;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth || window.innerWidth, this.container.clientHeight || window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Create 300 individual cubes (15x20 grid)
        this.createCubesGrid(15, 20);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createCubesGrid(rows, cols) {
        const spacing = 2;
        const startX = -(cols - 1) * spacing * 0.5;
        const startY = -(rows - 1) * spacing * 0.5;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // Create individual geometry and material for each cube
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshPhongMaterial({ 
                    color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
                    shininess: 30
                });
                
                const cube = new THREE.Mesh(geometry, material);
                
                // Position each cube
                cube.position.x = startX + j * spacing;
                cube.position.y = startY + i * spacing;
                cube.position.z = (Math.sin(i * 0.5) + Math.cos(j * 0.5)) * 2;
                
                // Store original position for animation
                cube.userData.originalY = cube.position.y;
                cube.userData.originalZ = cube.position.z;
                cube.userData.offset = Math.random() * Math.PI * 2;
                
                this.scene.add(cube);
                this.cubes.push(cube);
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update FPS counter
        this.frameCount++;
        if (time - this.lastFpsUpdate >= 0.5) {
            this.fps = Math.round(this.frameCount / (time - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = time;
        }
        
        // Animate each cube individually
        this.cubes.forEach((cube, index) => {
            // Rotation animation
            cube.rotation.x += delta * 0.5;
            cube.rotation.y += delta * 0.3;
            
            // Bouncing animation
            const row = Math.floor(index / 20);
            const col = index % 20;
            cube.position.y = cube.userData.originalY + Math.sin(time * 2 + cube.userData.offset) * 0.5;
            cube.position.z = cube.userData.originalZ + Math.sin(time * 1.5 + row * 0.3 + col * 0.2) * 1;
        });
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        // Update camera aspect ratio and projection matrix
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    getFPS() {
        return this.fps;
    }

    getObjectCount() {
        return this.cubes.length;
    }

    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.renderer) {
            // Check if the renderer's DOM element is actually a child before removing
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
            this.renderer.dispose();
        }
        
        // Dispose of all geometries and materials
        this.cubes.forEach(cube => {
            cube.geometry.dispose();
            cube.material.dispose();
        });
        
        this.cubes = [];
    }
}