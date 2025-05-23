const Joi = require('joi')

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.flash('error', 'Будь ласка, увійдіть в систему')
  res.redirect('/login')
}

const createUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('user', 'admin').optional(),
  password: Joi.string().min(6).max(30).required()
})

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).optional(),
  lastName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('user', 'admin').optional(),
  password: Joi.string().min(6).max(30).optional()
})

module.exports.validateNewUserData = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

module.exports.validateUpdatedUserData = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

const validateNewUserArrayData = (req, res, next) => {
  const arrayErrors = []
  req.body.forEach((userData, index) => {
    const { error } = createUserSchema.validate(userData)
    if (error) {
      arrayErrors.push({ index, message: error.details[0].message })
    }
  })

  if (arrayErrors.length) {
    return res.status(400).json({ errors: arrayErrors })
  }
  next()
}

module.exports.validateNewUserArrayData = validateNewUserArrayData
