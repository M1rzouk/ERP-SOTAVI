const Joi = require('joi');

const loginSchema = Joi.object({
  matricule: Joi.string().required().messages({
    'string.empty': 'Le matricule est requis'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe est requis'
  })
});

exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(d => d.message)
    });
  }
  next();
};