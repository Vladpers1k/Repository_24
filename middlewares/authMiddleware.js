module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.flash('error', 'Будь ласка, увійдіть в систему')
  res.redirect('/login')
}
