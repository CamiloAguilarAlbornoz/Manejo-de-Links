CREATE DATABASE db_links;
USE db_links;

------------------ Tabla de usuarios ----------------
CREATE TABLE users(
    id_user INT(11) NOT NULL,
    email_user VARCHAR(250) NOT NULL,
    password_user VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    isEnabled BOOLEAN NOT NULL
);

ALTER TABLE users 
    ADD PRIMARY KEY (id_user);
ALTER TABLE users 
    MODIFY id_user INT(11) NOT NULL AUTO_INCREMENT, 
    AUTO_INCREMENT = 2;
ALTER TABLE users 
    MODIFY isEnabled BOOLEAN NOT NULL 
    DEFAULT 1;
ALTER TABLE users
    MODIFY email_user VARCHAR(250) NOT NULL
    UNIQUE;

DESC users;
----------------- Tabla de links ----------------------------
CREATE TABLE links(
    id_link INT(11) NOT NULL,
    id_user INT(11) NOT NULL,
    title VARCHAR(60) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL
);

ALTER TABLE links 
    ADD PRIMARY KEY (id_link);
ALTER TABLE links 
    MODIFY id_link INT(11) NOT NULL AUTO_INCREMENT, 
    AUTO_INCREMENT = 2;
ALTER TABLE links 
    ADD CONSTRAINT fk_users 
    FOREIGN KEY (id_user) 
    REFERENCES users(id_user);
ALTER TABLE links 
    MODIFY created_at TIMESTAMP NOT NULL 
    DEFAULT current_timestamp;

DESC links;