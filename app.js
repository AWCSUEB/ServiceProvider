var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
//var routes = require('./routes/index');

var util = require('./lib/utility');
var app = express();

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var id = undefined;
var routes = {};
var resettime = undefined;
var lastpingtime = undefined;
var lasterrcount = 0;

console.log("PORT=" + process.env.PORT);
console.log("NAME=" + process.env.SPNAME);

var requestfn = function() {
  if (!id) {
    request({
      method: 'POST',
      uri: 'http://localhost:3000/providers',
      json: true,
      body: {
        name: process.env.SPNAME,
        uri: 'http://localhost:' + process.env.PORT + "/"
      }
    }, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        id = res.body.id;
        lastpingtime = new Date();
        lasterrcount = 0;
      }
    });
  } else {
    request({
      method: 'PUT',
      uri: 'http://localhost:3000/providers/' + id + '/ping'
    }, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        lastpingtime = new Date();
        lasterrcount = 0;
      } else {
        lasterrcount++;

        if (lasterrcount > 2) {
          id = undefined;
        }
      }
    });
  }
};

setInterval(requestfn, 1000);

app.route('/').get(function(req, res, next) {
  res.send({
    "id": id,
    "resettime": resettime,
    "lastpingtime": lastpingtime,
    "lasterrcount": lasterrcount
  });
});

app.route('/reserve').post(function(req, res, next) {
  res.send("post");
}).put(function(req, res, next) {
  res.send("put");
}).delete(function(req, res, next) {
  res.send("delete");
});

app.route('/reset').post(function(req, res, next) {
  routes = util.queueList(req.query.n, id);
  resettime = new Date();
  res.send(routes);
});

app.route('/routes').get(function(req, res, next) {
  res.send(routes);
});

app.route('/routes/:id').get(function(req, res, next) {
  res.send(routes[req.params.id.toUpperCase()]);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({"error": {
    message: err.message,
    error: err
  }});
});

app.listen(process.env.PORT);

module.exports = app;