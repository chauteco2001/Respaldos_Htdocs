// Crear un objeto JavaScript
const miObjeto = {
    propiedad1: 'Hola, esta es una propiedad',
    propiedad2: 42,
    funcionProceso: function() {
        // Agregar lógica de proceso aquí
        console.log('Ejecutando proceso...');
    },
    play: function() {
        // Llamar a la función de proceso cuando se hace clic en el botón
        this.funcionProceso();
    }
};

// Lógica para ejecutar cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    
    // Agregar un evento clic al botón "Reproducir" para llamar a la función play()
    playButton.addEventListener('click', function() {
        miObjeto.play();
    });
});
