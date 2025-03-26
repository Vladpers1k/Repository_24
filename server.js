require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const authRoutes = require('./routes/auth')

require('./config/passport')

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(authRoutes)

app.get('/protected', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login')
  res.render('protected', { user: req.user })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
