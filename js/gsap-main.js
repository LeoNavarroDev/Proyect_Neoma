// Створюємо плавний скролінг з Lenis
document.addEventListener("DOMContentLoaded", () => {
  // Ініціалізуємо Lenis для плавного скролінгу
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  });

  // Інтеграція Lenis з requestAnimationFrame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Інтеграція з GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Реєструємо плагін для можливості використовувати 'scrollTrigger'
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // Налаштування для aboutUs секції
  const aboutUsAnimation = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutUs',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    });

    tl.fromTo('.aboutUs h1', 
      { 
        opacity: 0, 
        scale: 1.2, 
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%, 0 100%, 100% 100%, 100% 100%, 0 100%)' 
      },
      { 
        opacity: 1, 
        scale: 1, 
        clipPath: 'polygon(0 37%, 100% 37%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 60%, 0 60%)',
        duration: 1
      }
    );
    
    tl.fromTo('.aboutUs h3', 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: -100,
        duration: 0.7
      }, 
      '-=0.3'
    );
    
    // Паралакс ефект
    gsap.to('.aboutUs', {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.aboutUs',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  };

  // Налаштування для porque секції
  const porqueAnimation = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.porque',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
      }
    });
    
    // Анімація для "POR"
    tl.fromTo('.por', 
      { 
        x: -200, 
        opacity: 0,
        rotateZ: -10
      },
      { 
        x: 0, 
        opacity: 1,
        rotateZ: 0,
        duration: 0.8
      }
    );
    
    // Анімація для "QUE"
    tl.fromTo('.que', 
      { 
        x: -200, 
        opacity: 0,
        rotateZ: 10
      },
      { 
        x: 0, 
        opacity: 1,
        rotateZ: 0,
        duration: 0.8
      }, 
      '-=0.6'
    );
    
    // Анімація для логотипу
    tl.fromTo('.porque .logo', 
      { 
        scale: 0.5, 
        opacity: 0,
        rotate: -15
      },
      { 
        scale: 1, 
        opacity: 1,
        rotate: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)"
      }, 
      '-=0.8'
    );
    
    // Додаємо плаваючий ефект для логотипу
    gsap.to('.porque .logo', {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  };

  // Налаштування для paraque секції
  const paraqueAnimation = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.paraque',
        start: 'top bottom',
        end: 'center center',
        scrub: 1.5
      }
    });
    
    // Анімація для першого "PARA"
    tl.fromTo('.paraque h1:first-child', 
      { 
        x: -300, 
        opacity: 0
      },
      { 
        x: 0, 
        opacity: 1,
        duration: 0.8
      }
    );
    
    // Анімація для "NEOMA"
    tl.fromTo('.paraque h2', 
      { 
        scale: 1.5, 
        opacity: 0,
        filter: 'blur(10px)'
      },
      { 
        scale: 1, 
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1
      }, 
      '-=0.5'
    );
    
    // Анімація для другого "QUE"
    tl.fromTo('.paraque h1:last-child', 
      { 
        x: 300, 
        opacity: 0
      },
      { 
        x: 0, 
        opacity: 1,
        duration: 0.8
      }, 
      '-=0.7'
    );
    
    // Додаємо пульсуючий ефект для заголовка NEOMA
    gsap.to('.paraque h2', {
      backgroundPosition: '400% 0',
      duration: 8,
      repeat: -1,
      ease: "linear"
    });
  };

  // Налаштування для como-funcciona секції
  const comoFunccionaAnimation = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.como-funcciona',
        start: 'top bottom',
        end: 'center center',
        scrub: 1.2
      }
    });
    
    // Анімація для "ASI"
    tl.fromTo('.como-funcciona h2', 
      { 
        rotate: -120, 
        opacity: 0,
        x: -100
      },
      { 
        rotate: -90, 
        opacity: 1,
        x: 0,
        duration: 1
      }
    );
    
    // Анімація для "FUNCION"
    tl.fromTo('.como-funcciona h4', 
      { 
        y: 100, 
        opacity: 0
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 0.7
      }, 
      '-=0.8'
    );
    
    // Анімація для "NEOM"
    tl.fromTo('.como-funcciona h3', 
      { 
        y: 100, 
        opacity: 0
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 0.7
      }, 
      '-=0.5'
    );
    
    // Анімація для "A"
    tl.fromTo('.como-funcciona h1', 
      { 
        scale: 3, 
        opacity: 0,
        filter: 'blur(15px)'
      },
      { 
        scale: 1, 
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2
      }, 
      '-=0.5'
    );
    
    // Додаємо анімацію градієнта
    gsap.to('.como-funcciona h1, .como-funcciona h2', {
      backgroundPosition: '400% 0',
      duration: 10,
      repeat: -1,
      ease: "linear"
    });
  };

  // Анімація для header (щоб плавно зникав при скролінгу)
  const headerAnimation = () => {
    gsap.to('.heroe-text', {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: 'header',
        start: 'top top',
        end: 'bottom 20%',
        scrub: true
      }
    });
  };

  // Запускаємо всі анімації
  aboutUsAnimation();
  porqueAnimation();
  paraqueAnimation();
  comoFunccionaAnimation();
  headerAnimation();

  // Додаємо анімацію при завантаженні сторінки для header
  gsap.fromTo(
    '.heroe-text', 
    { 
      opacity: 0, 
      y: 50 
    }, 
    { 
      opacity: 0.8, 
      y: 0,
      duration: 1.5,
      delay: 0.5,
      ease: "power2.out" 
    }
  );

  // Перевіряємо, чи є елемент з секцією в URL
  const hash = window.location.hash;
  if (hash) {
    const targetSection = document.querySelector(hash);
    if (targetSection) {
      // Затримка для завантаження сторінки
      setTimeout(() => {
        lenis.scrollTo(targetSection);
      }, 500);
    }
  }
});

// Додаємо анімацію для пунктів меню
document.querySelectorAll('.menu-item').forEach(item => {
  const sectionTarget = item.getAttribute('data-section');
  
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetElement = document.querySelector(sectionTarget);
    if (targetElement) {
      // Закриваємо меню перед скролом
      document.querySelector('.fullscreen-menu').classList.remove('active');
      
      // Скролимо до секції
      lenis.scrollTo(targetElement);
    }
  });
  
  // Анімація при наведенні
  item.addEventListener('mouseenter', () => {
    gsap.to(item.querySelector('.menu-title'), {
      x: 15,
      duration: 0.3,
      ease: "power2.out"
    });
    
    gsap.to(item.querySelector('.menu-number'), {
      color: '#9b4fa8',
      duration: 0.3
    });
  });
  
  item.addEventListener('mouseleave', () => {
    gsap.to(item.querySelector('.menu-title'), {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    
    gsap.to(item.querySelector('.menu-number'), {
      color: 'white',
      duration: 0.3
    });
  });
});

// Додаємо вхідні анімації для елементів при скролі
gsap.utils.toArray('section').forEach(section => {
  gsap.fromTo(
    section, 
    { 
      opacity: 0,
      y: 50
    }, 
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1,
        once: true
      }
    }
  );
});