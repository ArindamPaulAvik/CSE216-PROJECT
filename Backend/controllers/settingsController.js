const db = require('../db');

exports.getUserPreferences = async (req, res) => {
  try {
    console.log('🔍 getUserPreferences called');
    console.log('🔍 req.user:', req.user);
    
    const userId = req.user.userId;
    console.log('🔍 userId:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const query = `
      SELECT 
        HOVER_TRAILER as playTrailerOnHover,
        SHOW_RATING as showMyRatingsToOthers
      FROM USER_PREFERENCES 
      WHERE USER_ID = ?
    `;
    
    console.log('🔍 Executing query:', query);
    console.log('🔍 With userId:', userId);
    
    const [results] = await db.execute(query, [userId]);
    console.log('🔍 Query results:', results);

    if (results.length === 0) {
      console.log('🔍 No preferences found, creating default ones');
      const insertQuery = `
        INSERT INTO USER_PREFERENCES (USER_ID, HOVER_TRAILER, SHOW_RATING) 
        VALUES (?, 1, 1)
      `;
      await db.execute(insertQuery, [userId]);
      console.log('🔍 Default preferences created');
      
      return res.json({
        playTrailerOnHover: true,
        showMyRatingsToOthers: true
      });
    }

    const preferences = {
      playTrailerOnHover: results[0].playTrailerOnHover === 1,
      showMyRatingsToOthers: results[0].showMyRatingsToOthers === 1
    };

    console.log('🔍 Returning preferences:', preferences);
    res.json(preferences);

  } catch (error) {
    console.error('❌ Error in getUserPreferences:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch user preferences',
      error: error.message 
    });
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    console.log('🔍 updateUserPreferences called');
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.body:', req.body);
    
    const userId = req.user.userId;
    const { playTrailerOnHover, showMyRatingsToOthers } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const hoverTrailer = playTrailerOnHover ? 1 : 0;
    const showRating = showMyRatingsToOthers ? 1 : 0;

    console.log('🔍 Converting preferences:', { hoverTrailer, showRating });

    const updateQuery = `
      UPDATE USER_PREFERENCES 
      SET HOVER_TRAILER = ?, SHOW_RATING = ? 
      WHERE USER_ID = ?
    `;
    
    console.log('🔍 Executing update query with:', [hoverTrailer, showRating, userId]);
    const [updateResult] = await db.execute(updateQuery, [hoverTrailer, showRating, userId]);
    console.log('🔍 Update result:', updateResult);

    if (updateResult.affectedRows === 0) {
      console.log('🔍 No rows updated, inserting new preferences');
      const insertQuery = `
        INSERT INTO USER_PREFERENCES (USER_ID, HOVER_TRAILER, SHOW_RATING) 
        VALUES (?, ?, ?)
      `;
      const [insertResult] = await db.execute(insertQuery, [userId, hoverTrailer, showRating]);
      console.log('🔍 Insert result:', insertResult);
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences: {
        playTrailerOnHover,
        showMyRatingsToOthers
      }
    });

  } catch (error) {
    console.error('❌ Error in updateUserPreferences:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to update user preferences',
      error: error.message 
    });
  }
};