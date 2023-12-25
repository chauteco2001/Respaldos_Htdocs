const bcrypt = require('bcrypt');

const plainPassword = '123';

bcrypt.hash(plainPassword, 10, function(err, hash) {
    if (err) {
        console.error('Error al encriptar la contraseña:', err);
    } else {
        console.log('Contraseña encriptada:', hash);
    }
});
