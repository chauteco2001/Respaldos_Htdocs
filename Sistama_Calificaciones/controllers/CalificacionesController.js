const connection = require("../bin/connection");

function show_by_estudiantes(req, resp) {

  const cuatrimestre  = req.body.cuatrimestre ?? 1;
  let alumnos    =   [];

  const queryAlumno   =   'SELECT \n' +
      '    a.id,\n' +
      '    a.matricula,\n' +
      '    a.nombre,\n' +
      '    a.apellido_paterno,\n' +
      '    a.apellido_materno\n' +
      'FROM alumnos a\n' ;

  connection.query(queryAlumno,[], function (error, results) {
    if (error) {
      console.error('Error al consultar en la base de datos:', error);
      resp.status(500).send('Error al guardar los datos');
    } else {
      alumnos =   results;
      resp.render('calificaciones/estudiantes', {cuatrimestre, alumnos});
    }
  });


}

// {"cuatrimestre":"1","materia":"1","parcial":"1","alumno[]":"1","calificacion[]":"10"}
function store_by_estudiantes(req, resp) {
  let alumnos = req.body['alumno[]'];
  let calificaciones = req.body['calificacion[]'];
  const cuatrimestre = req.body.cuatrimestre;
  const materia = req.body.materia;
  const parcial = req.body.parcial;


  if (!Array.isArray(alumnos)){
    alumnos = [alumnos];
  }
  if (!Array.isArray(calificaciones)){
    calificaciones  = [calificaciones];
  }

  if (
      alumnos &&
      calificaciones &&
      alumnos.length === calificaciones.length &&
      cuatrimestre &&
      materia &&
      parcial
  ) {
    const selectQuery =
        "SELECT * FROM calificaciones WHERE id_materia = ? AND id_alumno = ?";
    const updateQuery =
        `UPDATE calificaciones SET parcial${parcial} = ? WHERE id_materia = ? AND id_alumno = ?`;
    const insertQuery =
        "INSERT INTO calificaciones (parcial1, parcial2, parcial3, extraordinario, id_materia, id_alumno) " +
        "VALUES (?, ?, ?, ?, ?, ?)";

    for (let i = 0; i < alumnos.length; i++) {
      const calif = calificaciones[i];

      connection.query(selectQuery, [materia, alumnos[i]], function (error, results) {
        if (error) {
          console.error("Error al consultar en la base de datos:", error);
        } else {
          if (results.length > 0) {
            const updateValues = [calif, materia, alumnos[i]];
            connection.query(updateQuery, updateValues, function (error, updateResult) {
              if (error) {
                console.error("Error al actualizar en la base de datos:", error);
              } else {
                console.log("Datos actualizados correctamente:", updateResult);
              }
            });
          } else {
            const parcialValues = [null, null, null, null];
            parcialValues[parcial - 1] = calif;
            const insertValues = [...parcialValues, materia, alumnos[i]];

            connection.query(insertQuery, insertValues, function (error, insertResult) {
              if (error) {
                console.error("Error al insertar en la base de datos:", error);
              } else {
                console.log("Datos insertados correctamente:", insertResult);
              }
            });
          }
        }
      });
    }

    resp.redirect("/");
  } else {
    resp.status(400).send("Datos incorrectos en la solicitud: " + JSON.stringify(req.body));
  }
}

function search_by_estudiantes(req,resp) {
  resp.render('calificaciones/boleta-alumno');
}


function search_by_estudiante_with_matricula(req, resp) {
  const matricula = req.params.matricula;
  const cuatrimestre = req.params.cuatrimestre;

  const queryCalificaciones =
      `SELECT m.clave_materia, m.nombre, IFNULL(c.parcial1, '-') AS parcial1, IFNULL(c.parcial2, '-') AS parcial2, IFNULL(c.parcial3, '-') AS parcial3, IFNULL(c.extraordinario, '-') AS extraordinario
     FROM materias AS m
     LEFT JOIN calificaciones AS c ON m.id = c.id_materia AND c.id_alumno = (SELECT id FROM alumnos WHERE matricula = ?)
     WHERE m.cuatrimestre = ?`;

  const queryAlumno =
      `SELECT * FROM alumnos WHERE matricula = ?`;

  const results = {};

  connection.query(queryCalificaciones, [matricula, cuatrimestre], function(error, calificacionesResults) {
    if (error) {
      console.error("Error al consultar en la base de datos:", error);
      resp.status(500).send("Error al buscar los datos");
    } else {
      results.calificaciones = calificacionesResults;

      connection.query(queryAlumno, [matricula], function(alumnoError, alumnoResult) {
        if (alumnoError) {
          console.error("Error al consultar el alumno en la base de datos:", alumnoError);
          resp.status(500).send("Error al buscar los datos del alumno");
        } else {
          if (alumnoResult.length === 0) {
            results.calificaciones  = [];
            results.alumno  = {};
            resp.status(200).send(results);
          } else {
            results.alumno = alumnoResult[0];
            resp.status(200).json(results);
          }
        }
      });
    }
  });
}


function show_all_calificaciones_by_cuatrimestre(req, resp) {
  const cuatrimestre = req.params.cuatrimestre;

  const queryEstudiantes =
      `SELECT id, matricula, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo
     FROM alumnos`;

  const queryMaterias =
      `SELECT id, nombre
     FROM materias
     WHERE cuatrimestre = ?`;

  connection.query(queryEstudiantes, function(estudiantesError, estudiantesResults) {
    if (estudiantesError) {
      console.error("Error al consultar estudiantes en la base de datos:", estudiantesError);
      resp.status(500).send("Error al buscar los estudiantes");
    } else {
      connection.query(queryMaterias, [cuatrimestre], function(materiasError, materiasResults) {
        if (materiasError) {
          console.error("Error al consultar materias en la base de datos:", materiasError);
          resp.status(500).send("Error al buscar las materias");
        } else {
          const estudiantes = estudiantesResults;
          const materias = materiasResults;

          const calificacionesQuery =
              `SELECT c.id_alumno, c.id_materia, AVG((IFNULL(c.parcial1,0) + IFNULL(c.parcial2, 0) + IFNULL(c.parcial3, 0)) /3) AS promedio_individual
             FROM calificaciones AS c
             INNER JOIN materias AS m ON c.id_materia = m.id
             WHERE m.cuatrimestre = ?
             GROUP BY c.id_alumno, c.id_materia`;

          connection.query(calificacionesQuery, [cuatrimestre], function(calificacionesError, calificacionesResults) {
            if (calificacionesError) {
              console.error("Error al consultar calificaciones en la base de datos:", calificacionesError);
              resp.status(500).send("Error al buscar las calificaciones");
            } else {
              const info = {};

              info.estudiantes = estudiantes;
              info.materias = materias;

              calificacionesResults.forEach(function(row) {
                if (!info[row.id_alumno]) {
                  info[row.id_alumno] = {};
                }
                info[row.id_alumno][row.id_materia] = row.promedio_individual;
              });

              info.promediosMaterias = {};
              materias.forEach(function(materia) {
                const materiaId = materia.id;
                let total = 0;
                let count = 0;
                estudiantes.forEach(function(estudiante) {
                  if (info[estudiante.id] && info[estudiante.id][materiaId] !== undefined) {
                    total += info[estudiante.id][materiaId];
                    count++;
                  }
                });
                if (count > 0) {
                  info.promediosMaterias[materiaId] = total / count;
                } else {
                  info.promediosMaterias[materiaId] = null;
                }
              });

              resp.render('calificaciones/all-calificaciones', { cuatrimestre, info });
            }
          });
        }
      });
    }
  });
}

function show_historial_estudiante(req, resp) {
  resp.render('calificaciones/historial-estudiante')
}

function get_historial_estudiante(req, resp) {
  const matricula = req.body.matricula;

  const queryAlumno = `SELECT id, matricula, nombre, apellido_paterno, apellido_materno, genero, fecha_nacimiento, id_domicilio FROM alumnos WHERE matricula = ?`;

  connection.query(queryAlumno, [matricula], function (error, alumnoResults) {
    if (error) {
      console.error("Error al consultar en la base de datos:", error);
      resp.status(500).send("Error al buscar los datos");
    } else {
      //resp.send(alumnoResults);
      if (alumnoResults.length === 0) {
        resp.send({ status: 404 });
      } else {
        const alumno = alumnoResults[0];

        const queryMaterias = `SELECT id, nombre, cuatrimestre FROM materias`;

        connection.query(queryMaterias, function (materiasError, materiasResults) {
          if (materiasError) {
            console.error("Error al consultar materias en la base de datos:", materiasError);
            resp.status(500).send("Error al buscar las materias");
          } else {
            const materias = materiasResults;

            const queryCalificaciones = `SELECT m.cuatrimestre, m.clave_materia, m.nombre AS nombre_materia, c.parcial1, c.parcial2, c.parcial3, c.extraordinario
                                         FROM materias AS m
                                         LEFT JOIN calificaciones AS c ON m.id = c.id_materia AND c.id_alumno = ?
                                         WHERE m.cuatrimestre <= (SELECT MAX(cuatrimestre) FROM materias)
                                         ORDER BY m.cuatrimestre`;

            connection.query(queryCalificaciones, [alumno.id], function (calificacionesError, calificacionesResults) {
              if (calificacionesError) {
                console.error("Error al consultar calificaciones en la base de datos:", calificacionesError);
                resp.status(500).send("Error al buscar las calificaciones");
              } else {
                const historial = [];
                let cuatrimestre = 0;
                let cuatrimestreData = null;

                calificacionesResults.forEach(function (row) {
                  if (row.cuatrimestre !== cuatrimestre) {
                    if (cuatrimestreData !== null) {
                      historial.push(cuatrimestreData);
                    }
                    cuatrimestreData = {
                      cuatrimestre: row.cuatrimestre,
                      materias: [],
                    };
                    cuatrimestre = row.cuatrimestre;
                  }

                  cuatrimestreData.materias.push({
                    clave_materia: row.clave_materia,
                    nombre_materia: row.nombre_materia,
                    parcial1: row.parcial1 !== null ? row.parcial1.toFixed(2) : '-',
                    parcial2: row.parcial2 !== null ? row.parcial2.toFixed(2) : '-',
                    parcial3: row.parcial3 !== null ? row.parcial3.toFixed(2) : '-',
                    extraordinario: row.extraordinario !== null ? row.extraordinario.toFixed(2) : '-',
                  });
                });

                if (cuatrimestreData !== null) {
                  historial.push(cuatrimestreData);
                }

                resp.status(200).json({ alumno, historial });
              }
            });
          }
        });
      }
    }
  });
}



module.exports  =   {
  show_by_estudiantes,
  store_by_estudiantes,
  search_by_estudiantes,
  search_by_estudiante_with_matricula,
  show_all_calificaciones_by_cuatrimestre,
  show_historial_estudiante,
  get_historial_estudiante
};
