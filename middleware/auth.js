// passport authenticate requests
module.exports = function authenticate(req, res, next) {
  if (req.isAuthenticated()) return next()
  return res.redirect('/users/login')
}