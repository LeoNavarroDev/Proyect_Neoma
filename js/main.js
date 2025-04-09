// lenis.js
const lenis = new Lenis({
  autoRaf: true,
});

// deley para video
const video = document.getElementById("video_background");
video.addEventListener("canplay", function () {
  setTimeout(function () {
    video.play();
  }, 6000);
});

const heroeText = document.querySelector(".heroe-text");
let animacionEjecutada = false; // Bandera para ejecutar solo una vez

// Al iniciar el video, se oculta el texto con fade-out
video.addEventListener("play", () => {
  if (!animacionEjecutada) {
    heroeText.classList.remove("fade-in");
    heroeText.classList.add("fade-out");
  }
});

// Durante la reproducción, detectar cuando faltan 5 segundos para el final
video.addEventListener("timeupdate", () => {
  if (!animacionEjecutada && video.duration - video.currentTime <= 8) {
    heroeText.classList.remove("fade-out");
    heroeText.classList.add("fade-in");
    animacionEjecutada = true;
  }
});


gsap.registerPlugin(ScrollTrigger);
gsap.from (".h1img", {
  x: "100%",
  ease: "power1.out",
  scrollTrigger: {
      trigger: ".about_us",
      start: "top center",
      end: "center center",  
      markers:true,  //empieza cuando el scroll este en el top y termina en el final del div
      scrub: true,
  }
});


// creando evento para la imagen para about us para que vayamos a la pagina 
const tituloAboutUs = document.getElementById('about_us')
document.addEventListener(('onclick'),()=>{
  window.location.href= "aboutUs.html"
}

);

function goto(){
  window.location.href= "aboutUs.html";
}

