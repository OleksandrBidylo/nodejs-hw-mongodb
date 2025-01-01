import createError from 'http-errors';
import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.isValidObjectId(contactId)) {
    return next(createError(400, 'Invalid contact ID'));
  }
  next();
};

export default isValidId;
