//Import the mysql2 package
const mysql = require('mysql2');


// Connect to database using credentials in protected .env file
const connection = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    }
);

  // Listen for the 'connect' event to log a message when the connection is established
connection.on('connect', () => {
    console.log(`Connected to the personnel_db database.`);
  });

//Export this connection object so index.js and queries.js can both import and use this connection 
module.exports = connection;
