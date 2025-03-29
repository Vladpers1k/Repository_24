const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/users-cursor', async (req, res) => {
  try {
    const cursor = User.find().cursor()
    const users = []

    for await (const user of cursor) {
      users.push(user)
    }

    console.log('Отримані користувачі:', users)
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання користувачів' })
  }
})

router.get('/users-stats', async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { age: { $exists: true } } },
      { $group: { _id: null, averageAge: { $avg: '$age' } } }
    ])

    res.json(stats.length ? stats[0] : { averageAge: 0 })
  } catch (error) {
    res.status(500).json({ error: 'Помилка підрахунку статистики' })
  }
})

module.exports = router
