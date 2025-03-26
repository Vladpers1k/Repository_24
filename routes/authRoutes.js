const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const usersFile = path.join(__dirname, '../users.json')

function getUsers() {
  if (!fs.existsSync(usersFile)) return []
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

router.get('/register', (req, res) => {
  res.render('register', { messages: req.flash() })
})

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  let users = getUsers()

  if (users.some((user) => user.email === email)) {
    req.flash('error', 'Користувач уже існує')
    return res.redirect('/register')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  users.push({ email, password: hashedPassword })
  saveUsers(users)

  console.log('Список користувачів після реєстрації:', users)
  req.flash('success', 'Реєстрація успішна! Увійдіть в акаунт.')
  res.redirect('/login')
})

router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() })
})

router.post(
  '/login',
  (req, res, next) => {
    console.log('Запит на вхід:', req.body)
    next()
  },
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    console.log('Успішний вхід:', req.user)
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
