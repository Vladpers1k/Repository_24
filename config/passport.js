const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return done(null, false, { message: 'Користувач не знайдений' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: 'Неправильний пароль' })
      }

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName
  })
})

passport.deserializeUser(async (userData, done) => {
  try {
    const user = await User.findById(userData.id)
    if (!user) {
      return done(null, false)
    }
    done(null, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    })
  } catch (error) {
    done(error)
  }
})
