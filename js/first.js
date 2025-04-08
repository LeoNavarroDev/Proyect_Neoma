document.addEventListener('DOMContentLoaded', function() {
    let hasTriggered = false;
    
    function iniciarAnimacion() {
        if (hasTriggered) return;
        hasTriggered = true;
        
        const loaderElement = document.querySelector('.loader');
        loaderElement.classList.add('windowchange');

        loaderElement.addEventListener('animationend', function() {
            window.location.href = "espacio.html";
        });
    }

    // Escuchar eventos de desplazamiento con ratón
    window.addEventListener('wheel', iniciarAnimacion, { once: true });

    // Escuchar eventos de toque en dispositivos móviles
    window.addEventListener('touchmove', iniciarAnimacion, { once: true });
});
