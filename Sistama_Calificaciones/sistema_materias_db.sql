CREATE SCHEMA sistema_db;

CREATE  TABLE calificaciones ( 
	id                   INT UNSIGNED NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	parcial1             INT UNSIGNED      ,
	parcial2             INT UNSIGNED      ,
	parcial3             INT UNSIGNED      ,
	extraordinario       INT UNSIGNED      ,
	id_materia           INT UNSIGNED NOT NULL     ,
	id_alumno            INT UNSIGNED NOT NULL     
 ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE  TABLE domicilio ( 
	id                   INT UNSIGNED NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	calle                VARCHAR(255)       ,
	colonia              VARCHAR(255)       ,
	numero               VARCHAR(10)       
 ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE  TABLE materias ( 
	id                   INT UNSIGNED NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	clave_materia        VARCHAR(10)  NOT NULL     ,
	nombre               VARCHAR(255)  NOT NULL     ,
	cuatrimestre         INT UNSIGNED NOT NULL     
 ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE  TABLE usuarios ( 
	id                   INT UNSIGNED NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	nombre_completo      VARCHAR(255)  NOT NULL     ,
	correo_electronico   VARCHAR(255)  NOT NULL     ,
	password             VARCHAR(255)  NOT NULL     ,
	id_rol               INT UNSIGNED NOT NULL     
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE  TABLE alumnos ( 
	id                   INT UNSIGNED NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	matricula            VARCHAR(10)  NOT NULL     ,
	nombre               VARCHAR(255)  NOT NULL     ,
	apellido_paterno     VARCHAR(255)  NOT NULL     ,
	apellido_materno     VARCHAR(255)  NOT NULL     ,
	genero               INT  NOT NULL     ,
	fecha_nacimiento     DATE  NOT NULL     ,
	id_domicilio         INT UNSIGNED NOT NULL     
 ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE INDEX fk_alumnos_domicilio ON alumnos ( id_domicilio );

ALTER TABLE alumnos ADD CONSTRAINT fk_alumnos_domicilio FOREIGN KEY ( id_domicilio ) REFERENCES domicilio( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;
