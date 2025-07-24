const db = require('../db');

exports.getPromotions = async (req, res) => {
  try {
    const [promos] = await db.query(`
      SELECT p.*, st.DESCRIPTION AS SUBSCRIPTION_TYPE_DESCRIPTION
      FROM promotion p
      LEFT JOIN subscription_type st ON p.SUBSCRIPTION_TYPE_ID = st.SUBSCRIPTION_TYPE_ID
    `);
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
};

exports.addPromotion = async (req, res) => {
  try {
    const { promoCode, discountRate, startDate, endDate, description, subscriptionTypeId } = req.body;
    await db.query(
      'INSERT INTO promotion (PROMO_CODE, DISCOUNT_RATE, START_DATE, END_DATE, DESCRIPTION, SUBSCRIPTION_TYPE_ID) VALUES (?, ?, ?, ?, ?, ?)',
      [promoCode, discountRate, startDate, endDate, description, subscriptionTypeId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add promotion' });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { promoCode, discountRate, startDate, endDate, description, subscriptionTypeId } = req.body;
    await db.query(
      'UPDATE promotion SET PROMO_CODE=?, DISCOUNT_RATE=?, START_DATE=?, END_DATE=?, DESCRIPTION=?, SUBSCRIPTION_TYPE_ID=? WHERE PROMOTION_ID=?',
      [promoCode, discountRate, startDate, endDate, description, subscriptionTypeId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update promotion' });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    await db.query('DELETE FROM promotion WHERE PROMOTION_ID=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
};

exports.getSubscriptionTypes = async (req, res) => {
  try {
    const [types] = await db.query('SELECT * FROM subscription_type WHERE IS_ACTIVE=1');
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription types' });
  }
};