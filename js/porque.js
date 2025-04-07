// lenis.js
const lenis = new Lenis({
    autoRaf: true,
});


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colores definidos por el usuario
const rosa = {r: 255, g: 150, b: 180};
const morado = {r: 180, g: 100, b: 255};

// Configuración de las partículas
const particleCount = 300;
const particles = [];

// Velocidad de viaje
let speed = 5;

class Particle {
    constructor() {
    this.reset();
    }
    
    reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = Math.random() * 1000 + 1000; // Profundidad
    this.size = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.8 + 0.2;
    
    // Color basado en una mezcla entre rosa y morado
    const colorMix = Math.random();
    this.color = {
        r: rosa.r * colorMix + morado.r * (1 - colorMix),
        g: rosa.g * colorMix + morado.g * (1 - colorMix),
        b: rosa.b * colorMix + morado.b * (1 - colorMix)
    };
    }
    
    update() {
    // Efecto de movimiento hacia adelante
    this.z -= speed;
    
    // Si la partícula está muy cerca, resetearla
    if (this.z < 1) {
        this.reset();
        this.z = 1000;
    }
    
    // Calcular posición 3D proyectada a 2D
    this.sx = (this.x - canvas.width / 2) / this.z;
    this.sx = this.sx * 300 + canvas.width / 2;
    
    this.sy = (this.y - canvas.height / 2) / this.z;
    this.sy = this.sy * 300 + canvas.height / 2;
    
    // Tamaño basado en la profundidad - asegurarnos de que siempre sea positivo
    this.pSize = Math.max(0.1, 3 * (1000 - this.z) / 1000);
    
    // Ajustar el brillo basado en la profundidad
    const depth = Math.max(0, Math.min(1, (1000 - this.z) / 1000));
    this.currentOpacity = this.opacity * depth;
    }
    
    draw() {
    // Verificar que la partícula esté dentro del canvas y el tamaño sea válido
    if (
        this.sx > 0 && 
        this.sx < canvas.width && 
        this.sy > 0 && 
        this.sy < canvas.height && 
        this.pSize > 0
    ) {
        ctx.beginPath();
        ctx.arc(this.sx, this.sy, this.pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentOpacity})`;
        ctx.fill();
        
        // Agregar un brillo para partículas más cercanas
        if (this.z < 500) {
        const glowSize = Math.max(0.1, this.pSize * 3);
        const gradient = ctx.createRadialGradient(
            this.sx, this.sy, 0,
            this.sx, this.sy, glowSize
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentOpacity * 0.8})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.sx, this.sy, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        }
        
        // Agregar estela para algunas partículas
        if (this.z < 300 && Math.random() > 0.7) {
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.sx + (Math.random() * 10 - 5), this.sy + (Math.random() * 10 - 5));
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentOpacity * 0.3})`;
        ctx.lineWidth = Math.max(0.1, this.pSize / 2);
        ctx.stroke();
        }
    }
    }
}

// Inicializar partículas
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Función de animación
function animate() {
    // Limpiar canvas con un fondo negro con poca opacidad para crear efecto de estela
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar partículas
    for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    }
    
    // Crear un ligero resplandor en el centro
    const centerGlow = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 4
    );
    centerGlow.addColorStop(0, 'rgba(180, 120, 220, 0.03)');
    centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cambiar velocidad ligeramente para crear sensación de aceleración/desaceleración
    speed = 5 + Math.sin(Date.now() / 2000) * 2;
    
    requestAnimationFrame(animate);
}

// Iniciar animación
animate();

// Ajustar tamaño del canvas al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Controlar velocidad con las teclas
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
    speed = Math.min(speed + 1, 15);
    } else if (e.key === 'ArrowDown') {
    speed = Math.max(speed - 1, 1);
    }
});

// Controlar velocidad con toques en la pantalla (para dispositivos móviles)
canvas.addEventListener('touchstart', (e) => {
    const touchY = e.touches[0].clientY;
    if (touchY < canvas.height / 2) {
    speed = Math.min(speed + 1, 15);
    } else {
    speed = Math.max(speed - 1, 1);
    }
});