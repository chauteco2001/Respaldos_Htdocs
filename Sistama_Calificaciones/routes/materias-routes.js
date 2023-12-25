var express = require('express');
var router = express.Router();
const requireAuth = require('../middleware/authMiddleware'); // Requiere la función de middleware
const  MateriasController = require('../controllers/MateriasController');


router.use(requireAuth);

router.get('/', MateriasController.index);
router.get('/:cuatrimestre/Cuatrimestres', MateriasController.show_by_cuatrimestres);
router.get('/Crear', MateriasController.create);
router.post('/Store', MateriasController.store)
router.get('/:id/Editar', MateriasController.edit);
router.post('/Update/:id', MateriasController.update);
router.delete('/:id/Eliminar', MateriasController.remove);
router.post('/ByCuatrimestres', MateriasController.by_cuatrimestres);

module.exports  =   router;
