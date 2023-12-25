const connection = require("../bin/connection");
const bcrypt = require("bcrypt");

function to_login(req, resp, next) {

    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT u.id, u.nombre_completo, u.correo_electronico, u.password, u.id_rol FROM usuarios u WHERE u.correo_electronico = ?`;

    connection.query(query, [username], function (error, results) {
        if (error) {
            throw error;
        }

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    throw err;
                }

                if (isMatch) {
                    req.session.logged = true;
                    req.session.user = user;
                    resp.redirect('/');
                } else {
                    resp.redirect('/login'); // Redirige al formulario de inicio de sesión
                }
            });
        } else {
            resp.redirect('/login'); // Redirige al formulario de inicio de sesión
        }
    });
}

module.exports  =   {
    to_login
}
