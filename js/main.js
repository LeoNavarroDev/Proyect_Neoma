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
