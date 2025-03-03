CREATE DATABASE IF NOT EXISTS db;

CREATE TABLE IF NOT EXISTS creds (
    username VARCHAR(50),
    password VARCHAR(255)
);

INSERT INTO creds (username, password) VALUES
    ('admin', 'Balls69Password!'),
    ('TGM', 'TGMisVeryBalls!');

CREATE TABLE IF NOT EXISTS products (
    name VARCHAR(100),
    price DECIMAL(10, 2),
    image_url VARCHAR(255)
);

INSERT INTO products (name, price, image_url) VALUES
    ('Speedy Powder', '12.09', 'img/coke.jpg'),
    ('Funny Powder', '22.05', 'img/coke.jpg'),
    ('Giga Powder', '8.99', 'img/coke.jpg');
