-- Esta es nuestra base de datos que usamos en nuestro proyecto
CREATE DATABASE proyecto;

USE proyecto;

-- Tabla de los usuarios
CREATE TABLE usuarios(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    usurname VARCHAR(16) NOT NULL, 
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

-- Tabla de las tareas 
CREATE TABLE tareas(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    user_id INT(11), 
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usuarios(id)
);
