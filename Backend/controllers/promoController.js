const db = require('../db');

// Validate promo code
const validatePromoCode = async (req, res) => {
  try {
    const { promoCode, subscriptionTypeId } = req.body;
    const userId = req.user.userId;

    if (!promoCode || !subscriptionTypeId) {
      return res.status(400).json({
        success: false,
        error: 'Promo code and subscription type are required'
      });
    }

    // Check if promo code exists and is valid
    const promoQuery = `
      SELECT 
        P.PROMOTION_ID,
        P.PROMO_CODE,
        P.DISCOUNT_RATE,
        P.START_DATE,
        P.END_DATE,
        P.DESCRIPTION,
        P.SUBSCRIPTION_TYPE_ID
      FROM PROMOTION P
      WHERE P.PROMO_CODE = ? 
        AND (P.SUBSCRIPTION_TYPE_ID = ? OR P.SUBSCRIPTION_TYPE_ID IS NULL)
        AND CURDATE() BETWEEN P.START_DATE AND P.END_DATE
      ORDER BY P.SUBSCRIPTION_TYPE_ID DESC
      LIMIT 1
    `;

    const [promoResults] = await db.execute(promoQuery, [promoCode, subscriptionTypeId]);

    if (promoResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invalid promo code or promo code has expired'
      });
    }

    const promotion = promoResults[0];

    // Check if user has already used this promo code
    const usageQuery = `
      SELECT COUNT(*) as usage_count
      FROM USER_PROMOTION_USAGE UPU
      WHERE UPU.USER_ID = ? AND UPU.PROMOTION_ID = ?
    `;

    const [usageResults] = await db.execute(usageQuery, [userId, promotion.PROMOTION_ID]);

    if (usageResults[0].usage_count > 0) {
      return res.status(400).json({
        success: false,
        error: 'You have already used this promo code'
      });
    }

    res.json({
      success: true,
      promotion: {
        promoCode: promotion.PROMO_CODE,
        discountRate: promotion.DISCOUNT_RATE,
        description: promotion.DESCRIPTION,
        promotionId: promotion.PROMOTION_ID
      }
    });

  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate promo code'
    });
  }
};

// Function to record promo code usage (call this when user actually subscribes)
const recordPromoUsage = async (userId, promotionId) => {
  try {
    const insertQuery = `
      INSERT INTO USER_PROMOTION_USAGE (USER_ID, PROMOTION_ID)
      VALUES (?, ?)
    `;
    
    await db.execute(insertQuery, [userId, promotionId]);
    return { success: true };
  } catch (error) {
    console.error('Error recording promo usage:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  validatePromoCode,
  recordPromoUsage
};