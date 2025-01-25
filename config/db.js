const mysql = require("mysql2");

const db = mysql.createConnection({
    host: '68.66.251.61',
    port: 3306,
    user: 'akshay',
    password: 'LocalHealing7!',
    database: 'maha_meru'
});

db.connect(err => {
    if (err) {
        // console.log("Error connecting to MySQL database:", err);
    } else {
        // console.log("Connected to MySQL database");
    }
});

module.exports = db;
