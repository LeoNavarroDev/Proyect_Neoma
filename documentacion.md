# Análisis detallado de la aplicación web Neoma (porque.html)

Tu código es una aplicación web interactiva basada en Three.js que muestra el concepto de "Neoma", una lente de contacto inteligente ficticia. Veamos primero la estructura general y luego analicemos cada archivo por separado.

## Resumen general

La aplicación consta de una página HTML (`porque.html`) y varios archivos JavaScript que son responsables de:
1. Gestionar la escena 3D (Three.js)
2. Crear luciérnagas (partículas luminosas)
3. Gestionar modelos 3D (cubos/lentes)
4. Mostrar paneles de texto
5. Procesar el movimiento del ratón para la interactividad

Cuando el usuario desplaza la página, la cámara se mueve a través del espacio 3D, mostrando diferentes paneles de texto, acompañados de efectos visuales: luciérnagas y modelos de lentes que cambian durante el desplazamiento.

## Análisis detallado de cada archivo

### 1. porque.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Neoma</title>
  <link rel="icon" href="img/logo.png" />
  <!-- Inclusión de bibliotecas -->
  <!-- Inclusión de fuentes -->
  <!-- Inclusión de CSS -->
</head>
<body>
  <!-- Barra de progreso -->
  <div class="progress-container">
    <div class="progress-bar" id="progressBar"></div>
  </div>

  <!-- Botón de menú -->
  <button onclick="menu()"><img src="img/list.svg" alt="menu" class="menu"/></button>

  <!-- Overlay para transición entre páginas -->
  <div class="transition-overlay" id="transitionOverlay"></div>
  
  <!-- Inclusión de archivos JavaScript -->
</body>
</html>
```

**Qué hace:**
- Configura la estructura HTML básica
- Incluye Three.js y su cargador de modelos GLTFLoader
- Incluye la biblioteca Lenis para desplazamiento suave
- Incluye fuentes personalizadas de Google Fonts
- Crea un contenedor para la barra de progreso, un botón de menú y un overlay para la animación de transición
- Conecta todos los archivos JavaScript con la lógica de la aplicación

### 2. js/threeJSManager.js

```javascript
class ThreeJSManager {
    static init() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const clock = new THREE.Clock();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      camera.position.z = 400;
      
      return { scene, camera, renderer, clock };
    }
}
```

**Qué hace:**
- Crea una clase estática para inicializar Three.js
- El método init() configura:
  - Una escena 3D (scene) - contenedor para todos los objetos 3D
  - Una cámara (camera) - define lo que ve el usuario
  - Un renderizador (renderer) - muestra la escena 3D en la pantalla
  - Un reloj (clock) - para seguir el tiempo de la animación
- Configura el renderizador con anti-aliasing
- Establece la posición inicial de la cámara
- Devuelve todos los objetos creados para su uso en otras partes del programa

### 3. js/utils.js

```javascript
// Función para normalizar un valor en un rango
function normalize(value, min, max) {
    return (value - min) / (max - min);
}
  
// Función para interpolación lineal
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
  
// Función para aplicar restricciones a un valor
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
  
// Función para convertir grados a radianes
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
  
// Función para determinar la distancia entre dos puntos
function distance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dz = point2.z - point1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
```

**Qué hace:**
- Define funciones matemáticas auxiliares:
  - `normalize()` - convierte un valor de un rango a un rango de 0 a 1
  - `lerp()` - interpolación lineal entre dos valores (transición suave)
  - `clamp()` - limita un valor a un mínimo y máximo
  - `degToRad()` - convierte grados a radianes (para rotaciones en Three.js)
  - `distance()` - calcula la distancia entre dos puntos 3D

### 4. js/fireflyManager.js

```javascript
class FireflyManager {
    constructor(scene, colorRosa, colorMorado) {
      this.scene = scene;
      this.colorRosa = colorRosa;
      this.colorMorado = colorMorado;
      this.fireflyCount = 1000;
      this.fireflies = [];
      this.fireflyTexture = this.createFireflyTexture();
      this.fireflyMaterial = new THREE.SpriteMaterial({
        map: this.fireflyTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });
      this.camera = null;
    }
    
    // Otros métodos...
}
```

**Qué hace:**
- Crea y gestiona "luciérnagas" (partículas luminosas) en la escena
- En el constructor:
  - Guarda referencia a la escena y colores (rosa y morado)
  - Define la cantidad de luciérnagas (1000)
  - Crea la textura para las luciérnagas (punto blanco con gradiente de transparencia)
  - Crea el material para las luciérnagas con mezcla aditiva (para efecto de brillo)
- Método `setCamera()` - establece referencia a la cámara
- Método `createFireflyTexture()` - crea textura de luciérnaga con gradiente
- Método `createFireflies()` - crea todas las luciérnagas y las añade a la escena
- Método `update()` - actualiza el estado de las luciérnagas (parpadeo, movimiento)
- Método `startRedirectEffect()` - inicia efecto para transición a otra página

### 5. js/cubeManager.js

```javascript
class CubeManager {
  constructor(scene) {
    this.scene = scene;
    this.cubes = [];
    this.cubeCount = 20; // Cantidad total de instancias del modelo
    this.cubePositions = [
      // Posiciones para 20 modelos...
    ];
  }
  
  // Otros métodos...
}
```

**Qué hace:**
- Gestiona modelos 3D que parecen lentes o cubos
- En el constructor:
  - Guarda referencia a la escena
  - Crea un array para almacenar objetos
  - Establece la cantidad de modelos (20)
  - Define posiciones, tamaños y rotaciones para cada modelo
- Método `createCubes()` - carga el modelo 3D de la lente, crea copias y las coloca según las posiciones definidas
- Método `update()` - actualiza la rotación y pulsación de tamaño de los modelos
- Método `startRedirectEffect()` - acelera la rotación para el efecto de transición

### 6. js/textPanelManager.js

```javascript
class TextPanelManager {
  constructor(scene) {
    this.scene = scene;
    this.textPanels = [];
    this.panelCount = 9;
    this.panelDepthSpacing = 500;
    
    // Textos para los paneles
    this.panelTexts = [
      // 9 mensajes de texto...
    ];
  }
  
  // Otros métodos...
}
```

**Qué hace:**
- Gestiona paneles de texto que aparecen durante el desplazamiento
- En el constructor:
  - Guarda referencia a la escena
  - Crea un array para almacenar paneles
  - Establece la cantidad de paneles (9)
  - Define la distancia entre paneles en el eje Z (500)
  - Define los textos para cada panel
- Método `getFontFamily()` - determina la fuente dependiendo de si el texto es un título
- Método `createTextTexture()` - crea una textura con texto y color gradiente
- Método `createPanels()` - crea todos los paneles de texto y los añade a la escena
- Método `update()` - cambia la opacidad de los paneles según la distancia a la cámara

### 7. js/mouseManager.js

```javascript
class MouseManager {
    constructor(camera) {
      this.camera = camera;
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;
      this.lerpFactor = 0.08; // Factor de suavizado
      this.rotationFactor = 0.0005; // Sensibilidad de rotación
      this.isMobile = this.checkIfMobile();
      this.lookAtVector = new THREE.Vector3(0, 0, -400);
      
      // Inicializa los manejadores de eventos solo para dispositivos desktop
      if (!this.isMobile) {
        this.initEventListeners();
      }
    }
    
    // Otros métodos...
}
```

**Qué hace:**
- Responsable del movimiento de la cámara basado en la posición del ratón
- En el constructor:
  - Guarda referencia a la cámara
  - Inicializa variables para la posición actual y objetivo del ratón
  - Establece factores de suavizado y sensibilidad
  - Comprueba si el dispositivo es móvil
  - Crea un vector de dirección de vista
- Método `checkIfMobile()` - comprueba si se está usando un dispositivo móvil
- Método `initEventListeners()` - establece manejadores de eventos para el movimiento del ratón
- Método `onMouseMove()` - actualiza las coordenadas objetivo del ratón
- Método `onWindowResize()` - recalcula las coordenadas del ratón cuando cambia el tamaño de la ventana
- Método `update()` - actualiza suavemente la rotación de la cámara basada en la posición del ratón
- Método `setSensitivity()` - ajusta la sensibilidad del movimiento

### 8. js/porque.js

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de Lenis para desplazamiento suave...
  
  // Variables para control de desplazamiento y animación...
  
  // Inicialización de ThreeJS...
  
  // Colores...
  
  // Inicialización de gestores...
  
  // Ciclo principal de animación...
  
  // Funciones de actualización de cámara, barra de progreso...
  
  // Función para iniciar animación de transición...
  
  // Manejadores de eventos...
  
  // Espera a que se carguen las fuentes...
});

function menu() {
  window.location.href = "first.html";
}
```

**Qué hace:**
- Archivo principal que inicializa todos los componentes y coordina su trabajo
- Crea una instancia de Lenis para desplazamiento suave
- Inicializa variables para controlar el desplazamiento y la animación de transición
- Configura la escena ThreeJS, cámara y renderizador
- Define los colores principales (rosa y morado)
- Crea instancias de todos los gestores (FireflyManager, CubeManager, TextPanelManager, MouseManager)
- Define la función de animación que actualiza todos los componentes y renderiza la escena
- Contiene funciones para actualizar la posición de la cámara y la barra de progreso
- Tiene una función para iniciar la animación de transición a otra página
- Establece manejadores de eventos para desplazamiento y cambio de tamaño de ventana
- Espera a que se carguen las fuentes antes de la inicialización
- Define la función `menu()` para la transición a la página "first.html"

## Cómo funciona todo junto

1. Cuando la página se carga, `porque.js` inicializa todos los componentes:
   - Crea la escena 3D, cámara y renderizador a través de ThreeJSManager
   - Añade luciérnagas a través de FireflyManager
   - Añade modelos 3D de lentes a través de CubeManager
   - Crea paneles de texto a través de TextPanelManager
   - Configura la reacción al movimiento del ratón a través de MouseManager

2. Se inicia el ciclo de animación, que:
   - Actualiza el estado de todos los objetos (luciérnagas, cubos, paneles de texto)
   - Actualiza la posición de la cámara basada en el desplazamiento
   - Añade pequeños movimientos a la cámara para efectos visuales
   - Actualiza la rotación de la cámara basada en la posición del ratón
   - Renderiza la escena

3. Cuando el usuario desplaza la página:
   - Se actualiza la barra de progreso
   - La cámara se mueve hacia adelante en el eje Z, mostrando nuevos paneles de texto
   - Cambia la opacidad de los paneles dependiendo de su distancia a la cámara

4. Cuando el usuario llega al final de la página (scrollRatio > 0.97):
   - Se inicia la animación de transición
   - Se activa el overlay (oscurecimiento de la pantalla)
   - Se acelera el movimiento y brillo de las luciérnagas y la rotación de los cubos
   - Después de 1.5 segundos, se produce la transición a la página "first.html"

## Recomendaciones para principiantes

1. **Estructura del proyecto**: El código está dividido en componentes lógicos (gestores), lo que corresponde a los principios de programación orientada a objetos.

2. **Three.js**: Esta es una biblioteca para trabajar con gráficos 3D en el navegador. Estudia los conceptos básicos:
   - Scene (escena) - contenedor para todos los objetos 3D
   - Camera (cámara) - define lo que ve el usuario
   - Renderer (renderizador) - muestra la escena 3D en la pantalla
   - Meshes (mallas) - objetos 3D con su propia geometría y material

3. **Animación**: Observa cómo se utiliza `requestAnimationFrame` para crear un ciclo de animación y cómo se utiliza el tiempo para animar objetos.

4. **Interpolación**: Muchas transiciones suaves en el código utilizan interpolación lineal (`lerp`) para hacer que el movimiento sea más natural.

5. **Eventos**: El código utiliza eventos para responder a las acciones del usuario (desplazamiento, movimiento del ratón, cambio de tamaño de ventana).

6. **Optimización para dispositivos móviles**: El código comprueba si el dispositivo es móvil y adapta el comportamiento en consecuencia.

Este código demuestra cómo crear una experiencia interactiva rica en el navegador utilizando JavaScript y Three.js, combinando gráficos 3D con respuesta a las acciones del usuario.