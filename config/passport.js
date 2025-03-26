const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const users = [] // Тимчасова база користувачів

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const user = users.find((user) => user.email === email)
    if (!user) return done(null, false, { message: 'Користувач не знайдений' })

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (!isMatch) return done(null, false, { message: 'Неправильний пароль' })
      return done(null, user)
    })
  })
)

passport.serializeUser((user, done) => done(null, user.email))
passport.deserializeUser((email, done) => {
  const user = users.find((user) => user.email === email)
  done(null, user)
})

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.flash('error', 'Будь ласка, увійдіть в систему')
  res.redirect('/login')
}
