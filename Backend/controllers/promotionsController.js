const db = require('../db');

exports.getPromotions = async (req, res) => {
  try {
    const [promos] = await db.query(`
      SELECT P.*, ST.DESCRIPTION AS SUBSCRIPTION_TYPE_DESCRIPTION
      FROM PROMOTION P
      LEFT JOIN SUBSCRIPTION_TYPE ST ON P.SUBSCRIPTION_TYPE_ID = ST.SUBSCRIPTION_TYPE_ID
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
      'INSERT INTO PROMOTION (PROMO_CODE, DISCOUNT_RATE, START_DATE, END_DATE, DESCRIPTION, SUBSCRIPTION_TYPE_ID) VALUES (?, ?, ?, ?, ?, ?)',
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
      'UPDATE PROMOTION SET PROMO_CODE=?, DISCOUNT_RATE=?, START_DATE=?, END_DATE=?, DESCRIPTION=?, SUBSCRIPTION_TYPE_ID=? WHERE PROMOTION_ID=?',
      [promoCode, discountRate, startDate, endDate, description, subscriptionTypeId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update promotion' });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    await db.query('DELETE FROM PROMOTION WHERE PROMOTION_ID=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
};

exports.getSubscriptionTypes = async (req, res) => {
  try {
    const [types] = await db.query('SELECT * FROM SUBSCRIPTION_TYPE WHERE IS_ACTIVE=1');
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription types' });
  }
};