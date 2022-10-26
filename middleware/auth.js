// passport authenticate requests
module.exports = function authenticate(req, res, next) {
  if (req.isAuthenticated()) return next()
  req.flash('warning_msg', '請先登入')
  return res.redirect('/users/login')
}