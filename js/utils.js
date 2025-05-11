// utils.js - Допоміжні функції

// Функція для нормалізації значення в діапазоні
function normalize(value, min, max) {
    return (value - min) / (max - min);
  }
  
  // Функція для лінійної інтерполяції
  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }
  
  // Функція для застосування обмеження до значення
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  
  // Функція для конвертації градусів у радіани
  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
  
  // Функція для визначення відстані між двома точками
  function distance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dz = point2.z - point1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }