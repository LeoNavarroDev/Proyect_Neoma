// lenis.js
const lenis = new Lenis({
    autoRaf: true,
  });


  
  const colorA = new THREE.Color(0x950599); // purpura
  const colorB = new THREE.Color(0x0150D8); // azul

  // Inicializa Vanta.RINGS
  const effect = VANTA.RINGS({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: "#00001c" // fondo muy oscuro
  });

  // Velocidad de mezcla
  const speed = 0.7;

  // Bucle propio para animar colores
  (function animateColors() {
    requestAnimationFrame(animateColors);
    const t0 = performance.now() * 0.001 * speed;
    effect.rings.forEach((ring, i) => {
      // mix variable oscilante entre 0 y 1
      const mix = (Math.sin(t0 + i * 0.6) + 1) / 2;
      // interpolamos purpura↔azul
      const c = colorA.clone().lerp(colorB, mix);
      ring.material.color.copy(c);
    });
  })();