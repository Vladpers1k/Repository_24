const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { ensureAuthenticated, validateNewUserData, validateUpdatedUserData } = require('../middlewares/authMiddleware')

router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.email) filter.email = req.query.email
    if (req.query.role) filter.role = req.query.role

    const projection = req.query.fields ? req.query.fields.split(',').join(' ') : ''

    const users = await User.find(filter).select(projection)
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання даних' })
  }
})

router.post('/add-one', ensureAuthenticated, validateNewUserData, async (req, res) => {
  try {
    const newUser = new User(req.body)
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ error: 'Помилка створення користувача' })
  }
})

router.post('/add-many', ensureAuthenticated, validateNewUserArrayData, async (req, res) => {
  try {
    const users = await User.insertMany(req.body)
    res.status(201).json(users)
  } catch (error) {
    res.status(400).json({ error: 'Помилка додавання користувачів' })
  }
})

router.put('/update-one/:id', ensureAuthenticated, validateUpdatedUserData, async (req, res) => {
  try {
    const updatedUser = await User.updateOne({ _id: req.params.id }, { $set: req.body })
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ error: 'Помилка оновлення користувача' })
  }
})

router.put('/update-many', ensureAuthenticated, validateUpdatedUserData, async (req, res) => {
  try {
    const updatedUsers = await User.updateMany(req.body.filter, { $set: req.body.update })
    res.json(updatedUsers)
  } catch (error) {
    res.status(400).json({ error: 'Помилка оновлення користувачів' })
  }
})

router.delete('/delete-one/:id', ensureAuthenticated, async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.params.id })
    res.json(deletedUser)
  } catch (error) {
    res.status(400).json({ error: 'Помилка видалення користувача' })
  }
})

router.put('/replace-one/:id', ensureAuthenticated, validateNewUserData, async (req, res) => {
  try {
    const replacedUser = await User.replaceOne({ _id: req.params.id }, req.body)
    res.json(replacedUser)
  } catch (error) {
    res.status(400).json({ error: 'Помилка заміни користувача' })
  }
})

router.delete('/delete-many', ensureAuthenticated, async (req, res) => {
  try {
    const deletedUsers = await User.deleteMany(req.body)
    res.json(deletedUsers)
  } catch (error) {
    res.status(400).json({ error: 'Помилка видалення користувачів' })
  }
})

module.exports = router
