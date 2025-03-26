const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')

const router = express.Router()
const users = []

router.get('/login', (req, res) => res.render('login'))
router.get('/register', (req, res) => res.render('register'))

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (users.find((u) => u.email === email)) return res.send('User already exists')

  const hashedPassword = await bcrypt.hash(password, 10)
  users.push({ email, password: hashedPassword })
  res.redirect('/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/protected',
    failureRedirect: '/login'
  })
)

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'))
})

module.exports = router
