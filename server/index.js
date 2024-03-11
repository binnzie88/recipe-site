const express = require('express');
var app = express();
const port = 9000;
const cors = require('cors');

var mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    console.error(err);
    return;
  }
  console.log('Connected to database.');
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "You've reached the server!" });
});

app.get("/recipes/", (req, res) => {
  const query = 'SELECT * FROM recipes.RecipeTable';
  connection.query(query, (error, results) => {
    if (error) {
      console.log("Error querying recipes.");
      res.json({ error: error });
    } else {
      console.log("Successfully queried recipes.");
      res.json({ recipes: results });
    }
  });
});

app.get("/recipe/*", (req, res) => {
  const query = 'SELECT * FROM recipes.RecipeTable WHERE id="'+req.params[0]+'"';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.log("Error querying recipe.");
      res.json({ error: error });
    } else {
      console.log("Successfully queried recipe.");
      res.json({ recipe: results });
    }
  });
});

app.listen(port, () => {
  console.log(`Recipe server listening at http://localhost:${port}`);
});