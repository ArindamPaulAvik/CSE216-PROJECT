const db = require('../db');

// Get marketing dashboard statistics
const getMarketingStats = async (req, res) => {
  console.log('Marketing stats endpoint called');
  try {
    // Temporarily disable authentication for testing
    // const userType = req.user.userType;
    // const adminType = req.user.adminType;
    
    // Check if user is marketing admin
    // if (userType !== 'admin' || adminType !== 'Marketing') {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Only marketing admins can access marketing statistics'
    //   });
    // }

    // Get publisher count
    const [publisherCount] = await db.execute('SELECT COUNT(*) as count FROM PUBLISHER');
    
    // Get total users count
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM USER');
    
    // Get promotion count
    const [promotionCount] = await db.execute('SELECT COUNT(*) as count FROM PROMOTION');
    
    // Get subscription types count
    const [subscriptionTypeCount] = await db.execute('SELECT COUNT(*) as count FROM SUBSCRIPTION_TYPE WHERE IS_ACTIVE = 1');
    
    res.json({
      success: true,
      stats: {
        publisherCount: publisherCount[0].count,
        totalUsers: userCount[0].count,
        promotionCount: promotionCount[0].count,
        subscriptionTypeCount: subscriptionTypeCount[0].count
      }
    });
  } catch (error) {
    console.error('Error fetching marketing stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch marketing statistics'
    });
  }
};

module.exports = {
  getMarketingStats
}; 