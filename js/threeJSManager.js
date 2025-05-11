// threeJSManager.js - Клас для керування Three.js сценою

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