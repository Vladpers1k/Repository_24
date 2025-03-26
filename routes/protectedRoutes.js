const express = require('express')
const { ensureAuthenticated } = require('../config/passport')
const router = express.Router()

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('protected', { user: req.user, messages: req.flash() })
})

module.exports = router
