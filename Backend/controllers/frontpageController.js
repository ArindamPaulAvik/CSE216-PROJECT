// controllers/frontpageController.js
const pool = require('../db');

exports.getFrontpage = async (req, res) => {
  console.log('🔍 Frontpage route hit by:', req.user?.email);
  try {
    const userEmail = req.user.email;

    const [userRows] = await pool.query(`
      SELECT U.USER_ID, U.USER_FIRSTNAME, U.PROFILE_PICTURE
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userRows[0].USER_ID;
    const userName = userRows[0].USER_FIRSTNAME;

    const [trendingshows] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL,s.BANNER, s.RATING, s.TEASER,
             GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') AS GENRES
      FROM \`SHOW\` s
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      GROUP BY s.SHOW_ID
      ORDER BY s.WATCH_COUNT DESC
      LIMIT 4
    `);

    const [allshows] = await pool.query(`
      SELECT SHOW_ID, TITLE, THUMBNAIL, RATING FROM \`SHOW\`
    `);

    const [watchagainshows] = await pool.query(`
      SELECT DISTINCT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      JOIN USER_EPISODE ue ON ue.USER_ID = u.USER_ID
      JOIN SHOW_EPISODE se ON se.SHOW_EPISODE_ID = ue.SHOW_EPISODE_ID
      JOIN \`SHOW\` s ON s.SHOW_ID = se.SHOW_ID
      WHERE p.EMAIL = ? AND ue.WATCHED = 1
    `, [userEmail]);

    const [recommendedShows] = await pool.query(`
      WITH user_genre_preferences AS (
        SELECT sg.GENRE_ID, g.GENRE_NAME, COUNT(*) as preference_count
        FROM FAV_LIST_SHOW fls
        JOIN SHOW_GENRE sg ON fls.SHOW_ID = sg.SHOW_ID
        JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
        WHERE fls.USER_ID = ?
        GROUP BY sg.GENRE_ID, g.GENRE_NAME

        UNION ALL

        SELECT sg.GENRE_ID, g.GENRE_NAME, COUNT(*) as preference_count
        FROM USER_EPISODE ue
        JOIN SHOW_EPISODE se ON ue.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
        JOIN SHOW_GENRE sg ON se.SHOW_ID = sg.SHOW_ID
        JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
        WHERE ue.USER_ID = ? AND ue.WATCHED = 1
        GROUP BY sg.GENRE_ID, g.GENRE_NAME
      ),

      top_user_genres AS (
        SELECT GENRE_ID, GENRE_NAME, SUM(preference_count) as total_preference_count
        FROM user_genre_preferences
        GROUP BY GENRE_ID, GENRE_NAME
        ORDER BY total_preference_count DESC
        LIMIT 4
      ),

      user_content AS (
        SELECT DISTINCT s.SHOW_ID
        FROM \`SHOW\` s
        LEFT JOIN FAV_LIST_SHOW fls ON s.SHOW_ID = fls.SHOW_ID AND fls.USER_ID = ?
        LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
        LEFT JOIN USER_EPISODE ue ON se.SHOW_EPISODE_ID = ue.SHOW_EPISODE_ID AND ue.USER_ID = ?
        WHERE fls.USER_ID IS NOT NULL OR ue.USER_ID IS NOT NULL
      )

      SELECT DISTINCT
          s.SHOW_ID,
          s.TITLE,
          s.DESCRIPTION,
          s.THUMBNAIL,
          s.RATING,
          s.RELEASE_DATE,
          s.WATCH_COUNT,
          GROUP_CONCAT(DISTINCT g.GENRE_NAME ORDER BY g.GENRE_NAME SEPARATOR ', ') as GENRES,
          COUNT(DISTINCT tug.GENRE_ID) as matching_genres_count,
          (COALESCE(s.RATING, 0) * 0.3 + 
           (COALESCE(s.WATCH_COUNT, 0) / 1000) * 0.2 + 
           COUNT(DISTINCT tug.GENRE_ID) * 0.5) as recommendation_score
      FROM \`SHOW\` s
      JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      JOIN top_user_genres tug ON g.GENRE_ID = tug.GENRE_ID
      WHERE s.SHOW_ID NOT IN (SELECT SHOW_ID FROM user_content)
      GROUP BY s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING, s.RELEASE_DATE, s.WATCH_COUNT
      HAVING matching_genres_count > 0
      ORDER BY recommendation_score DESC, s.RATING DESC, s.WATCH_COUNT DESC
      LIMIT 4
    `, [userId, userId, userId, userId]);

    res.json({
      userName,
      profilePicture: userRows[0].PROFILE_PICTURE || null,
      trendingshows,
      watchagainshows,
      allshows,
      recommendedShows
    });
  } catch (err) {
    console.error('Error fetching frontpage:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
