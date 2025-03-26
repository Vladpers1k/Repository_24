const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

const users = [] // Тимчасове збереження користувачів

// Сторінка реєстрації
router.get('/register', (req, res) => {
  res.render('register', { messages: req.flash() })
})

// Обробка реєстрації
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (users.some((user) => user.email === email)) {
    req.flash('error', 'Користувач уже існує')
    return res.redirect('/register')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  users.push({ email, password: hashedPassword })
  req.flash('success', 'Реєстрація успішна! Увійдіть в акаунт.')
  res.redirect('/login')
})

// Сторінка входу
router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() })
})

// Обробка входу
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

// Вихід
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login')
  })
})

module.exports = router
