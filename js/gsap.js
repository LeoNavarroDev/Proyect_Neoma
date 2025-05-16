// Animaciones de scroll para NEOMA
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lenis para scroll suave
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
  });
  
  // Integración de Lenis con GSAP
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Registramos el plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // ----- ANIMACIONES HERO -----
  gsap.from('.hero_title1', {
    x: -200,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
  });

  gsap.from('.hero_title2', {
    x: -150,
    opacity: 0,
    duration: 1.5,
    delay: 0.3,
    ease: "power3.out"
  });

  gsap.from('.lentilla-hero', {
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out"
  });

  gsap.from('.linea-hero', {
    opacity: 0,
    duration: 2,
    ease: "power2.inOut"
  });

  // ----- SECCIÓN INTRODUCCIÓN -----
  gsap.from('.introduccion_title', {
    scrollTrigger: {
      trigger: '.introduccion',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from('.introduccion_text', {
    scrollTrigger: {
      trigger: '.introduccion',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power3.out"
  });

  gsap.from('.circle-introduccion', {
    scrollTrigger: {
      trigger: '.introduccion',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)"
  });

  // ----- SECCIÓN BENEFICIOS CLAVE -----
  gsap.from('.beneficios-clave_title', {
    scrollTrigger: {
      trigger: '.beneficios-clave',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // Animar cada beneficio con un ligero retraso entre ellos
  const beneficios = document.querySelectorAll('.gradient-border-beneficios');
  beneficios.forEach((beneficio, index) => {
    gsap.from(beneficio, {
      scrollTrigger: {
        trigger: '.tabla-beneficios',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 70,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: "power2.out"
    });
  });

  // ----- SECCIÓN ETAPAS -----
  gsap.from('.etapas_title', {
    scrollTrigger: {
      trigger: '.etapas',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // Animar cada etapa
  const etapasContainers = document.querySelectorAll('.etapas-container');
  etapasContainers.forEach((etapa, index) => {
    // Animar nombre de etapa
    gsap.from(etapa.querySelector('.etapa-name'), {
      scrollTrigger: {
        trigger: etapa,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // Animar círculo decorativo
    gsap.from(etapa.querySelector('.circle-etapa'), {
      scrollTrigger: {
        trigger: etapa,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      duration: 1,
      delay: 0.2,
      ease: "elastic.out(1, 0.5)"
    });

    // Animar descripciones con ligero retraso
    const descriptions = etapa.querySelectorAll('.gradient-border-wrapper');
    descriptions.forEach((desc, descIndex) => {
      gsap.from(desc, {
        scrollTrigger: {
          trigger: etapa,
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 0.7,
        delay: 0.3 + (descIndex * 0.2),
        ease: "power3.out"
      });
    });
  });

  // ----- SECCIÓN HARDWARE -----
  gsap.from('.hardware_title', {
    scrollTrigger: {
      trigger: '.hardware',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // Animar cada componente de hardware
  const componentesHardware = document.querySelectorAll('.list-componentes div');
  componentesHardware.forEach((componente, index) => {
    gsap.from(componente, {
      scrollTrigger: {
        trigger: '.list-componentes',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: index % 2 === 0 ? -50 : 50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.2,
      ease: "power2.out"
    });
  });

  // Añadir efecto de parallax a elementos decorativos
  gsap.to('.circle_decore', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    },
    rotation: '+=45',
    ease: "none"
  });
});