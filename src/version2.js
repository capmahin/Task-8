class Version2Optimized {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.instancedMesh = null;
        this.clock = new THREE.Clock();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
        this.instanceCount = 300;
        this.dummy = new THREE.Object3D();
        
        this.init();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene.background = new THREE.Color(0x2e1a1a);
        
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
        
        // Create instanced mesh
        this.createInstancedCubes(15, 20);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createInstancedCubes(rows, cols) {
        // Single geometry and material shared by all instances
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4CAF50,
            shininess: 30
        });
        
        // Create instanced mesh
        this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.instanceCount);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        
        const spacing = 2;
        const startX = -(cols - 1) * spacing * 0.5;
        const startY = -(rows - 1) * spacing * 0.5;
        
        // Store instance data for animation
        this.instanceData = [];
        
        // Initialize instances
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                if (index >= this.instanceCount) break;
                
                this.dummy.position.set(
                    startX + j * spacing,
                    startY + i * spacing,
                    (Math.sin(i * 0.5) + Math.cos(j * 0.5)) * 2
                );
                
                this.dummy.updateMatrix();
                this.instancedMesh.setMatrixAt(index, this.dummy.matrix);
                
                // Store animation data
                this.instanceData[index] = {
                    originalY: this.dummy.position.y,
                    originalZ: this.dummy.position.z,
                    offset: Math.random() * Math.PI * 2,
                    row: i,
                    col: j
                };
            }
        }
        
        this.scene.add(this.instancedMesh);
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
        
        // Update all instances
        for (let i = 0; i < this.instanceCount; i++) {
            const data = this.instanceData[i];
            
            this.dummy.position.x = data.col * 2 - (20 - 1);
            this.dummy.position.y = data.originalY + Math.sin(time * 2 + data.offset) * 0.5;
            this.dummy.position.z = data.originalZ + Math.sin(time * 1.5 + data.row * 0.3 + data.col * 0.2) * 1;
            
            // Rotation animation
            this.dummy.rotation.x = time * 0.5;
            this.dummy.rotation.y = time * 0.3 + data.offset;
            
            this.dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
        }
        
        this.instancedMesh.instanceMatrix.needsUpdate = true;
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
        return 1; // Single InstancedMesh object
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
        
        if (this.instancedMesh) {
            this.instancedMesh.geometry.dispose();
            this.instancedMesh.material.dispose();
        }
    }
}