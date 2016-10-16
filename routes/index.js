var express = require('express');
var router = express.Router();

router.route('/')
    .get(function(req, res, next) {
      res.send("get");
    }).post(function(req, res, next) {
      res.send("test");
      next();
    });

module.exports = router;
