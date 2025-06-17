
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query, getClient } = require('../config/database');

const router = express.Router();

// Create batch (equivalent to create-batch edge function)
router.post('/create', authenticateToken, async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { name, description, monthlyContribution, maxMembers } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name || !monthlyContribution || !maxMembers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the batch
    const batchResult = await client.query(`
      INSERT INTO batches (name, description, created_by, monthly_contribution, max_members, current_members, status)
      VALUES ($1, $2, $3, $4, $5, 1, 'recruiting')
      RETURNING *
    `, [name, description, userId, monthlyContribution, maxMembers]);

    const batch = batchResult.rows[0];

    // Add the creator as the first member
    await client.query(`
      INSERT INTO batch_members (batch_id, user_id, position, joined_at)
      VALUES ($1, $2, 1, NOW())
    `, [batch.id, userId]);

    await client.query('COMMIT');

    res.json({ batch });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create batch' });
  } finally {
    client.release();
  }
});

// Join batch (equivalent to join-batch edge function)
router.post('/join', authenticateToken, async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    // Find the batch by invite code
    const batchResult = await client.query(
      'SELECT * FROM batches WHERE invite_code = $1',
      [inviteCode]
    );

    if (batchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    const batch = batchResult.rows[0];

    // Check if batch is still recruiting
    if (batch.status !== 'recruiting') {
      return res.status(400).json({ error: 'This batch is no longer accepting new members' });
    }

    // Check if batch is full
    if (batch.current_members >= batch.max_members) {
      return res.status(400).json({ error: 'This batch is full' });
    }

    // Check if user is already a member
    const existingMemberResult = await client.query(
      'SELECT id FROM batch_members WHERE batch_id = $1 AND user_id = $2',
      [batch.id, userId]
    );

    if (existingMemberResult.rows.length > 0) {
      return res.status(400).json({ error: 'You are already a member of this batch' });
    }

    // Add user to the batch
    const nextPosition = batch.current_members + 1;
    
    await client.query(`
      INSERT INTO batch_members (batch_id, user_id, position, joined_at)
      VALUES ($1, $2, $3, NOW())
    `, [batch.id, userId, nextPosition]);

    // Update batch member count
    const newStatus = nextPosition >= batch.max_members ? 'active' : 'recruiting';
    await client.query(`
      UPDATE batches 
      SET current_members = $1, status = $2
      WHERE id = $3
    `, [nextPosition, newStatus, batch.id]);

    await client.query('COMMIT');

    res.json({ message: 'Successfully joined batch', batch });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error joining batch:', error);
    res.status(500).json({ error: 'Failed to join batch' });
  } finally {
    client.release();
  }
});

module.exports = router;
