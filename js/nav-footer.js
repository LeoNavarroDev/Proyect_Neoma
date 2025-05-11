// nav.js з GSAP анімаціями для меню

document.addEventListener('DOMContentLoaded', function() {
  // Елементи управління меню
  const menuBtn = document.querySelector('.menu');
  const closeBtn = document.querySelector('.close-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const body = document.body;
  
  // Створюємо меню анімацію з GSAP
  const menuOpenAnimation = gsap.timeline({ paused: true });
  
  // Анімація відкриття меню
  menuOpenAnimation
    .to('.menu-overlay', { 
      clipPath: 'circle(150% at calc(100% - 65px) 65px)', 
      duration: 0.8, 
      ease: 'power3.inOut' 
    })
    .to('.menu-logo img', { 
      opacity: 1, 
      y: 0,
      duration: 0.4, 
      ease: 'power2.out' 
    }, '-=0.4')
    .to('.close-btn span:first-child', { 
      rotate: 45, 
      scaleX: 1, 
      duration: 0.4, 
      ease: 'power2.out' 
    }, '-=0.3')
    .to('.close-btn span:last-child', { 
      rotate: -45, 
      scaleX: 1, 
      duration: 0.4, 
      ease: 'power2.out' 
    }, '-=0.4')
    .staggerTo('.menu-item', 0.4, { 
      opacity: 1, 
      x: 0, 
      ease: 'power2.out' 
    }, 0.1, '-=0.2')
    .to('.menu-footer', { 
      opacity: 1, 
      y: 0, 
      duration: 0.4, 
      ease: 'power2.out' 
    }, '-=0.2');
  
  // Анімація закриття меню
  const menuCloseAnimation = gsap.timeline({ paused: true });
  
  menuCloseAnimation
    .to('.menu-footer', { 
      opacity: 0, 
      y: 20, 
      duration: 0.3, 
      ease: 'power2.in' 
    })
    .staggerTo('.menu-item', 0.3, { 
      opacity: 0, 
      x: -30, 
      ease: 'power2.in' 
    }, 0.05, '-=0.2')
    .to('.close-btn span:first-child', { 
      scaleX: 0, 
      duration: 0.3, 
      ease: 'power2.in' 
    }, '-=0.2')
    .to('.close-btn span:last-child', { 
      scaleX: 0, 
      duration: 0.3, 
      ease: 'power2.in' 
    }, '-=0.3')
    .to('.menu-logo img', { 
      opacity: 0, 
      y: -20, 
      duration: 0.3, 
      ease: 'power2.in' 
    }, '-=0.2')
    .to('.menu-overlay', { 
      clipPath: 'circle(0% at calc(100% - 65px) 65px)', 
      duration: 0.6, 
      ease: 'power3.inOut' 
    }, '-=0.4')
    .set('.fullscreen-menu', { visibility: 'hidden' });
  
  // Клікабельна анімація для кнопки меню
  const menuButtonAnimation = gsap.timeline({ paused: true });
  menuButtonAnimation
    .to('.menu', { 
      scale: 0.9, 
      duration: 0.1, 
      ease: 'power1.out'
    })
    .to('.menu', { 
      scale: 1, 
      duration: 0.2, 
      ease: 'power1.out'
    });
  
  // Відкрити меню при кліку на іконку меню
  menuBtn.addEventListener('click', function() {
    menuButtonAnimation.restart();
    gsap.set('.fullscreen-menu', { visibility: 'visible' });
    body.classList.add('menu-active');
    menuOpenAnimation.restart();
  });
  
  // Закрити меню при кліку на кнопку закриття
  closeBtn.addEventListener('click', function() {
    body.classList.remove('menu-active');
    menuCloseAnimation.restart();
  });
  
  // Обробник для пунктів меню
  menuItems.forEach(function(item) {
  item.addEventListener('click', function() {
    // 1) якщо є data-page — переходимо на вказану сторінку
    const page = this.getAttribute('data-page');
    if (page) {
      window.location.href = page;
      return;
    }

    // 2) інакше — це внутрішній якорний скрол
    const targetSection = this.getAttribute('data-section');

    // якщо клікаємо на те, що вже у фокусі (наприклад, головна сторінка без секції) —
    // прокрутимо просто вгору
    if (!targetSection || targetSection === window.location.hash) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0 },
        ease: 'power2.inOut'
      });
    } else {
      // штатний скрол до секції
      body.classList.remove('menu-active');
      menuCloseAnimation.restart();
      setTimeout(function() {
        const section = document.querySelector(targetSection);
        if (section) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: section,
              offsetY: 0
            },
            ease: 'power2.inOut'
          });
        }
      }, 700);
    }
  });
});

  
  // Закрити меню при натисканні клавіші Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && body.classList.contains('menu-active')) {
      body.classList.remove('menu-active');
      menuCloseAnimation.restart();
    }
  });
  
  // Анімація появи логотипу та кнопки меню
  gsap.from('nav .logo', {
    opacity: 0,
    x: -50,
    duration: 1,
    delay: 0.5,
    ease: 'power2.out'
  });
  
  gsap.from('nav .menu', {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.7,
    ease: 'power2.out'
  });
});








// ========== FOOTER АНІМАЦІЇ ==========
// Анімація заголовків
gsap.fromTo('.footer-item h2', 
    { y: 30, opacity: 0 }, 
    {
    y: 0,
    opacity: 1,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%'
    }
    }
);

// Анімація тексту та посилань
gsap.fromTo('.footer-item p, .social-link', 
    { y: 20, opacity: 0 }, 
    {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.6,
    delay: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%'
    }
    }
);

// Анімація градієнтної лінії
gsap.fromTo('.gradient-line', 
    { width: '0%', opacity: 0 }, 
    {
    width: '100%',
    opacity: 1,
    duration: 1.5,
    ease: 'power2.inOut',
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 70%'
    }
    }
);

// Анімація нижнього рядка
gsap.fromTo('.footer-bottom', 
    { y: 20, opacity: 0 }, 
    {
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 60%'
    }
    }
);
