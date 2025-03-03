const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret: 'secret-key', // Change this key to something unique
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true, 
        secure: false,  // Set to true if you're using HTTPS
        maxAge: 60000   // 1 minute, you can adjust this as needed
    }
}));

// Create a connection pool for MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost", // Use "db" since it's the service name in docker-compose
    user: process.env.DB_USER || "sqluser",
    password: process.env.DB_PASSWORD || "Passw0rd123!",
    database: process.env.DB_NAME || "db",
    connectionLimit: 10 // Limit the number of connections in the pool
});

// Retry mechanism for MySQL connection
function connectToDatabase() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
        } else {
            console.log("Connected to MySQL Database");
            connection.release(); // Release the connection back to the pool
        }
    });
}

// Try connecting on initial start
connectToDatabase();

// Logout endpoint
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Failed to logout.");
        }
        res.send("Logged out successfully!");
    });
});

// Admin Page with File Upload
app.get("/admin", (req, res) => {
    if (req.session.user && req.session.user.username === 'admin') {
        res.send(`
            <h1>Welcome Admin!</h1>
            <p>Your flag is: sillyCTF{Icey-Admin}</p>
        `);
    } else {
        res.status(403).send("Forbidden: You must be logged in as admin to view this page. Please go log in as an Admin user and try again");
    }
});


// Login Endpoint with SQL Injection Vulnerability
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Directly inserting user input into query (vulnerable to SQL injection)
    const query = `SELECT * FROM creds WHERE username = '${username}' AND password = '${password}'`;

    console.log("Executing SQL Query:", query); // For debugging

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send("Database error");
        }

        if (results.length > 0) {
            // Set the user in the session after login
            req.session.user = { username: results[0].username, password: results[0].password };

            // Include both username and password in the response
            res.send(`Welcome, ${results[0].username}! Your password is: ${results[0].password}`);
        } else {
            res.status(401).send("Invalid credentials");
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
