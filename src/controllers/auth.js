import bcrypt from 'bcrypt';
import createError from 'http-errors';
import Joi from 'joi';
import User from '../models/users.js';
import Session from '../models/session.js';
import { generateToken } from '../utils/randomToken.js';

export const registerValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have less than 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password should have at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password should have at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const registerCtrl = async (req, res, next) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

export const loginCtrl = async (req, res, next) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'Invalid email or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(401, 'Invalid email or password'));
    }

    const accessToken = generateToken();
    const refreshToken = generateToken();

    await Session.deleteMany({ userId: user._id });

    const newSession = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newSession.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('sessionId', newSession._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshCtrl = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return next(createError(401, 'Invalid refresh token'));
    }

    if (new Date() > session.refreshTokenValidUntil) {
      return next(createError(401, 'Refresh token expired'));
    }

    const newAccessToken = generateToken();
    const newRefreshToken = generateToken();

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    session.refreshTokenValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    await session.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutCtrl = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return next(createError(401, 'Invalid refresh token'));
    }

    session.accessToken = null;
    session.refreshToken = null;
    await session.save();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
