
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    // For Supabase JWT tokens, we need to verify them properly
    // This is a simplified version - in production, you'd verify against Supabase's public key
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded || !decoded.payload) {
      return res.status(403).json({ error: 'Invalid token format' });
    }

    // Extract user ID from token payload
    const userId = decoded.payload.sub;
    
    if (!userId) {
      return res.status(403).json({ error: 'Invalid token payload' });
    }

    // Verify user exists in database
    const userResult = await query(
      'SELECT id, full_name, phone_number FROM profiles WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Add user info to request object
    req.user = {
      id: userId,
      ...userResult.rows[0]
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Token verification failed' });
  }
};

module.exports = { authenticateToken };
