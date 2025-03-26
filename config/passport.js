const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const usersFile = path.join(__dirname, '../users.json')

function getUsers() {
  if (!fs.existsSync(usersFile)) return []
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
}

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    let users = getUsers()
    console.log('Пошук користувача з email:', email)

    const user = users.find((user) => user.email === email)
    if (!user) {
      console.log('❌ Користувач не знайдений!')
      return done(null, false, { message: 'Користувач не знайдений' })
    }

    console.log('🔑 Перевірка пароля для користувача:', user)

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return done(err)
      if (!isMatch) {
        console.log('❌ Невірний пароль!')
        return done(null, false, { message: 'Неправильний пароль' })
      }

      console.log('✅ Успішний вхід:', user)
      return done(null, user)
    })
  })
)

passport.serializeUser((user, done) => done(null, user.email))

passport.deserializeUser((email, done) => {
  const users = getUsers()
  const user = users.find((user) => user.email === email)
  done(null, user)
})

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.flash('error', 'Будь ласка, увійдіть в систему')
  res.redirect('/login')
}
