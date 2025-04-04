// lenis.js
const lenis = new Lenis({
    autoRaf: true,
});


// deley para video
const video = document.getElementById("video_background");
video.addEventListener("canplay", function() {
  setTimeout(function() {
    video.play();
  }, 6000);
});


const heroeText = document.querySelector('.heroe-text');
let animacionEjecutada = false;  // Bandera para ejecutar solo una vez

// Al iniciar el video, se oculta el texto con fade-out
video.addEventListener('play', () => {
  if (!animacionEjecutada) {
    heroeText.classList.remove('fade-in');
    heroeText.classList.add('fade-out');
  }
});

// Durante la reproducción, detectar cuando faltan 5 segundos para el final
video.addEventListener('timeupdate', () => {
  if (!animacionEjecutada && (video.duration - video.currentTime) <= 8) {
    heroeText.classList.remove('fade-out');
    heroeText.classList.add('fade-in');
    animacionEjecutada = true;
  }
});



// Lente about us
let numParticles = 2000;
let radius;
let innerRadius;
let particles = [];
let particleSize = 3;

function setup() {
  let container = document.getElementById("canvas-container");
  let canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent("canvas-container");
  radius = min(width, height) * 0.45;
  innerRadius = radius * 0.3;

  for (let i = 0; i < numParticles; i++) {
    let r = random(innerRadius, radius);
    let angle = random(TWO_PI);
    let x = width / 2 + r * cos(angle);
    let y = height / 2 + r * sin(angle);
    particles.push({
      x: x,
      y: y,
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3)
    });
  }

  noStroke();
}

function draw() {
  clear();
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx * 0.2;
    p.y += p.vy * 0.2;
    let dx = p.x - width / 2;
    let dy = p.y - height / 2;
    let distFromCenter = sqrt(dx * dx + dy * dy);
    if (distFromCenter > radius || distFromCenter < innerRadius) {
      let newR = random(innerRadius, radius);
      let newAngle = random(TWO_PI);
      p.x = width / 2 + newR * cos(newAngle);
      p.y = height / 2 + newR * sin(newAngle);
      p.vx = random(-0.3, 0.3);
      p.vy = random(-0.3, 0.3);
    }
    let currentAngle = atan2(dy, dx);
    if (currentAngle < 0) currentAngle += TWO_PI;
    let angleFactor = 0.5 * (1 - cos(currentAngle));
    let rosa = color(255, 150, 180);
    let morado = color(180, 100, 255);
    let mixedColor = lerpColor(rosa, morado, angleFactor);
    let distFactor = (distFromCenter - innerRadius) / (radius - innerRadius);
    let finalColor = lerpColor(color(255), mixedColor, distFactor);
    fill(finalColor);
    ellipse(p.x, p.y, particleSize, particleSize);
  }
}

function windowResized() {
  let container = document.getElementById("canvas-container");
  resizeCanvas(container.clientWidth, container.clientHeight);
  radius = min(width, height) * 0.45;
  innerRadius = radius * 0.3;
}