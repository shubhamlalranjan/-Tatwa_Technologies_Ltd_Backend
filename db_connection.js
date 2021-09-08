const config = require("config");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: config.get("DB_HOST"),
  user: config.get("DB_USER"),
  password: config.get("DB_PASS"),
  database: config.get("DB_NAME"),
});

connection.connect((err) => {
  if (err) {
    console.log(error);
  }
});
module.exports = connection;
