module.exports = function(req, res, next) {
  // If we don't have the token, redirect to the auth page (unless we were
  // already going there).
  if (req.path != '/connect/fitbit' && (!req.session.grant ||
      !req.session.grant.response ||
      !req.session.grant.response.access_token)) {
    res.redirect('/connect/fitbit');
  } else {
    next();
  }
};
