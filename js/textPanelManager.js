// textPanelManager.js - Clase para gestionar paneles de texto con colores originales y fuentes modificadas

class TextPanelManager {
  constructor(scene) {
    this.scene = scene;
    this.textPanels = [];
    this.panelCount = 9;
    this.panelDepthSpacing = 500;
    
    // Textos para los paneles
    this.panelTexts = [
      "Imagínate tener un amigo que siempre sabe lo que necesitas antes de que se lo pidas. Así es Neoma, el lente de contacto inteligente que te acompaña y te entiende como nadie más.",
      "La pregunta es..",
      "¿Por qué elegir Neoma?",
      "Porque Neoma conecta todos los aspectos de tu vida en un solo lugar, analizando tus datos de salud, finanzas y hábitos diarios para ofrecerte una visión completa de tu bienestar.",
      "Porque a diferencia de otras soluciones, nuestro lente no solo recopila información, sino que la transforma en predicciones personalizadas que realmente puedes usar para mejorar tu día a día.",
      "Porque cada consejo que recibes está diseñado específicamente para ti, basado en tus patrones únicos, no en estadísticas generales que poco tienen que ver con tu realidad.",
      "Porque Neoma es discreto y se integra perfectamente en tu vida, sin dispositivos adicionales que llevar encima o apps complicadas que aprender a usar.",
      "Con Neoma, no estás comprando un gadget más, estás invirtiendo en un compañero de vida que te ayudará a tomar las mejores decisiones para tu futuro, sea en el amor, las finanzas o la salud.",
      "Scroll para volver"
    ];
  }
  
  // Función para definir la familia tipográfica según el índice del panel
  getFontFamily(index) {
    // Para títulos (índices 1, 2 y 8) usamos "Bebas Neue"
    // Para textos normales, ahora usamos "Arial"
    return (index === 1 || index === 2 || index === 8 || index === 8) ? 'Bebas Neue' : 'Special Gothic Condensed One';
  }
  
  // Función para crear la textura del texto con los colores originales y efectos
  createTextTexture(text, isTitle) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Aumentamos la resolución para mayor nitidez
    const ratio = window.devicePixelRatio * 10;
    const fontSize = isTitle ? 36 : 20;
    const lineHeight = fontSize * 1.4;
    const maxWidth = 350;
    
    // Seleccionamos la fuente de acuerdo con el índice (usando getFontFamily)
    const chosenFont = this.getFontFamily(isTitle ? 1 : 0);
    ctx.font = `${isTitle ? 'bold ' : ''}${fontSize}px ${chosenFont}`;
    
    // Dividir el texto en líneas que se ajusten a ancho máximo
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Configuración de las dimensiones del canvas considerando el ratio
    canvas.width = maxWidth * ratio;
    canvas.height = (lines.length * lineHeight + 20) * ratio;
    
    // Ajustamos la escala para mayor nitidez
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reestablecer la fuente después de escalar
    ctx.font = `${isTitle ? 'bold ' : ''}${fontSize}px ${chosenFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Creación del degradado con colores originales
    const gradient = ctx.createLinearGradient(0, 0, maxWidth, 0);
    if (isTitle) {
      gradient.addColorStop(0, 'rgba(255, 150, 180, 1)');
      gradient.addColorStop(1, 'rgba(180, 100, 255, 1)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
    }
    ctx.fillStyle = gradient;
    
    // Añadimos un efecto glow con los colores originales
    if (isTitle) {
      ctx.shadowColor = 'rgba(255, 150, 220, 0.8)';
      ctx.shadowBlur = 15;
    } else {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 7;
    }
    
    // Dibujo del texto línea por línea
    lines.forEach((line, i) => {
      ctx.fillText(line, maxWidth / 2, (i + 0.5) * lineHeight + 10);
    });
    
    return canvas;
  }
  
  // Creación de los paneles de texto con su respectiva geometría y textura
  createPanels() {
    // Eliminar paneles previos si existen
    this.textPanels.forEach(p => this.scene.remove(p.mesh));
    this.textPanels.length = 0;
    
    for (let i = 0; i < this.panelCount; i++) {
      let x = 0;
      // Posicionar algunos paneles lateralmente para mayor dinamismo
      if (i >= 3 && i <= 6) {
        x = ((i - 3) % 2 === 0) ? -150 : 150;
      }
      
      const y = 0;
      const z = -(i * this.panelDepthSpacing);
      
      // Definir si es título (índices 1, 2 y 8)
      const isTitle = (i === 1 || i === 2 || i === 8);
      
      // Crear la textura del texto con el efecto deseado
      const textCanvas = this.createTextTexture(this.panelTexts[i], isTitle);
      const textTexture = new THREE.CanvasTexture(textCanvas);
      
      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      // Calcular las dimensiones del plano basadas en el tamaño del canvas
      const textAspect = textCanvas.width / textCanvas.height;
      const textWidth = 350;
      const textHeight = textWidth / textAspect;
      
      const textGeometry = new THREE.PlaneGeometry(textWidth, textHeight);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(x, y, z);
      
      this.textPanels.push({
        mesh: textMesh,
        position: { x, y, z },
        index: i
      });
      this.scene.add(textMesh);
    }
  }
  
  // Actualiza la opacidad y rotación de los paneles basándose en la posición de la cámara y el tiempo
  update(time, cameraZ) {
    this.textPanels.forEach(panel => {
      const distance = Math.abs(panel.position.z - cameraZ);
      if (distance < 500) {
        panel.mesh.material.opacity = Math.min(1, (500 - distance) / 200);
        panel.mesh.rotation.x = Math.sin(time * 0.2) * 0.05;
        panel.mesh.rotation.y = Math.sin(time * 0.3) * 0.05;
      } else {
        panel.mesh.material.opacity = 0;
      }
    });
  }
}
