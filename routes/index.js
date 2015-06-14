var express = require('express');
var router = express.Router();

// Read config file based on environment
var config = require('../config.json')[process.env.NODE_ENV||'development'];
// Substitute API key and secret from environment
config.grant.fitbit.key = process.env.FITBIT_API_KEY
config.grant.fitbit.secret = process.env.FITBIT_API_SECRET

// Configure Purest for API access
var Purest = require('purest');
var fitbit = new Purest({
  provider:'fitbit',
  key: config.grant.fitbit.key,
  secret: config.grant.fitbit.secret
});

/* GET root page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET root page. */
router.get('/callback', function(req, res) {
  fitbit
    .query()
    .get("user/-/profile")
    .auth(
      req.session.grant.response.access_token,
      req.session.grant.response.access_secret
    )
    .request(function (err, res2, body) {
      // Render user profile
      res.render('profile', {profile: body.user});
    });
});

module.exports = router;
