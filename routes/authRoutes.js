const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register', { messages: req.flash() })
})

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      req.flash('error', 'Користувач уже існує')
      return res.redirect('/register')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ email, password: hashedPassword })

    await newUser.save()
    req.flash('success', 'Реєстрація успішна! Увійдіть в акаунт.')
    res.redirect('/login')
  } catch (error) {
    console.error('❌ Помилка при реєстрації:', error)
    req.flash('error', 'Помилка сервера. Спробуйте ще раз.')
    res.redirect('/register')
  }
})

router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() })
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/protected')
  }
)

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login')
  })
})

module.exports = router
