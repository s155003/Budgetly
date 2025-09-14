const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      first_name,
      last_name
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { first_name, last_name } = req.body;

    const db = require('../models/database').getDatabase();
    
    const sql = `
      UPDATE users 
      SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(sql, [first_name, last_name, userId], function(err) {
      if (err) {
        console.error('Update profile error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};

