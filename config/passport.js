const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      console.log('Пошук користувача з email:', email)
      const user = await User.findOne({ email })

      if (!user) {
        console.log('❌ Користувач не знайдений!')
        return done(null, false, { message: 'Користувач не знайдений' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        console.log('❌ Невірний пароль!')
        return done(null, false, { message: 'Неправильний пароль' })
      }

      console.log('✅ Успішний вхід:', user)
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  })
)

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})
