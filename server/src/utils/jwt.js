import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Send the user token for login
export const sendToken = (userId, res) => {
  // Creating the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });

  // Setting JWT as HTTP-Only Cookie in the server
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
};
