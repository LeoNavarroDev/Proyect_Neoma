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
const letters = document.querySelectorAll(".draggable");
const positions = [];

// Guardar posición original
letters.forEach((el, i) => {
  const rect = el.getBoundingClientRect();
  positions[i] = { x: rect.left, y: rect.top };
});

// Posicionar cada letra animadamente desde fuera del viewport
letters.forEach((el, i) => {
  gsap.fromTo(
    el,
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
      },
    }
  );
});

// Hacer que las letras sean arrastrables
interact(".draggable").draggable({
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
        },
      });
    },
  },
});

gsap.registerPlugin(ScrollTrigger);

// Zoom progresivo mientras haces scroll
gsap.to(".heroe_section_about", {
  scale: 6,
  ease: "power1.out",

  scrollTrigger: {
    trigger: ".heroe_section_about",
    start: "top top",
    end: "+4500",
    scrub: true,
  },
});

// Fade out + scale out al final del scroll
gsap.to(".heroe_section_about", {
  opacity: 0,
  scale: 1.9,
  scrollTrigger: {
    trigger: ".heroe_section_about",
    start: "bottom bottom",
    end: "bottom top",
    scrub: true,
  },
});

// Fade in suave de la siguiente sección
gsap.to(".aboutus-description", {
  opacity: 1,

  scrollTrigger: {
    trigger: ".heroe_section_about",
    start: "bottom top",
    end: "bottom center",
    toggleActions: "play none none reverse",
  },
});

// Realizando que el canva sea arrastrable

const box = document.getElementById("lente-aboutus");

// Guarda la posición inicial
const originX = box.offsetLeft;
const originY = box.offsetTop;

let isDragging = false;
let offsetX, offsetY;
let timeout;

// Detecta el inicio del arrastre
box.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - box.offsetLeft;
  offsetY = e.clientY - box.offsetTop;
  box.style.transition = "none"; // Quita transición al arrastrar
  clearTimeout(timeout);
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;

    // Espera 10 segundos para volver al origen
    timeout = setTimeout(() => {
      box.style.transition = "transform 1s ease";
      box.style.transform = "translate(0, 0)";
      box.style.left = `${originX}px`;
      box.style.top = `${originY}px`;
    }, 10000);
  }
});

// colocando un evento en la listas desordenada

const paragraph = document.getElementById("contenido_listas_desordenadas");

// Evento al pasar el mouse sobre el párrafo
paragraph.addEventListener("mouseenter", () => {
  const letters = paragraph.querySelectorAll(".contenido_listas_desordenadas");
  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.style.animation = "bounce 0.6s ease";
    }, index * 30);

    // Elimina la animación para que se pueda volver a activar
    letter.addEventListener("animationend", () => {
      letter.style.animation = "";
    });
  });
});

// haciendo clickeable las listas desordenadas

document.addEventListener("DOMContentLoaded", () => {
  const frases = document.querySelectorAll(".clickable");

  const section = document.getElementById("imageSection");
  section.style.transition =
    "background-image 2s ease, background-size 1s ease, background-position 1s ease, background-color 1s ease";

  function cambiarImagen(imagenUrl) {
    const section = document.getElementById("imageSection");
    if (section) {
      section.style.transition =
        "background-image 1s ease, background-size 1s ease, background-position 1s ease, background-color 1s ease";

      // Primero cambiamos la imagen de fondo
      section.style.backgroundImage = `url(${imagenUrl})`;

      // Usamos setTimeout para esperar a que se cambie la imagen y luego ajustamos el tamaño
      setTimeout(() => {
        // Cambiar tamaño de la imagen para que no ocupe toda la pantalla
        section.style.backgroundSize = "cover"; // La imagen se ajusta sin recortarse
        section.style.backgroundPosition = "center"; // Centra la imagen
        section.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Fondo oscuro semitransparente
      }, 10); // El pequeño retraso asegura que la imagen se cambie primero
    }
  }

  // Evento para cada frase
  frases.forEach((frase) => {
    frase.addEventListener("click", () => {
      if (frase.id === "text1") {
        cambiarImagen("./img/mejor_vida.jpg");
      } else if (frase.id === "text2") {
        cambiarImagen("./img/pregunta_lo_que_quieras.jpg");
      } else if (frase.id === "text3") {
        cambiarImagen("./img/salud.jpg");
      } else if (frase.id === "text4") {
        cambiarImagen("./img/productividad.jpg");
      }
    });
  });
});

// Configurar el cambio de color de fondo con ScrollTrigger
ScrollTrigger.create({
  trigger: ".andreu", // La sección donde se va a activar el cambio
  start: "top center", // Cuando la parte superior de la sección llega al centro de la ventana
  onEnter: () => {
    gsap.to("body", {
      background:
        "linear-gradient(-30deg,rgb(2, 82, 66), #9b59b6,rgb(43, 96, 110),rgb(57, 171, 206), #ff9e00, #b6ff00)", // El nuevo fondo
      backgroundSize: "400% 400%", // Tamaño del gradiente
      duration: 2, // Duración de la animación
      ease: "linear", // Tipo de transición
      animation: "gradient 15s ease infinite",
    });
  },
  onLeaveBack: () => {
    gsap.to("body", {
      background: "linear-gradient(-45deg, #ffffff, #ffffff, #ffffff, #ffffff)", // Fondo original
      backgroundSize: "400% 400%",
      duration: 1,
      ease: "easeInOut",
    });
  },
});

// realizando animaciones en la section "andreu"
gsap.fromTo(
  ".style_descripciones",
  {
    x: "50%",
    opacity: 0,
  },

  {
    x: "0%",
    ease: "power2.out",
    opacity: 1,
    scrollTrigger: {
      trigger: ".style_descripciones",
      start: "top bottom", // Se activa cuando la parte inferior de la sección toca la parte inferior de la ventana
      end: "bottom center", // Termina cuando el centro del trigger toca el centro de la ventana
      scrub: true, // Hace que la animación sea progresiva con el scroll
      markers: true,
    },
  }
);

//haciendo animaciones con los divs neoma

gsap.fromTo(
  ".contenedor_2",
  {
    y: "0",
  },

  {
    y: "-80%",
    ease: "power2.out",
    opacity: 1,
    scrollTrigger: {
      trigger: ".contenedor_2",
      start: "top bottom", // Se activa cuando la parte inferior de la sección toca la parte inferior de la ventana
      end: "center center", // Termina cuando el centro del trigger toca el centro de la ventana
      scrub: true, // Hace que la animación sea progresiva con el scroll
      markers: true,
    },
  }
);

gsap.fromTo(
  ".contenedor_3",
  {
    y: "0",
  },

  {
    y: "-100%",
    ease: "power2.out",
    opacity: 1,
    scrollTrigger: {
      trigger: ".contenedor_3",
      start: "top bottom", // Se activa cuando la parte inferior de la sección toca la parte inferior de la ventana
      end: "center center", // Termina cuando el centro del trigger toca el centro de la ventana
      scrub: true, // Hace que la animación sea progresiva con el scroll
      markers: true,
    },
  }
);

gsap.fromTo(
  ".contenedor_4",
  {
    y: "0",
  },

  {
    y: "-100%",
    ease: "power2.out",
    opacity: 1,
    scrollTrigger: {
      trigger: ".contenedor_4",
      start: "top bottom", // Se activa cuando la parte inferior de la sección toca la parte inferior de la ventana
      end: "center center", // Termina cuando el centro del trigger toca el centro de la ventana
      scrub: true, // Hace que la animación sea progresiva con el scroll
      markers: true,
    },
  }
);

gsap.to(".final_section", {
  ease: power2.out,
  y: "-100%",

  scrollTrigger: {
    trigger: ".final_section",
    start: "bottom center",
    end: "bottom center",
    toggleActions: "play none none reverse",
  },
});
