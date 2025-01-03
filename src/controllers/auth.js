import bcrypt from 'bcrypt';
import createError from 'http-errors';
import User from '../models/users.js';
import Session from '../models/session.js';
import { generateToken } from '../utils/randomToken.js';

export const registerCtrl = async (req, res, next) => {
  try {
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

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutCtrl = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await Session.deleteOne({ refreshToken });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
