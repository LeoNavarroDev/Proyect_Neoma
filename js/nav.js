
document.addEventListener('DOMContentLoaded', function() {
  // Элементы управления меню
  const menuBtn = document.querySelector('.menu');
  const closeBtn = document.querySelector('.close-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const body = document.body;
  
  // Открыть меню при клике на иконку меню
  menuBtn.addEventListener('click', function() {
    body.classList.add('menu-active');
  });
  
  // Закрыть меню при клике на кнопку закрытия
  closeBtn.addEventListener('click', function() {
    body.classList.remove('menu-active');
  });
  
  // Обработчик для пунктов меню
  menuItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      body.classList.remove('menu-active');
      
      // Задержка перед скроллом, чтобы анимация закрытия успела выполниться
      setTimeout(function() {
        const section = document.querySelector(targetSection);
        if (section) {
          // Используем Lenis для плавного скролла, если доступен
          if (window.lenis) {
            lenis.scrollTo(section);
          } else {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 800);
    });
  });
  
  // Закрыть меню при нажатии клавиши Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && body.classList.contains('menu-active')) {
      body.classList.remove('menu-active');
    }
  });
});