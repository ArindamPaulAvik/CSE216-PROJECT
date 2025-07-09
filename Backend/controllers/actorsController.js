// controllers/actorsController.js
const pool = require('../db');

exports.getAllActors = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ACTOR_ID, ACTOR_FIRSTNAME, ACTOR_LASTNAME, PICTURE FROM ACTOR
    `);

    const actors = rows.map(a => ({
      ACTOR_ID: a.ACTOR_ID,
      NAME: a.ACTOR_FIRSTNAME + ' ' + a.ACTOR_LASTNAME,
      PICTURE: a.PICTURE,
    }));

    res.json(actors);
  } catch (err) {
    console.error('Error fetching actors:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getActorById = async (req, res) => {
  const actorId = req.params.id;

  try {
    const [[actor]] = await pool.query(`
      SELECT ACTOR_FIRSTNAME, ACTOR_LASTNAME, BIOGRAPHY, PICTURE
      FROM ACTOR
      WHERE ACTOR_ID = ?
    `, [actorId]);

    if (!actor) return res.status(404).json({ error: 'Actor not found' });

    const [shows] = await pool.query(
      `SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL
       FROM \`SHOW\` s
       JOIN SHOW_CAST sa ON s.SHOW_ID = sa.SHOW_ID
       WHERE sa.ACTOR_ID = ?`,
      [actorId]
    );

    res.json({
      NAME: actor.ACTOR_FIRSTNAME + ' ' + actor.ACTOR_LASTNAME,
      BIOGRAPHY: actor.BIOGRAPHY,
      PICTURE: actor.PICTURE,
      SHOWS: shows
    });
  } catch (err) {
    console.error('Error fetching actor:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
