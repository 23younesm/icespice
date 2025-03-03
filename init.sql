CREATE DATABASE IF NOT EXISTS db;

CREATE TABLE IF NOT EXISTS creds (
    username VARCHAR(50),
    password VARCHAR(255)
);

INSERT INTO creds (username, password) VALUES
    ('admin', 'Passw0rd123!');
