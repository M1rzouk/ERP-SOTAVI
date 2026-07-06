// Ajouter à modules/auth/auth.validations.js
const createUserSchema = Joi.object({
  matricule: Joi.string().required().messages({
    'string.empty': 'Le matricule est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'L\'email doit être valide',
    'string.empty': 'L\'email est requis'
  }),
  full_name: Joi.string().required().messages({
    'string.empty': 'Le nom complet est requis'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'string.empty': 'Le mot de passe est requis'
  }),
  roles: Joi.array().items(Joi.number().integer()).min(1).required().messages({
    'array.min': 'Au moins un rôle doit être sélectionné',
    'array.base': 'Les rôles doivent être un tableau'
  })
});

exports.validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(d => d.message)
    });
  }
  next();
};