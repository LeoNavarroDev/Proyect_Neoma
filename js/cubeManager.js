// cubeManager.js - Клас для керування 3D кубами в просторі

class CubeManager {
    constructor(scene, colorRosa, colorMorado) {
      this.scene = scene;
      this.colorRosa = colorRosa;
      this.colorMorado = colorMorado;
      this.cubes = [];
      this.cubeCount = 20; // Загальна кількість кубів
      
      // Масив для зберігання позицій кубів
      this.cubePositions = [
        // Ліва сторона (10 кубів)
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
        
        // Права сторона (10 кубів)
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
      
      // Матеріали для кубів
      this.wireMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      
      this.solidMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
    }
    
    // Створення всіх кубів
    createCubes() {
      // Видалення попередніх кубів, якщо вони існують
      this.cubes.forEach(cube => {
        this.scene.remove(cube.wireframe);
        this.scene.remove(cube.solid);
      });
      this.cubes = [];
      
      // Створення нових кубів
      for (let i = 0; i < this.cubeCount; i++) {
        const pos = this.cubePositions[i];
        
        // Визначаємо колір на основі індексу (чергуємо кольори)
        const colorMix = i % 2 === 0 ? 0.3 : 0.7;
        const cubeColor = new THREE.Color().lerpColors(this.colorRosa, this.colorMorado, colorMix);
        
        // Клонуємо матеріали та встановлюємо колір
        const wireMat = this.wireMaterial.clone();
        const solidMat = this.solidMaterial.clone();
        wireMat.color = cubeColor;
        solidMat.color = cubeColor;
        
        // Створюємо геометрію куба
        const geometry = new THREE.BoxGeometry(pos.size, pos.size, pos.size);
        
        // Створюємо два куби: каркасний та суцільний
        const wireframe = new THREE.Mesh(geometry, wireMat);
        const solid = new THREE.Mesh(geometry, solidMat);
        
        // Встановлюємо позиції
        wireframe.position.set(pos.x, pos.y, pos.z);
        solid.position.set(pos.x, pos.y, pos.z);
        
        // Встановлюємо початкову ротацію
        wireframe.rotation.set(pos.rotation.x, pos.rotation.y, pos.rotation.z);
        solid.rotation.set(pos.rotation.x, pos.rotation.y, pos.rotation.z);
        
        // Додаємо індекс для ідентифікації
        wireframe.name = `cube-${i}-wireframe`;
        solid.name = `cube-${i}-solid`;
        
        // Додаємо куби до масиву
        this.cubes.push({
          index: i,
          wireframe: wireframe,
          solid: solid,
          rotationSpeed: {
            x: 0.001 + Math.random() * 0.001,
            y: 0.001 + Math.random() * 0.001,
            z: 0.001 + Math.random() * 0.001
          }
        });
        
        // Додаємо куби до сцени
        this.scene.add(wireframe);
        this.scene.add(solid);
      }
    }
    
    // Оновлення стану кубів (обертання, прозорість тощо)
    update(time, cameraZ) {
      this.cubes.forEach(cube => {
        // Обертання кубів
        cube.wireframe.rotation.x += cube.rotationSpeed.x;
        cube.wireframe.rotation.y += cube.rotationSpeed.y;
        cube.wireframe.rotation.z += cube.rotationSpeed.z;
        
        cube.solid.rotation.x = cube.wireframe.rotation.x;
        cube.solid.rotation.y = cube.wireframe.rotation.y;
        cube.solid.rotation.z = cube.wireframe.rotation.z;
        
        // Змінюємо прозорість в залежності від відстані до камери
        const distance = Math.abs(cube.wireframe.position.z - cameraZ);
        const opacityFactor = Math.max(0, Math.min(1, 1000 / distance));
        
        cube.wireframe.material.opacity = Math.min(0.6, opacityFactor * 0.6);
        cube.solid.material.opacity = Math.min(0.2, opacityFactor * 0.2);
        
        // Невеликий "пульсуючий" ефект для кубів
        const pulseFactor = 1 + Math.sin(time * 0.5 + cube.index) * 0.1;
        cube.wireframe.scale.set(pulseFactor, pulseFactor, pulseFactor);
        cube.solid.scale.set(pulseFactor, pulseFactor, pulseFactor);
      });
    }
    
    // Метод для зміни позиції конкретного куба
    setCubePosition(index, x, y, z) {
      if (index < 0 || index >= this.cubeCount) return;
      
      const cube = this.cubes[index];
      this.cubePositions[index].x = x;
      this.cubePositions[index].y = y;
      this.cubePositions[index].z = z;
      
      cube.wireframe.position.set(x, y, z);
      cube.solid.position.set(x, y, z);
    }
    
    // Метод для зміни розміру конкретного куба
    setCubeSize(index, size) {
      if (index < 0 || index >= this.cubeCount) return;
      
      const cube = this.cubes[index];
      this.cubePositions[index].size = size;
      
      // Видаляємо старі меші
      this.scene.remove(cube.wireframe);
      this.scene.remove(cube.solid);
      
      // Створюємо нову геометрію з оновленим розміром
      const geometry = new THREE.BoxGeometry(size, size, size);
      
      // Створюємо нові меші з тими ж матеріалами
      const wireframe = new THREE.Mesh(geometry, cube.wireframe.material);
      const solid = new THREE.Mesh(geometry, cube.solid.material);
      
      // Копіюємо позицію та обертання
      wireframe.position.copy(cube.wireframe.position);
      solid.position.copy(cube.solid.position);
      wireframe.rotation.copy(cube.wireframe.rotation);
      solid.rotation.copy(cube.solid.rotation);
      
      // Оновлюємо назви
      wireframe.name = cube.wireframe.name;
      solid.name = cube.solid.name;
      
      // Оновлюємо об'єкт куба
      cube.wireframe = wireframe;
      cube.solid = solid;
      
      // Додаємо нові меші до сцени
      this.scene.add(wireframe);
      this.scene.add(solid);
    }
    
    // Ефект для переходу між сторінками
    startRedirectEffect() {
      this.cubes.forEach(cube => {
        cube.rotationSpeed.x *= 5;
        cube.rotationSpeed.y *= 5;
        cube.rotationSpeed.z *= 5;
        
        cube.wireframe.material.opacity = 1;
        cube.solid.material.opacity = 0.5;
      });
    }
  }