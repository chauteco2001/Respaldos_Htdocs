var canvas = document.getElementById('gato');
var ctx = canvas.getContext("2d");

function app() {
    const imagenes = {
        gato: new Image(),
        raton: new Image()
    };
    imagenes.raton.src = 'public/imagenes/gato.jpg';
    imagenes.gato.src = 'public/imagenes/raton.jpg';

    const gato = {
        estados: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        ancho: canvas.width,
        alto: canvas.height,
        cuadropint: null,
        TurnoDJugador: 1,

        pintarRejilla: function () {
            var regilla = 5;
            var cuadro = 100;

            for (var i = 1; i < regilla; i++) {
                var x = i * cuadro;
                var y = i * cuadro;

                ctx.setLineDash([5, 5]);

                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'blue';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        },

        pintarEscenario: function () {
            ctx.beginPath();
            ctx.moveTo(200, 100);
            ctx.lineTo(200, 400);
            ctx.moveTo(300, 100);
            ctx.lineTo(300, 400);
            ctx.moveTo(100, 200);
            ctx.lineTo(400, 200);
            ctx.moveTo(100, 300);
            ctx.lineTo(400, 300);
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.strokeStyle = '#0c0b0b'; // Notación hexadecimal para el color
            ctx.stroke();
        },

        activarEstado: function (x, y) {
            var cuadroX = parseInt(x / 100);
            var cuadroY = parseInt(y / 100);

            if (this.estados[cuadroY][cuadroX] === 0) {
                this.estados[cuadroY][cuadroX] = this.TurnoDJugador;

                var imagen = this.TurnoDJugador === 1 ? imagenes.gato : imagenes.raton;
                ctx.drawImage(imagen, cuadroX * 100 + 105, cuadroY * 100 + 105, 90, 90);

                console.log('Se ha guardado el estado 1:', cuadroX, cuadroY);

                this.TurnoDJugador = this.TurnoDJugador === 1 ? 2 : 1;

                this.analizarJugador();
            }
        },

        analizarJugador: function () {
            // Verificar filas
            for (let i = 0; i < 3; i++) {
                if (this.estados[i][0] !== 0 &&
                    this.estados[i][0] === this.estados[i][1] &&
                    this.estados[i][1] === this.estados[i][2]) {
                    this.mostrarGanador(this.estados[i][0]);
                    return;
                }
            }

            // Verificar columnas
            for (let j = 0; j < 3; j++) {
                if (this.estados[0][j] !== 0 &&
                    this.estados[0][j] === this.estados[1][j] &&
                    this.estados[1][j] === this.estados[2][j]) {
                    this.mostrarGanador(this.estados[0][j]);
                    return;
                }
            }

            // Verificar diagonales
            if (this.estados[0][0] !== 0 &&
                this.estados[0][0] === this.estados[1][1] &&
                this.estados[1][1] === this.estados[2][2]) {
                this.mostrarGanador(this.estados[0][0]);
                return;
            }
            if (this.estados[0][2] !== 0 &&
                this.estados[0][2] === this.estados[1][1] &&
                this.estados[1][1] === this.estados[2][0]) {
                this.mostrarGanador(this.estados[0][2]);
                return;
            }

            // Verificar empate
            if (this.estados.flat().every((estado) => estado !== 0)) {
                this.mostrarEmpate();
            }
        },

        mostrarGanador: function (jugador) {
            var modal = document.getElementById('modal');
            var modalMessage = document.getElementById('modal-message');
            var modalAccept = document.getElementById('modal-accept');

            modalMessage.textContent = '¡Jugador ' + jugador + ' ha ganado!';
            modal.style.display = 'flex';

            // Trazar la línea ganadora
            this.trazarLineaGanadora(jugador);

            modalAccept.addEventListener('click', function () {
                modal.style.display = 'none';
                this.resetGame();
            }.bind(this));
        },

        mostrarEmpate: function () {
            var modal = document.getElementById('modal');
            var modalMessage = document.getElementById('modal-message');
            var modalAccept = document.getElementById('modal-accept');

            modalMessage.textContent = '¡Es un empate!';
            modal.style.display = 'flex';

            modalAccept.addEventListener('click', function () {
                modal.style.display = 'none';
                this.resetGame();
            }.bind(this));
        },

        resetGame: function () {
            // Limpia el tablero y reinicia el juego
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    this.estados[i][j] = 0;
                }
            }
            this.TurnoDJugador = 1;
            ctx.clearRect(0, 0, this.ancho, this.alto);
            this.play();
        },

        trazarLineaGanadora: function (jugador) {
            var estados = this.estados;

            // Verificar filas
            for (let i = 0; i < 3; i++) {
                if (estados[i][0] === jugador && estados[i][1] === jugador && estados[i][2] === jugador) {
                    this.trazarJugada(i, 'fila', jugador);
                    return;
                }
            }

            // Verificar columnas
            for (let j = 0; j < 3; j++) {
                if (estados[0][j] === jugador && estados[1][j] === jugador && estados[2][j] === jugador) {
                    this.trazarJugada(j, 'columna', jugador);
                    return;
                }
            }

            // Verificar diagonales
            if (estados[0][0] === jugador && estados[1][1] === jugador && estados[2][2] === jugador) {
                this.trazarJugada(0, 'diagonal', jugador);
                return;
            }
            if (estados[0][2] === jugador && estados[1][1] === jugador && estados[2][0] === jugador) {
                this.trazarJugada(1, 'diagonal', jugador);
                return;
            }
        },

        trazarJugada: function (indice, tipo, jugador) {
            ctx.beginPath();
            ctx.lineWidth = 5; // Grosor de la línea
            ctx.strokeStyle = jugador === 1 ? 'red' : 'black';

            if (tipo === 'fila') {
                ctx.moveTo(100, indice * 100 + 150);
                ctx.lineTo(400, indice * 100 + 150);
            } else if (tipo === 'columna') {
                ctx.moveTo(indice * 100 + 150, 100);
                ctx.lineTo(indice * 100 + 150, 400);
            } else if (tipo === 'diagonal') {
                if (indice === 0) {
                    ctx.moveTo(100, 100);
                    ctx.lineTo(400, 400);
                } else {
                    ctx.moveTo(400, 100);
                    ctx.lineTo(100, 400);
                }
            }

            ctx.stroke();
        },

        play: function () {
            this.pintarRejilla();
            this.pintarEscenario();
        }
    };

    canvas.addEventListener('mousedown', function (event) {
        gato.activarEstado(event.offsetX - 100, event.offsetY - 100);
    });

    gato.play();

    // Agregar evento al botón "Empezar de nuevo"
    var resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function () {
        gato.resetGame();
    });
}

window.onload = function () {
    app();
};
