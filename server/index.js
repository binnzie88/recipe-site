const express = require('express');
var app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Recipe server listening at http://localhost:${port}`);
});