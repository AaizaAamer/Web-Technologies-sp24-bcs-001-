let express = require("express");
let path = require("path");

let app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  return res.render("index");
});

app.listen(3000, function () {
  console.log(`Server is running on http://localhost:3000`);
});
