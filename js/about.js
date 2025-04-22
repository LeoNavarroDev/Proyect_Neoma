


// Lente about us
new p5(function (sketch) {
  let numParticles = 1000;
  let radius;
  let innerRadius;
  let particles = [];
  let particleSize = 4;

  sketch.setup = function () {
    let container = document.getElementById("canvas-container");
    let canvas = sketch.createCanvas(
      container.clientWidth,
      container.clientHeight
    );
    canvas.parent("canvas-container");
    radius = Math.min(sketch.width, sketch.height) * 0.45;
    innerRadius = radius * 0.3;

    for (let i = 0; i < numParticles; i++) {
      let r = sketch.random(innerRadius, radius);
      let angle = sketch.random(sketch.TWO_PI);
      let x = sketch.width / 2 + r * sketch.cos(angle);
      let y = sketch.height / 2 + r * sketch.sin(angle);
      particles.push({
        x: x,
        y: y,
        vx: sketch.random(-0.3, 0.3),
        vy: sketch.random(-0.3, 0.3),
      });
    }
    sketch.noStroke();
  };

  sketch.draw = function () {
    sketch.clear();
    // Precalcula el centro de la pantalla
    let centerX = sketch.width / 2;
    let centerY = sketch.height / 2;
    let radiusSq = radius * radius;
    let innerRadiusSq = innerRadius * innerRadius;

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx * 0.2;
      p.y += p.vy * 0.2;
      let dx = p.x - centerX;
      let dy = p.y - centerY;
      let distSq = dx * dx + dy * dy;

      // Usar distancia al cuadrado en vez de sqrt para la comparación
      if (distSq > radiusSq || distSq < innerRadiusSq) {
        let newR = sketch.random(innerRadius, radius);
        let newAngle = sketch.random(sketch.TWO_PI);
        p.x = centerX + newR * sketch.cos(newAngle);
        p.y = centerY + newR * sketch.sin(newAngle);
        p.vx = sketch.random(-0.3, 0.3);
        p.vy = sketch.random(-0.3, 0.3);
        // Actualizar dx, dy y distSq después de reubicar la partícula
        dx = p.x - centerX;
        dy = p.y - centerY;
        distSq = dx * dx + dy * dy;
      }

      // Para el cálculo del ángulo, se requiere la raíz cuadrada, así que se calcula una vez
      let currentAngle = sketch.atan2(dy, dx);
      if (currentAngle < 0) currentAngle += sketch.TWO_PI;
      let angleFactor = 0.5 * (1 - sketch.cos(currentAngle));

      // Se calculan los colores (puedes predefinir "rosa" y "morado" si no cambian)
      let rosa = sketch.color(255, 150, 180);
      let morado = sketch.color(180, 100, 255);
      let mixedColor = sketch.lerpColor(rosa, morado, angleFactor);

      // Se utiliza sqrt() una sola vez para el factor de distancia
      let distFromCenter = sketch.sqrt(distSq);
      let distFactor = (distFromCenter - innerRadius) / (radius - innerRadius);
      let finalColor = sketch.lerpColor(
        sketch.color(255),
        mixedColor,
        distFactor
      );
      sketch.fill(finalColor);
      sketch.ellipse(p.x, p.y, particleSize, particleSize);
    }
  };

  sketch.windowResized = function () {
    let container = document.getElementById("canvas-container");
    sketch.resizeCanvas(container.clientWidth, container.clientHeight);
    radius = Math.min(sketch.width, sketch.height) * 0.45;
    innerRadius = radius * 0.3;
  };
});

// se realiza las letras movibles
const letters = document.querySelectorAll('.draggable');
const positions = [];

// Guardar posición original
letters.forEach((el, i) => {
  const rect = el.getBoundingClientRect();
  positions[i] = { x: rect.left, y: rect.top };
});

// Posicionar cada letra animadamente desde fuera del viewport
letters.forEach((el, i) => {
  gsap.fromTo(el, 
    { x: -window.innerWidth, opacity: 0 },
    { 
      x: 0, 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      delay: i * 0.15,
      onComplete: () => {
        const rect = el.getBoundingClientRect();
        el.dataset.x = 0;
        el.dataset.y = 0;
        positions[i] = { x: rect.left, y: rect.top };
      }
    }
  );
});

// Hacer que las letras sean arrastrables
interact('.draggable').draggable({
  inertia: true,
  listeners: {
    move(event) {
      let target = event.target;
      let x = (parseFloat(target.dataset.x) || 0) + event.dx;
      let y = (parseFloat(target.dataset.y) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.dataset.x = x;
      target.dataset.y = y;
    },
    end(event) {
      // Al soltar, volver a la posición original después de un segundo
      const index = [...letters].indexOf(event.target);
      gsap.to(event.target, {
        x: 0,
        y: 0,
        duration: 10,
        ease: "power.out",
        onUpdate: function () {
          event.target.dataset.x = 0;
          event.target.dataset.y = 0;
          event.target.style.transform = `translate(0px, 0px)`;
        }
      });
    }
  }
});
