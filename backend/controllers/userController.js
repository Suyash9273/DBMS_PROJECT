import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  // 1. Get Data from the request body
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      // Send 400 error directly
      return res.status(400).json({ message: 'User already exists' });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    //Create and save new user in db
    const user = await User.create({
      name,
      email,
      password_hash,
      // isAdmin defaults to false in the model
    });

    // If user creation is successful, then generate token
    if (user) {
      generateToken(res, user.id); // this will set the cookie
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // <-- UPDATED
      });
    } else {
      // Send 400 error directly
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // This will now catch actual server errors
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 *@desc Authenticate user and get token(login)
 *@route POST /api/users/login
 @access Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      generateToken(res, user.id);

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // <-- UPDATED
      });
    } else {
      // Send 401 error directly
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc Get user profile
 * @route Get: /api/users/profile
 * @access Private
 */
const getUserProfile = (req, res) => {
  // req.user is attached by our protect middleware
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin, // <-- UPDATED
  };
  res.status(200).json(user);
}

/**
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Public
 */
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, loginUser, getUserProfile, logoutUser };