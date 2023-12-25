var express = require('express');
var router = express.Router();
const requireAuth = require('../middleware/authMiddleware'); // Requiere la función de middleware
const  calificacionesController = require('../controllers/CalificacionesController');


router.use(requireAuth);

router.get('/Estudiantes', calificacionesController.show_by_estudiantes);
router.post('/Estudiantes', calificacionesController.store_by_estudiantes);

router.get('/Consultar/Estudiantes', calificacionesController.search_by_estudiantes);
router.get('/Consultar/Estudiantes/:matricula/:cuatrimestre', calificacionesController.search_by_estudiante_with_matricula);
router.get('/Resumen/Estudiantes/:cuatrimestre', calificacionesController.show_all_calificaciones_by_cuatrimestre);

router.get('/Historial/Estudiantes', calificacionesController.show_historial_estudiante);
router.post('/Historial/:matricula', calificacionesController.get_historial_estudiante);

module.exports  =   router;
