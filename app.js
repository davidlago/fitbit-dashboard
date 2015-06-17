var express      = require('express');
var session      = require('express-session');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var auth         = require('./lib/auth');

// Read config file based on environment
var config = require('./config.json')[process.env.NODE_ENV || 'development'];
// Substitute API key and secret from environment
config.grant.fitbit.key = process.env.FITBIT_API_KEY;
config.grant.fitbit.secret = process.env.FITBIT_API_SECRET;

// Initialize Grant for API token requests
var Grant = require('grant-express');
var grant = new Grant(config.grant);

var routes = require('./routes/index');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'grant'}));
app.use(grant);
app.use(auth);

app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler (will print stacktrace)
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler (no stacktraces leaked to user)
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
