const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const users = []

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = users.find((u) => u.email === email)
    if (!user) return done(null, false, { message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' })
  })
)

passport.serializeUser((user, done) => done(null, user.email))
passport.deserializeUser((email, done) => {
  const user = users.find((u) => u.email === email)
  done(null, user)
})
