// mouseManager.js - Clase para manejar el movimiento de cámara basado en la posición del ratón

class MouseManager {
    constructor(camera) {
      this.camera = camera;
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;
      this.lerpFactor = 0.08; // Factor de suavizado (valor más bajo = más suave)
      this.rotationFactor = 0.0005; // Factor de sensibilidad de rotación
      this.isMobile = this.checkIfMobile();
      this.lookAtVector = new THREE.Vector3(0, 0, -400);
      
      // Solo inicializar los event listeners si no es un dispositivo móvil
      if (!this.isMobile) {
        this.initEventListeners();
      }
    }
    
    // Detecta si el dispositivo es móvil
    checkIfMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Inicializa los event listeners para el movimiento del ratón
    initEventListeners() {
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    // Actualiza las coordenadas del ratón cuando se mueve
    onMouseMove(event) {
      // Normalizar las coordenadas del ratón (-1 a 1)
      this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(event.clientY / window.innerHeight) * 2;
    }
    
    // Actualiza las coordenadas del ratón cuando cambia el tamaño de la ventana
    onWindowResize() {
        // Recalcular las coordenadas del ratón basadas en la nueva dimensión de la ventana
        this.targetMouseX = (this.mouseX + 1) / 2 * window.innerWidth;
        this.targetMouseY = (-this.mouseY + 1) / 2 * window.innerHeight;
        
        // Normalizar las nuevas coordenadas
        this.targetMouseX = (this.targetMouseX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(this.targetMouseY / window.innerHeight) * 2;
    }
    
    // Actualiza la rotación de la cámara basada en la posición del ratón con suavizado
    update() {
      // No hacer nada si es un dispositivo móvil
      if (this.isMobile) return;
      
      // Aplicar interpolación lineal para un movimiento más suave
      this.mouseX += (this.targetMouseX - this.mouseX) * this.lerpFactor;
      this.mouseY += (this.targetMouseY - this.mouseY) * this.lerpFactor;
      
      // Obtener la posición actual de la cámara
      const cameraZ = this.camera.position.z;
      
      // Crear un punto de mira suave
      this.lookAtVector.x = this.mouseX * 50; // Ajusta estos valores para aumentar/disminuir el efecto
      this.lookAtVector.y = this.mouseY * 30;
      this.lookAtVector.z = cameraZ - 400; // Siempre mirando adelante
      
      // Hacer que la cámara mire hacia el punto calculado
      this.camera.lookAt(this.lookAtVector);
    }
    
    // Método para ajustar la sensibilidad del movimiento
    setSensitivity(value) {
      // Valor entre 0.01 (muy suave) y 0.2 (muy sensible)
      this.lerpFactor = Math.max(0.01, Math.min(0.2, value));
    }
  }