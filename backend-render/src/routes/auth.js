
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Get user data (equivalent to get-user-data edge function)
router.get('/user-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user profile
    const profileResult = await query(
      'SELECT * FROM profiles WHERE id = $1',
      [userId]
    );
    const profile = profileResult.rows[0];

    // Get user batches
    const batchesResult = await query(`
      SELECT b.*, bm.position, bm.joined_at
      FROM batches b
      INNER JOIN batch_members bm ON b.id = bm.batch_id
      WHERE bm.user_id = $1
      ORDER BY bm.joined_at DESC
    `, [userId]);

    // Get user savings transactions
    const savingsResult = await query(
      'SELECT * FROM savings WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Calculate savings balance
    const savingsBalance = savingsResult.rows.reduce((total, transaction) => {
      return transaction.transaction_type === 'deposit' 
        ? total + Number(transaction.amount)
        : total - Number(transaction.amount);
    }, 0);

    // Calculate monthly total (current month deposits)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = savingsResult.rows
      .filter(transaction => {
        const transactionDate = new Date(transaction.created_at);
        return transaction.transaction_type === 'deposit' &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    // Get recent savings (last 10 transactions)
    const recentSavings = savingsResult.rows.slice(0, 10);

    const userData = {
      profile,
      batches: batchesResult.rows,
      savingsBalance,
      monthlyTotal,
      recentSavings,
      totalSavings: savingsResult.rows.length
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
