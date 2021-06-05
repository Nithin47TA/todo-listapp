const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const listitem = ["hello"];
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public/"));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {

  res.render('list', {
    day: date.day(),
    list: listitem
  });
});

app.post("/", function(req, res) {
  listitem.push(req.body.Item);
  res.redirect("/");

});

app.listen(3000, function() {
  console.log("connected to port 3000");
});
