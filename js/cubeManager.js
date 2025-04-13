// Створення менеджера для об'єктів (кубів)
class CubeManager {
  constructor(scene) {
    this.scene = scene;
    this.cubes = [];
    this.cubeCount = 20; // Загальна кількість екземплярів моделі

    // Масив для зберігання позицій (початкової ротації та розміру)
    this.cubePositions = [
      // Ліва сторона (10 об'єктів)
      { x: -300, y: 200, z: -200, size: 30, rotation: { x: 0.2, y: 0.5, z: 0.1 } },
      { x: -400, y: 50, z: -600, size: 40, rotation: { x: 0.5, y: 0.2, z: 0.3 } },
      { x: -350, y: -150, z: -1000, size: 35, rotation: { x: 0.1, y: 0.3, z: 0.7 } },
      { x: -250, y: 100, z: -1500, size: 25, rotation: { x: 0.4, y: 0.1, z: 0.2 } },
      { x: -420, y: -70, z: -2000, size: 45, rotation: { x: 0.2, y: 0.4, z: 0.5 } },
      { x: -380, y: 150, z: -2500, size: 30, rotation: { x: 0.7, y: 0.3, z: 0.1 } },
      { x: -280, y: -200, z: -3000, size: 50, rotation: { x: 0.1, y: 0.8, z: 0.2 } },
      { x: -350, y: 50, z: -3500, size: 35, rotation: { x: 0.3, y: 0.2, z: 0.4 } },
      { x: -450, y: -120, z: -4000, size: 40, rotation: { x: 0.5, y: 0.5, z: 0.3 } },
      { x: -320, y: 180, z: -4500, size: 30, rotation: { x: 0.2, y: 0.1, z: 0.6 } },

      // Права сторона (10 об'єктів)
      { x: 300, y: 150, z: -400, size: 35, rotation: { x: 0.3, y: 0.2, z: 0.4 } },
      { x: 370, y: -100, z: -800, size: 45, rotation: { x: 0.1, y: 0.6, z: 0.2 } },
      { x: 420, y: 80, z: -1200, size: 30, rotation: { x: 0.4, y: 0.3, z: 0.5 } },
      { x: 350, y: -150, z: -1700, size: 40, rotation: { x: 0.2, y: 0.7, z: 0.1 } },
      { x: 400, y: 120, z: -2200, size: 35, rotation: { x: 0.6, y: 0.2, z: 0.3 } },
      { x: 320, y: -80, z: -2700, size: 30, rotation: { x: 0.3, y: 0.4, z: 0.2 } },
      { x: 450, y: 100, z: -3200, size: 50, rotation: { x: 0.1, y: 0.3, z: 0.7 } },
      { x: 380, y: -130, z: -3700, size: 40, rotation: { x: 0.5, y: 0.1, z: 0.4 } },
      { x: 330, y: 170, z: -4200, size: 35, rotation: { x: 0.2, y: 0.5, z: 0.3 } },
      { x: 410, y: -60, z: -4700, size: 45, rotation: { x: 0.4, y: 0.2, z: 0.6 } }
    ];
  }

  // Завантаження моделі та створення екземплярів з текстурою
  createCubes() {
    // Видалення попередніх екземплярів моделі, якщо вони існують
    this.cubes.forEach(obj => {
      this.scene.remove(obj.model);
    });
    this.cubes = [];

    // Завантаження текстури
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('3d/texture.png');

    // Використовуємо GLTFLoader для завантаження моделі
    const loader = new THREE.GLTFLoader();
    loader.load('3d/lens_model.glb', (gltf) => {
      const model = gltf.scene;

      // Проходимось по усіх дочірніх елементах моделі та застосовуємо матеріал з текстурою
      model.traverse(child => {
        if (child.isMesh) {
          // Створення матеріалу з завантаженою текстурою
          child.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide  // Встановлюємо відображення обох сторін
          });
        }
      });
      
      // Створення копій моделі згідно заданих позицій
      for (let i = 0; i < this.cubeCount; i++) {
        const pos = this.cubePositions[i];
        
        // Створюємо клон завантаженої моделі
        const modelClone = model.clone();
        
        // Обчислюємо базовий масштаб за допомогою scaleFactor
        const scaleFactor = pos.size / 2;
        modelClone.scale.set(scaleFactor, scaleFactor, scaleFactor);
        modelClone.userData.baseScale = scaleFactor;
        
        // Встановлюємо позицію та початкову ротацію згідно даних
        modelClone.position.set(pos.x, pos.y, pos.z);
        modelClone.rotation.set(pos.rotation.x, pos.rotation.y, pos.rotation.z);
        
        modelClone.name = `model-${i}`;
        this.scene.add(modelClone);
        
        // Зберігаємо екземпляр з унікальною швидкістю обертання
        this.cubes.push({
          index: i,
          model: modelClone,
          rotationSpeed: {
            x: 0.001 + Math.random() * 0.001,
            y: 0.001 + Math.random() * 0.001,
            z: 0.001 + Math.random() * 0.001
          }
        });
      }
    });
  }

  // Оновлення стану екземплярів моделі (обертання, пульсація тощо)
  update(time) {
    this.cubes.forEach(cube => {
      // Обертання моделі
      cube.model.rotation.x += cube.rotationSpeed.x;
      cube.model.rotation.y += cube.rotationSpeed.y;
      cube.model.rotation.z += cube.rotationSpeed.z;
      
      // Обчислюємо пульсуючий коефіцієнт
      const pulseFactor = 1 + Math.sin(time * 0.5 + cube.index) * 0.1;
      
      // Отримуємо базовий масштаб, збережений під час створення
      const baseScale = cube.model.userData.baseScale;
      
      // Застосовуємо пульсацію до базового масштабу
      cube.model.scale.set(
        baseScale * pulseFactor,
        baseScale * pulseFactor,
        baseScale * pulseFactor
      );
    });
  }

  // Ефект для переходу між сторінками (наприклад, прискорення обертання)
  startRedirectEffect() {
    this.cubes.forEach(cube => {
      cube.rotationSpeed.x *= 5;
      cube.rotationSpeed.y *= 5;
      cube.rotationSpeed.z *= 5;
    });
  }
}

// Ініціалізація сцени, камери, рендерера та запуск анімації
let scene, camera, renderer, cubeManager;

function init() {
  // Створення сцени
  scene = new THREE.Scene();

  // Налаштування камери
  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 10000
  );
  camera.position.z = 1000; // Пристосуй за потребою

  // Налаштування рендерера
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Створення менеджера кубів та завантаження моделей із текстурою
  cubeManager = new CubeManager(scene);
  cubeManager.createCubes();

  // Запуск анімації
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001; // Час в секундах
  cubeManager.update(time);
  renderer.render(scene, camera);
}

// Обробка зміни розміру вікна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Запуск ініціалізації
init();
