const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cookieSession = require('cookie-session')


const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['H26x5!PnL0LE'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/** ROUTES USE */

const indexRouter = require('./routes/index');
const authRouter  = require('./routes/auth');
const alumnosRouter  = require('./routes/alumnos-routes');
const materiasRouter  = require('./routes/materias-routes');
const calificacionesRouter  = require('./routes/calificaciones-routes');

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/Alumnos', alumnosRouter);
app.use('/Materias', materiasRouter);
app.use('/Calificaciones', calificacionesRouter);

/** ROUTES USE */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
