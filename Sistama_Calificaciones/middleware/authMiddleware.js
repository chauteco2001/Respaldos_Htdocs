// middleware/authMiddleware.js
const requireAuth = (req, res, next) => {
    if (req.session.logged) {
      // Usuario autenticado, permite el acceso
      next();
    } else {
      // Usuario no autenticado, redirige a la página de inicio de sesión
      res.redirect('/login');
    }
  };
  
  module.exports = requireAuth;
  