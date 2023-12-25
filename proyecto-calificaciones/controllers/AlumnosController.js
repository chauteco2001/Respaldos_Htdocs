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



    let alumnos    =   [];

    const queryAlumno   =   'SELECT \n' +
        '    a.id,\n' +
        '    a.matricula,\n' +
        '    a.nombre,\n' +
        '    a.apellido_paterno,\n' +
        '    a.apellido_materno,\n' +
        '    CASE WHEN a.genero = 1 THEN \'masculino\' WHEN a.genero = 2 THEN \'femenino\' ELSE \'desconocido\' END AS genero,\n' +
        '    DATE_FORMAT(a.fecha_nacimiento, \'%d-%m-%Y\') as fecha_nacimiento,\n' +
        '    YEAR(CURDATE()) - YEAR(a.fecha_nacimiento) - (RIGHT(CURDATE(), 5) < RIGHT(a.fecha_nacimiento, 5)) AS edad,\n' +
        '    a.id_domicilio,\n' +
        '    CONCAT(d.calle, \', \', d.colonia, \', \', d.numero) AS direccion\n' +
        'FROM alumnos a\n' +
        'INNER JOIN domicilio d ON d.id = a.id_domicilio\n';

    connection.query(queryAlumno,[], function (error, results) {
        if (error) {
            console.error('Error al consultar en la base de datos:', error);
            resp.status(500).send('Error al guardar los datos');
        } else {
            alumnos =   results;
            resp.render('alumnos/index', {data, newRegister,updateRegister, alumnos});
        }
    });

}
function create(req, resp, nex) {
    resp.render('alumnos/create');
}
function store(req, resp, next) {

    /** INSERTAMOS UN DOMICILIO*/
    const domicilio = {
        id: null,
        calle: req.body.calle,
        colonia: req.body.colonia,
        numero: req.body.numero
    };

    const queryDomicilio = 'INSERT INTO domicilio SET ?';

    connection.query(queryDomicilio, domicilio, function (error, results) {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            resp.status(500).send('Error al guardar los datos');
        } else {
            console.log('Datos guardados correctamente:', results);
            domicilio.id    =   results.insertId;



            /** INSERTAMOS UN ALUMNO */
            const queryAlumnos = 'INSERT INTO alumnos SET ?';

            const alumno = {
                id: null,
                nombre: req.body.nombre,
                matricula: req.body.matricula,
                apellido_paterno: req.body.apellido_paterno,
                apellido_materno: req.body.apellido_materno,
                genero: req.body.genero,
                fecha_nacimiento: req.body.fecha_nacimiento,
                id_domicilio:   domicilio.id,
            };

            connection.query(queryAlumnos, alumno, function(error, results) {
                if (error) {
                    console.error('Error al insertar en la base de datos:', error);
                    resp.status(500).send('Error al guardar los datos');
                } else {
                    console.log('Datos guardados correctamente:', results);
                    alumno.id   =   results.insertId;
                    req.session.newRegister =   true;
                    req.session.data =   alumno;

                    resp.redirect('/Alumnos');
                }
            });

        }
    });
}

function edit(req, resp, next) {
    if (req.params.id){
        const id = +req.params.id;
        const queryEdit =   'SELECT a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, a.genero, a.fecha_nacimiento, a.id_domicilio \n' +
            'FROM alumnos a \n' +
            'WHERE a.id = ?';

        connection.query(queryEdit,[id], function (error, results) {
            if (error) {
                console.error('Error al consultar en la base de datos:', error);

            } else {
                let alumno =   results[0];
                connection.query('SELECT\n' +
                    '\tid, calle, colonia, numero\n' +
                    'FROM\n' +
                    '\tdomicilio o', [alumno.id_domicilio] , function (error2, results2) {

                    let domicilio   =   results2[0];
                    resp.render('alumnos/edit', {alumno, domicilio});
                })

            }
        });


    }else {
        resp.redirect('/Alumnos');
    }
}


function update(req, resp, next) {
    if (req.params.id) {
        const id = +req.params.id;

        // Obtener los datos del formulario
        const { matricula, nombre, apellido_paterno, apellido_materno, genero, fecha_nacimiento, id_domicilio, calle, colonia, numero } = req.body;

        ;

        // Actualizar datos en la tabla alumnos
        const queryUpdateAlumno = 'UPDATE alumnos SET matricula = ?, nombre = ?, apellido_paterno = ?, apellido_materno = ?, genero = ?, fecha_nacimiento = ?, id_domicilio = ? WHERE id = ?';
        connection.query(queryUpdateAlumno, [matricula, nombre, apellido_paterno, apellido_materno, genero, fecha_nacimiento, id_domicilio, id], function (error, results) {
            if (error) {
                console.error('Error al actualizar en la base de datos:', error);
                resp.status(500).send('Error al actualizar los datos');
            } else {
                // Actualizar datos en la tabla domicilio
                const queryUpdateDomicilio = 'UPDATE domicilio SET calle = ?, colonia = ?, numero = ? WHERE id = ?';

                connection.query(queryUpdateDomicilio, [calle, colonia, numero, id_domicilio], function (error, results) {
                    if (error) {
                        console.error('Error al actualizar en la base de datos:', error);
                        resp.status(500).send('Error al actualizar los datos');
                    } else {
                        let alumno  =   {matricula, nombre, apellido_paterno, apellido_materno, genero, fecha_nacimiento, id_domicilio, id};
                        let domicilio   =   {calle, colonia, numero, id_domicilio}
                        req.session.updateRegister  =   true;
                        req.session.data  = {matricula, nombre, apellido_paterno, apellido_materno, genero, fecha_nacimiento, id_domicilio, id};
                        resp.redirect('/Alumnos');
                    }
                });
            }
        });
    } else {
        resp.redirect('/Alumnos');
    }
}

function remove(req, resp, next) {
    if (req.params.id){
        const id =+req.params.id;
        const queryDelete = 'DELETE FROM alumnos WHERE id = ?';

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

module.exports  =   {
  index,
    create,
    store,
    edit,
    update,
    remove
};
