// middleware/notAuthMiddleware.js
const notRequireAuth = (req, res, next) => {
    if (!req.session.logged) {
        // Usuario autenticado, permite el acceso
        next();
    } else {
        // Usuario no autenticado, redirige a la página de inicio de sesión
        res.redirect('/');
    }
};

module.exports = notRequireAuth;
