const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "192.168.64.2",
  user: "notes_user",
  password: "z4y&2CbUK+",
  database: "assignment3",
});

module.exports = connection;
