const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error('Помилка отримання даних:', error)
    res.status(500).json({ error: 'Помилка отримання даних' })
  }
})

module.exports = router
