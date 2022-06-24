const mysql = require('mysql2');

async function dbConnection() {
    const connecttion = mysql.createConnection({
        host: 'localhost',
        user: "root",
        password: "",
        database: "electrical"
    })
    return connecttion.promise();
}

module.exports = dbConnection;