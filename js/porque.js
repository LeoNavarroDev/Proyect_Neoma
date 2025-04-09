// porque.js - Archivo principal, inicializa todo y coordina el trabajo

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de Lenis para scroll suave
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1
    });
    
    // Variables para controlar el scroll y la animación
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    let scrollPosition = 0;
    let targetCameraZ = 0;
    let currentPanelIndex = 0;
    let redirectTriggered = false;
    let redirectAnimationStarted = false;
    const redirectURL = "first.html"; // URL de destino
    
    // Inicialización de ThreeJS
    const { scene, camera, renderer, clock } = ThreeJSManager.init();
    document.body.appendChild(renderer.domElement);
    
    // Colores base
    const colorRosa = new THREE.Color(255 / 255, 150 / 255, 180 / 255);
    const colorMorado = new THREE.Color(180 / 255, 100 / 255, 255 / 255);
    
    // Inicialización de fireflies
    const fireflyManager = new FireflyManager(scene, colorRosa, colorMorado);
    // Pasar la referencia de la cámara al FireflyManager
    fireflyManager.setCamera(camera);
    
    // Inicialización de paneles de texto
    const textPanelManager = new TextPanelManager(scene);
    
    // Ciclo principal de animación
    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      fireflyManager.update(time);
      
      // Actualización de la cámara
      updateCamera(time);
      updateProgressBar();
      
      camera.position.x += (Math.sin(time * 0.1) * 30 - camera.position.x) * 0.01;
      camera.position.y += (Math.cos(time * 0.15) * 20 - camera.position.y) * 0.01;
      camera.lookAt(0, 0, camera.position.z - 400);
      
      renderer.render(scene, camera);
    };
    
    // Función de actualización de la cámara
    const updateCamera = (time) => {
      const scrollRatio = scrollPosition / maxScroll;
      const targetIndex = Math.floor(scrollRatio * textPanelManager.panelCount);
      const panelProgress = (scrollRatio * textPanelManager.panelCount) % 1;
      
      if (targetIndex !== currentPanelIndex && targetIndex < textPanelManager.panelCount) {
        currentPanelIndex = targetIndex;
      }
      
      const currentPanel = textPanelManager.textPanels[currentPanelIndex];
      const nextPanel = textPanelManager.textPanels[Math.min(currentPanelIndex + 1, textPanelManager.panelCount - 1)];
      
      if (currentPanel && nextPanel) {
        const targetZ = currentPanel.position.z + (nextPanel.position.z - currentPanel.position.z) * panelProgress;
        targetCameraZ = targetZ + 200;
        camera.position.z += (targetCameraZ - camera.position.z) * 0.1;
      }
      
      textPanelManager.update(time, camera.position.z);
    };
    
    // Actualización de la barra de progreso y verificación de finalización
    const updateProgressBar = () => {
      const progressBar = document.getElementById('progressBar');
      const scrollRatio = scrollPosition / maxScroll;
      
      // Actualización de la barra de progreso
      progressBar.style.height = (scrollRatio * 100) + '%';
      
      // Verificación de finalización
      const lastPanelIndex = textPanelManager.panelCount - 1;
      
      if (currentPanelIndex === lastPanelIndex && scrollRatio > 0.97 && !redirectTriggered) {
        redirectTriggered = true;
        startRedirectAnimation();
      }
    };
    
    // Función para iniciar la animación de transición
    const startRedirectAnimation = () => {
      if (redirectAnimationStarted) return;
      
      redirectAnimationStarted = true;
      const overlay = document.getElementById('transitionOverlay');
      overlay.classList.add('active');
      
      // Aumentamos el brillo de las luciérnagas y la velocidad del movimiento
      fireflyManager.startRedirectEffect();
      
      // Redirección después del desvanecimiento
      setTimeout(() => {
        window.location.href = redirectURL;
      }, 1500);
    };
    
    // Manejadores de eventos
    window.addEventListener('scroll', () => {
      scrollPosition = window.scrollY;
    });
    
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Esperar a que se carguen las fuentes antes de inicializar
    document.fonts.ready.then(() => {
      textPanelManager.createPanels();
      fireflyManager.createFireflies();
      animate();
    });
});