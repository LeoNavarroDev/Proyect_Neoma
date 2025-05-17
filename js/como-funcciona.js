// lenis.js
const lenis = new Lenis({
  autoRaf: true,
});


// Функція для створення ефекту появи тексту по словах
function fadeInWords(element, speed = 100) {
  // Отримуємо оригінальний HTML для збереження форматування (strong теги тощо)
  const originalHTML = element.innerHTML;
  
  // Розбиваємо HTML на частини, зберігаючи теги
  const htmlParts = [];
  let currentText = '';
  let inTag = false;
  
  for (let i = 0; i < originalHTML.length; i++) {
    const char = originalHTML[i];
    
    if (char === '<') {
      // Якщо знайшли початок тегу
      if (currentText) {
        htmlParts.push({ type: 'text', content: currentText });
        currentText = '';
      }
      inTag = true;
      currentText = char;
    } else if (char === '>' && inTag) {
      // Якщо знайшли кінець тегу
      currentText += char;
      htmlParts.push({ type: 'tag', content: currentText });
      currentText = '';
      inTag = false;
    } else {
      // Продовжуємо збирати поточний тег або текст
      currentText += char;
    }
  }
  
  // Додаємо останній текст, якщо він є
  if (currentText) {
    htmlParts.push({ type: 'text', content: currentText });
  }
  
  // Перетворюємо текстові частини на масив слів з тегами
  const result = [];
  htmlParts.forEach(part => {
    if (part.type === 'tag') {
      result.push(part);
    } else {
      // Розбиваємо текст на слова і додаємо їх окремо
      const words = part.content.split(' ');
      words.forEach((word, index) => {
        result.push({ type: 'word', content: word });
        // Додаємо пробіл після кожного слова, крім останнього
        if (index < words.length - 1) {
          result.push({ type: 'space', content: ' ' });
        }
      });
    }
  });
  
  // Підготовка HTML для відображення з невидимими словами
  let displayHTML = '';
  result.forEach(part => {
    if (part.type === 'word') {
      displayHTML += `<span class="fade-word" style="opacity: 0; transition: opacity 0.5s ease;">${part.content}</span>`;
    } else if (part.type === 'space') {
      displayHTML += part.content;
    } else {
      displayHTML += part.content;
    }
  });
  
  // Встановлюємо готовий HTML з обгорнутими словами
  element.innerHTML = displayHTML;
  
  // Анімуємо появу кожного слова
  const words = element.querySelectorAll('.fade-word');
  words.forEach((word, index) => {
    setTimeout(() => {
      // Плавна поява слова
      word.style.opacity = 1;
    }, index * speed);
  });
}

// Створюємо IntersectionObserver для відстеження видимості елементів
document.addEventListener('DOMContentLoaded', () => {
  // Отримуємо всі блоки chat-neoma
  const neomaMessages = document.querySelectorAll('.text-print');
  
  // Створюємо спостерігач для перевірки, коли елементи стають видимими
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Перевіряємо, чи елемент видимий і чи ще не анімований
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        // Позначаємо елемент як анімований
        entry.target.classList.add('animated');
        // Запускаємо анімацію появи тексту
        fadeInWords(entry.target, 100); // швидкість появи слів (мс)
        // Припиняємо спостереження за цим елементом
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 }); // Показувати, коли елемент видно як мінімум на 50%
  
  // Додаємо всі повідомлення до спостереження
  neomaMessages.forEach(message => {
    observer.observe(message);
  });
});








const ctx = document.getElementById('satisfaccionChart').getContext('2d');
const satisfaccionChart = new Chart(ctx, {
  type: 'bar',
  data: {
  labels: ['Comodidad', 'Precisión', 'Batería', 'Estilo', 'Usabilidad', 'Privacidad'],
  datasets: [{
    label: 'Nivel de satisfacción (%)',
    data: [92, 88, 80, 85, 90, 75],
    backgroundColor: function(context) {
      const chart = context.chart;
      const {ctx, chartArea} = chart;

      if (!chartArea) return null; // Previene errores al cargar

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, 'rgba(63, 81, 181, 0.8)');   // Azul profundo
      gradient.addColorStop(1, 'rgba(156, 39, 176, 0.8)');  // Violeta

      return gradient;
    },
    borderColor: 'rgba(63, 81, 181, 1)',
    borderWidth: 1
  }]
},
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { size: 16 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 14 } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          stepSize: 20,
          font: { size: 14 }
        },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  }
});