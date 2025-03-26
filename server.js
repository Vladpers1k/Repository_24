require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const authRoutes = require('./routes/authRoutes')
const protectedRoutes = require('./routes/protectedRoutes')
require('./config/passport') // Налаштування Passport

const app = express()

// Статичні файли
app.use(express.static('public'))

// Налаштування EJS
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Налаштування сесії (1 година)
app.use(
  session({
    secret: process.env.SECRET_KEY || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 }
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Middleware для Flash повідомлень
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

// Дозвіл на обробку POST-запитів
app.use(express.urlencoded({ extended: true }))

// Головна сторінка
app.get('/', (req, res) => {
  res.render('index')
})

// Підключення маршрутів
app.use('/', authRoutes)
app.use('/protected', protectedRoutes)

// Запуск сервера
app.listen(3000, () => console.log('Сервер працює на http://localhost:3000'))
