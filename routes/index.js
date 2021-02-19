var express = require("express");
var router = express.Router();
var Article = require("../models/ArticlesModel");

/* GET home page. */
router.get("/", function (req, res, next) {
  const { msg } = req.query;
  // res.render("index", { err: msg });

  Article.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      console.log(items);
      res.render("index", { items: items });
    }
  });
});

module.exports = router;
