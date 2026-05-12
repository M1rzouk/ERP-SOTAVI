const Joi = require('joi');

const createLotSchema = Joi.object({
  code: Joi.string().max(50).optional(),
  imported_batch_id: Joi.number().integer().positive().required(),
  product_id: Joi.number().integer().positive().required(),
  center_id: Joi.number().integer().positive().required(),
  quantity_initial: Joi.number().integer().min(1).required(),
  status_id: Joi.number().integer().positive().required()
});

exports.validateCreateLot = (req, res, next) => {
  const { error } = createLotSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};