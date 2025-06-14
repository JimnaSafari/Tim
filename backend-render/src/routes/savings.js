
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Manage savings (equivalent to manage-savings edge function)
router.post('/manage', authenticateToken, async (req, res) => {
  try {
    const { action, amount, description } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!['deposit', 'withdrawal'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be deposit or withdrawal' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // For withdrawals, check if user has sufficient balance
    if (action === 'withdrawal') {
      const savingsResult = await query(
        'SELECT amount, transaction_type FROM savings WHERE user_id = $1 AND status = $2',
        [userId, 'completed']
      );

      const balance = savingsResult.rows.reduce((total, transaction) => {
        return transaction.transaction_type === 'deposit' 
          ? total + Number(transaction.amount)
          : total - Number(transaction.amount);
      }, 0);

      if (balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
    }

    // Create the savings transaction
    const transactionResult = await query(`
      INSERT INTO savings (user_id, amount, transaction_type, description, status)
      VALUES ($1, $2, $3, $4, 'completed')
      RETURNING *
    `, [
      userId, 
      amount, 
      action, 
      description || `${action.charAt(0).toUpperCase() + action.slice(1)} transaction`
    ]);

    const transaction = transactionResult.rows[0];

    res.json({ 
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`,
      transaction 
    });
  } catch (error) {
    console.error('Error processing savings transaction:', error);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

module.exports = router;
