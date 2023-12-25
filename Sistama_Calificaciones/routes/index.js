var express = require('express');
var router = express.Router();
const requireAuth = require('../middleware/authMiddleware'); // Requiere la función de middleware



/* GET home page. */
router.get('/', requireAuth, function(req, res, next) {
  res.render('index');
});

module.exports = router;
