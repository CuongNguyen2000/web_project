var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const {msg} = req.query;
  res.render('index', {err: msg});
});

module.exports = router;
