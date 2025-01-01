import createError from 'http-errors';

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(createError(400, error.message));
  } else {
    next();
  }
};

export default validateBody;
