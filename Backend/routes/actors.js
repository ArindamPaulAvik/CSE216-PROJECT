// routes/actors.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { upload } = require('../config/multerConfig');
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actorsController');

// Public routes (for users)
router.get('/', authenticateToken, getAllActors);
router.get('/:id', authenticateToken, getActorById);

// Debug route to check database structure (remove in production)
router.get('/debug/structure', authenticateToken, async (req, res) => {
  try {
    const pool = require('../db');
    const [structure] = await pool.query('DESCRIBE ACTOR');
    const [sample] = await pool.query('SELECT * FROM ACTOR LIMIT 5');
    res.json({ structure, sample });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug route to insert sample actors (remove in production)
router.post('/debug/insert-sample', authenticateToken, async (req, res) => {
  try {
    const pool = require('../db');
    
    const sampleActors = [
      { firstName: 'Robert', lastName: 'Downey Jr.', bio: 'American actor known for Iron Man', picture: 'robert_downey.jpg' },
      { firstName: 'Scarlett', lastName: 'Johansson', bio: 'American actress known for Black Widow', picture: 'scarlett_johansson.jpg' },
      { firstName: 'Chris', lastName: 'Evans', bio: 'American actor known for Captain America', picture: 'chris_evans.jpg' },
      { firstName: 'Mark', lastName: 'Ruffalo', bio: 'American actor known for Hulk', picture: 'mark_ruffalo.jpg' },
      { firstName: 'Chris', lastName: 'Hemsworth', bio: 'Australian actor known for Thor', picture: 'chris_hemsworth.jpg' }
    ];

    for (const actor of sampleActors) {
      await pool.query(
        'INSERT IGNORE INTO ACTOR (ACTOR_FIRSTNAME, ACTOR_LASTNAME, BIOGRAPHY, PICTURE) VALUES (?, ?, ?, ?)',
        [actor.firstName, actor.lastName, actor.bio, actor.picture]
      );
    }

    const [inserted] = await pool.query('SELECT COUNT(*) as count FROM ACTOR');
    res.json({ message: 'Sample actors inserted', totalActors: inserted[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


