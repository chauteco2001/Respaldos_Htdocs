const connection = require("../bin/connection");

function getParameters(session, ...params) {
    const result = {};

    for (const param of params) {
        if (param in session) {
            result[param] = session[param];
            session[param] = null; // Limpia el valor de la sesión si existe
        } else {
            result[param] = null;
        }
    }

    return result;
}

function index(req, resp, next) {

    // Implementación en tu código
    const { newRegister = false } = getParameters(req.session, 'newRegister');
    const { updateRegister = false } = getParameters(req.session, 'updateRegister');
    const { data = {} } = getParameters(req.session, 'data');
    

    let materias    =   [];

    const queryMateria   =   'SELECT\n' +
        '\tid, clave_materia, nombre, cuatrimestre\n' +
        'FROM\n' +
        '\tmaterias s;';

    connection.query(queryMateria,[], function (error, results) {
        if (error) {
            console.error('Error al consultar en la base de datos:', error);
            resp.status(500).send('Error al guardar los datos');
        } else {
            materias =   results;
            resp.render('materias/index', {data, newRegister,updateRegister, materias});
        }
    });

}
function create(req, resp, nex) {
    resp.render('materias/create');
}
function store(req, resp, next) {

    /** INSERTAMOS UN DOMICILIO*/
    const materia = {
        id: null,
        clave_materia: req.body.clave_materia,
        nombre: req.body.nombre,
        cuatrimestre: req.body.cuatrimestre
    };

    const queryMateria = 'INSERT INTO materias SET ?';

    connection.query(queryMateria, materia, function (error, results) {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            resp.status(500).send('Error al guardar los datos');
        } else {
            console.log('Datos guardados correctamente:', results);
            materia.id   =   results.insertId;
            req.session.newRegister =   true;
            req.session.data =   materia;

            resp.redirect('/Materias');
        }
    });
}

function edit(req, resp, next) {
    if (req.params.id){
        const id = +req.params.id;
        const queryEdit =   ' SELECT\n' +
            '\tid, clave_materia, nombre, cuatrimestre\n' +
            'FROM\n' +
            '\tmaterias m WHERE m.id = ?';

        connection.query(queryEdit,[id], function (error, results) {
            if (error) {
                console.error('Error al consultar en la base de datos:', error);

            } else {
                let materia =   results[0];

                resp.render('materias/edit', {materia});

            }
        });


    }else {
        resp.redirect('/Materias');
    }
}


function update(req, resp, next) {
    if (req.params.id) {
        const id = +req.params.id;

        // Obtener los datos del formulario
        const { clave_materia, nombre, cuatrimestre } = req.body;;

        // Actualizar datos en la tabla materias
        const queryUpdateMateria = 'UPDATE materias SET clave_materia = ?, nombre = ?, cuatrimestre = ? WHERE id = ?';
        connection.query(queryUpdateMateria, [ clave_materia, nombre, cuatrimestre, id], function (error, results) {
            if (error) {
                console.error('Error al actualizar en la base de datos:', error);
                resp.status(500).send('Error al actualizar los datos');
            } else {
                req.session.updateRegister  =   true;
                req.session.data  = { clave_materia, nombre, cuatrimestre, id};
                resp.redirect('/Materias');
            }
        });
    } else {
        resp.redirect('/Materias');
    }
}


function remove(req, resp, next) {
    if (req.params.id){
        const id =+req.params.id;
        const queryDelete = 'DELETE FROM materias WHERE id = ?';

        connection.query(queryDelete, [id], function(error, results) {
            if (error) {
                console.error('Error al eliminar en la base de datos:', error);
                resp.status(500).json({ message: 'Error al eliminar el registro' });
            } else {
                console.log('Registro eliminado correctamente:', results);
                resp.json({ message: 'Registro eliminado correctamente' });
            }
        });

    }
}

function show_by_cuatrimestres(req, resp) {
    // Implementación en tu código
    const { newRegister = false } = getParameters(req.session, 'newRegister');
    const { updateRegister = false } = getParameters(req.session, 'updateRegister');
    const { data = {} } = getParameters(req.session, 'data');


    let materias    =   [];
    const cuatrimestre  =   +req.params.cuatrimestre;

    const queryMateria   =   'SELECT\n' +
        '\tid, clave_materia, nombre, cuatrimestre\n' +
        'FROM\n' +
        '\tmaterias s WHERE s.cuatrimestre = ?';

    connection.query(queryMateria,[cuatrimestre], function (error, results) {
        if (error) {
            console.error('Error al consultar en la base de datos:', error);
            resp.status(500).send('Error al guardar los datos');
        } else {
            materias =   results;
            resp.render('materias/by-cuatrimestres', {data, newRegister,updateRegister, materias, cuatrimestre});
        }
    });
}

function by_cuatrimestres(req, resp) {
    // Implementación en tu código


    let materias    =   [];
    const cuatrimestre  =   +req.body.cuatrimestre;

    const queryMateria   =   'SELECT\n' +
        '\tid, clave_materia, nombre, cuatrimestre\n' +
        'FROM\n' +
        '\tmaterias s WHERE s.cuatrimestre = ?';

    connection.query(queryMateria,[cuatrimestre], function (error, results) {
        if (error) {
            console.error('Error al consultar en la base de datos:', error);
            resp.status(500).send('Error al guardar los datos');
        } else {
            materias =   results;
            resp.send({data: materias});
        }
    });
}

module.exports  =   {
    index,
    create,
    store,
    edit,
    update,
    remove,
    show_by_cuatrimestres,
    by_cuatrimestres
};
