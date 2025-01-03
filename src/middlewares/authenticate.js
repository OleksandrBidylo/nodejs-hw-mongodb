import createError from 'http-errors';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(createError(401, 'Authorization token missing'));
    }

    const [prefix, token] = authorization.split(' ');
    if (prefix !== 'Bearer' || !token) {
      return next(createError(401, 'Invalid authorization format'));
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session || new Date() > session.accessTokenValidUntil) {
      return next(createError(401, 'Access token expired'));
    }

    req.user = session.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
