const express = require('express');
var app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');

var mysql = require('mysql2');
require('dotenv').config();

var pool = mysql.createPool({
  connectionLimit : 5,
  host            : process.env.RDS_HOSTNAME,
  user            : process.env.RDS_USERNAME,
  password        : process.env.RDS_PASSWORD,
  port            : process.env.RDS_PORT
})

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));

app.get("/api/", (req, res) => {
  res.json({ message: "You've reached the server!" });
});

app.get("/api/recipes/", (req, res) => {
  const query = 'SELECT * FROM recipes.RecipeTable';

  pool.query(
    query,
    function (error, results, fields) {
      if (error) {
        console.log("Error querying recipes.");
        res.json({ error: error });
      } else {
        console.log("Successfully queried recipes.");
        console.log(results);
        res.json({ recipes: results });
      }
    }
  );
});

app.get("/api/recipe/*", (req, res) => {
  const query = 'SELECT * FROM recipes.RecipeTable WHERE id="'+req.params[0]+'"';
  console.log("QUERY");
  console.log(query);

  pool.query(
    query,
    function (error, results, fields) {
      if (error) {
        console.log("Error querying recipe.");
        res.json({ error: error });
      } else {
        console.log("Successfully queried recipe.");
        console.log(results);
        res.json({ recipe: results });
      }
    }
  );
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Recipe server listening at http://localhost:${port}`);
});