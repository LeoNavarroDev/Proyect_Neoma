// textPanelManager.js - Клас для керування текстовими панелями

class TextPanelManager {
    constructor(scene) {
      this.scene = scene;
      this.textPanels = [];
      this.panelCount = 9;
      this.panelDepthSpacing = 500;
      
      // Тексти для панелей
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
    
    // Отримання сімейства шрифтів для тексту
    getFontFamily(index) {
      return (index === 1 || index === 2) ? 'ZENTRY' : 'Roobert-Regular';
    }
    
    // Створення текстової текстури
    createTextTexture(text, isTitle) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Підвищений множник для чіткості
      const ratio = window.devicePixelRatio * 10;
  
      const fontSize = isTitle ? 32 : 18;
      const lineHeight = fontSize * 1.4;
      const maxWidth = 350;
  
      // Встановлюємо шрифт: якщо isTitle – Georgia, інакше – Arial
      const chosenFont = isTitle ? "Georgia" : "Arial";
      ctx.font = `${isTitle ? 'bold ' : ''}${fontSize}px ${chosenFont}`;
      
      // Розбиття тексту на рядки
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
      
      // Встановлюємо розміри canvas з урахуванням ratio
      canvas.width = maxWidth * ratio;
      canvas.height = (lines.length * lineHeight + 20) * ratio;
      
      // Масштабування для чіткості
      ctx.scale(ratio, ratio);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Повторно встановлюємо шрифт після масштабу
      ctx.font = `${isTitle ? 'bold ' : ''}${fontSize}px ${chosenFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Створення градієнта для тексту
      const gradient = ctx.createLinearGradient(0, 0, maxWidth, 0);
      gradient.addColorStop(0, isTitle ? 'rgba(255, 150, 180, 1)' : 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(1, isTitle ? 'rgba(180, 100, 255, 1)' : 'rgba(255, 255, 255, 0.95)');
      ctx.fillStyle = gradient;
      
      // Додавання glow-ефекту
      if (isTitle) {
        ctx.shadowColor = 'rgba(255, 150, 220, 0.8)';
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 7;
      }
      
      // Малювання тексту рядок за рядком
      lines.forEach((line, i) => {
        ctx.fillText(line, maxWidth / 2, (i + 0.5) * lineHeight + 10);
      });
      
      return canvas;
    }
    
    // Створення текстових панелей
    createPanels() {
      // Очищаємо попередні панелі, якщо вони є
      this.textPanels.forEach(p => this.scene.remove(p.mesh));
      this.textPanels.length = 0;
      
      for (let i = 0; i < this.panelCount; i++) {
        let x = 0;
        if (i >= 3 && i <= 6) {
          x = ((i - 3) % 2 === 0) ? -150 : 150;
        }
        
        const y = 0;
        const z = -(i * this.panelDepthSpacing);
        const isTitle = (i === 1 || i === 2 || i === 8);
        const fontFamily = this.getFontFamily(i);
        const textCanvas = this.createTextTexture(this.panelTexts[i], isTitle);
        const textTexture = new THREE.CanvasTexture(textCanvas);
        
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        
        // Обрахунок розмірів площини за розмірами canvas
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
    
    // Оновлення текстових панелей
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