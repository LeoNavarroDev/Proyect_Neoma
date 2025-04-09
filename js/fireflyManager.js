// fireflyManager.js - Clase para gestionar las luciérnagas

class FireflyManager {
    constructor(scene, colorRosa, colorMorado) {
      this.scene = scene;
      this.colorRosa = colorRosa;
      this.colorMorado = colorMorado;
      this.fireflyCount = 1000;
      this.fireflies = [];
      this.fireflyTexture = this.createFireflyTexture();
      this.fireflyMaterial = new THREE.SpriteMaterial({
        map: this.fireflyTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });
      // Agregar una referencia a la cámara
      this.camera = null;
    }
    
    // Método para establecer la referencia a la cámara
    setCamera(camera) {
      this.camera = camera;
    }
    
    createFireflyTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    }
    
    createFireflies() {
      // Limpiar luciérnagas anteriores si existen
      this.fireflies.forEach(f => this.scene.remove(f.sprite));
      this.fireflies.length = 0;
      
      // Constantes para los paneles (podrían pasarse como parámetros)
      const panelCount = 9;
      const panelDepthSpacing = 500;
      
      for (let i = 0; i < this.fireflyCount; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = Math.random() * (panelCount * panelDepthSpacing * -1.5);
        
        const sprite = new THREE.Sprite(this.fireflyMaterial.clone());
        sprite.position.set(x, y, z);
        const baseSize = Math.random() * 4 + 4;
        sprite.scale.set(baseSize, baseSize, 1);
        
        const colorMix = Math.random();
        sprite.material.color = new THREE.Color().lerpColors(this.colorRosa, this.colorMorado, colorMix);
        
        this.fireflies.push({
          sprite: sprite,
          baseSize: baseSize,
          flickerSpeed: 0.5 + Math.random() * 2,
          flickerIntensity: 0.2 + Math.random() * 0.4,
          flickerPhase: Math.random() * Math.PI * 2,
          moveSpeed: {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
          },
          initialPosition: { x, y, z }
        });
        this.scene.add(sprite);
      }
    }
    
    update(time) {
      // Verificar que tenemos una referencia a la cámara
      if (!this.camera) return;
      
      this.fireflies.forEach((firefly, i) => {
        const { sprite, baseSize, flickerSpeed, flickerIntensity, flickerPhase, moveSpeed, initialPosition } = firefly;
        const flicker = 1.0 + Math.sin(time * flickerSpeed + flickerPhase) * flickerIntensity;
        sprite.scale.set(baseSize * flicker, baseSize * flicker, 1);
        
        sprite.position.x += moveSpeed.x * Math.sin(time * 0.5 + i);
        sprite.position.y += moveSpeed.y * Math.cos(time * 0.3 + i);
        sprite.position.z += moveSpeed.z * Math.sin(time * 0.7 + i);
        
        if (Math.abs(sprite.position.x - initialPosition.x) > 50) moveSpeed.x *= -1;
        if (Math.abs(sprite.position.y - initialPosition.y) > 50) moveSpeed.y *= -1;
        if (Math.abs(sprite.position.z - initialPosition.z) > 50) moveSpeed.z *= -1;
        
        // Cambiar la opacidad según la distancia a la cámara
        // Ahora usamos this.camera en lugar de la variable global camera
        const distance = Math.abs(sprite.position.z - this.camera.position.z);
        const sizeFactor = Math.max(0.1, Math.min(1.5, 1000 / distance));
        sprite.material.opacity = Math.min(1, sizeFactor * 0.8);
      });
    }
    
    startRedirectEffect() {
      // Aumentar el brillo de las luciérnagas para el efecto de transición
      this.fireflies.forEach(firefly => {
        firefly.sprite.scale.set(firefly.baseSize * 5, firefly.baseSize * 5, 1);
        firefly.moveSpeed.x *= 5;
        firefly.moveSpeed.y *= 5;
        firefly.moveSpeed.z *= 5;
      });
    }
}