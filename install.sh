# Update and upgrade system packages
sudo apt update && sudo apt upgrade -y

# Install MySQL
sudo apt install mysql-server -y

sudo systemctl start mysql && sudo systemctl enable mysql

sudo mysql -u root -p -e "
    CREATE DATABASE db;

    CREATE USER 'sqluser'@'localhost' IDENTIFIED BY 'Passw0rd123!';
    GRANT ALL PRIVILEGES ON db.* TO 'sqluser'@'localhost';
    FLUSH PRIVILEGES;

    USE db;

    CREATE TABLE creds (
        username VARCHAR(50),
        password VARCHAR(255)
    );

    INSERT INTO creds (username, password)
    VALUES
        ('admin', 'Passw0rd123!');
sudo mysql -u sqluser -p password -e "
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Passw0rd123!';
FLUSH PRIVILEGES;
"

# Install Git
git clone https://github.com/23younesm/icespice.git

cd icespice

# Install Node.js and npm
sudo apt install nodejs npm -y

# Install required Node.js dependencies
npm install
npm install express mysql2 cors fs path multer body-parser express-session

# Start your Node.js app
node server/server.js
