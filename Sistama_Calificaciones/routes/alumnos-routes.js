var express = require('express');
var router = express.Router();
const requireAuth = require('../middleware/authMiddleware'); // Requiere la función de middleware
const  AlumnosController = require('../controllers/AlumnosController');


router.use(requireAuth);

router.get('/', AlumnosController.index);
router.get('/Crear', AlumnosController.create);
router.post('/Store', AlumnosController.store)
router.get('/:id/Editar', AlumnosController.edit);
router.post('/Update/:id', AlumnosController.update);
router.delete('/:id/Eliminar', AlumnosController.remove);
module.exports  =   router;
