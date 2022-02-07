const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = 3000;
const path = require("path");

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/testPost", (req, res) => {
  console.log(req.body);
  res.send("got your request");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
