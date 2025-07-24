const db = require('../db');
const { recordPromoUsage } = require('./promoController');

// Get user's current subscription
const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        us.USER_ID,
        us.TRANSACTION_ID,
        us.SUBSCRIPTION_TYPE_ID,
        us.START_DATE,
        us.END_DATE,
        us.SUBSCRIPTION_STATUS,
        st.DESCRIPTION,
        st.PRICE,
        st.DURATION_DAYS,
        t.AMOUNT,
        t.TRANSACTION_DATE,
        t.TRANSACTION_STATUS
      FROM user_subscription us
      JOIN subscription_type st ON us.SUBSCRIPTION_TYPE_ID = st.SUBSCRIPTION_TYPE_ID
      JOIN transaction t ON us.TRANSACTION_ID = t.TRANSACTION_ID
      WHERE us.USER_ID = ? 
      AND us.SUBSCRIPTION_STATUS = 1 
      AND us.END_DATE > CURDATE()
      ORDER BY us.END_DATE DESC
      LIMIT 1
    `;
    
    const [subscriptions] = await db.execute(query, [userId]);
    
    if (subscriptions.length === 0) {
      return res.json({
        success: true,
        subscription: null,
        message: 'No active subscription found'
      });
    }
    
    res.json({
      success: true,
      subscription: subscriptions[0]
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription details'
    });
  }
};

// Get all available subscription types
const getAllSubscriptionTypes = async (req, res) => {
  try {
    const query = `
      SELECT 
        SUBSCRIPTION_TYPE_ID,
        PRICE,
        DESCRIPTION,
        DURATION_DAYS,
        IS_ACTIVE
      FROM subscription_type
      WHERE IS_ACTIVE = 1
      ORDER BY PRICE ASC
    `;
    
    const [subscriptionTypes] = await db.execute(query);
    
    res.json({
      success: true,
      subscriptionTypes
    });
  } catch (error) {
    console.error('Error fetching subscription types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription types'
    });
  }
};

// Create new subscription (after successful payment)
const createSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subscriptionTypeId, transactionId } = req.body;
    
    if (!subscriptionTypeId || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Subscription type ID and transaction ID are required'
      });
    }
    
    // Get subscription type details
    const typeQuery = 'SELECT DURATION_DAYS FROM subscription_type WHERE SUBSCRIPTION_TYPE_ID = ?';
    const [typeResult] = await db.execute(typeQuery, [subscriptionTypeId]);
    
    if (typeResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscription type not found'
      });
    }
    
    const durationDays = typeResult[0].DURATION_DAYS;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));
    
    // Create subscription
    const insertQuery = `
      INSERT INTO user_subscription (
        USER_ID, 
        TRANSACTION_ID, 
        SUBSCRIPTION_TYPE_ID, 
        START_DATE, 
        END_DATE, 
        SUBSCRIPTION_STATUS
      ) VALUES (?, ?, ?, ?, ?, 1)
    `;
    
    const [result] = await db.execute(insertQuery, [
      userId,
      transactionId,
      subscriptionTypeId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        userId,
        transactionId,
        subscriptionTypeId,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription'
    });
  }
};

// Get subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        us.USER_ID,
        us.TRANSACTION_ID,
        us.SUBSCRIPTION_TYPE_ID,
        us.START_DATE,
        us.END_DATE,
        us.SUBSCRIPTION_STATUS,
        st.DESCRIPTION,
        st.PRICE,
        st.DURATION_DAYS,
        t.AMOUNT,
        t.TRANSACTION_DATE,
        t.TRANSACTION_STATUS
      FROM user_subscription us
      JOIN subscription_type st ON us.SUBSCRIPTION_TYPE_ID = st.SUBSCRIPTION_TYPE_ID
      JOIN transaction t ON us.TRANSACTION_ID = t.TRANSACTION_ID
      WHERE us.USER_ID = ? AND us.TRANSACTION_ID = ?
    `;
    
    const [subscriptions] = await db.execute(query, [userId, id]);
    
    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      subscription: subscriptions[0]
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription details'
    });
  }
};

// Update subscription status
const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    
    const query = `
      UPDATE user_subscription 
      SET SUBSCRIPTION_STATUS = ? 
      WHERE USER_ID = ? AND TRANSACTION_ID = ?
    `;
    
    const [result] = await db.execute(query, [status, userId, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subscription status updated successfully'
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription status'
    });
  }
};

// Cancel user's active subscription
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find active subscription
    const findQuery = `
      SELECT TRANSACTION_ID, SUBSCRIPTION_TYPE_ID, START_DATE, END_DATE
      FROM user_subscription 
      WHERE USER_ID = ? AND SUBSCRIPTION_STATUS = 1 
      ORDER BY END_DATE DESC 
      LIMIT 1
    `;
    
    const [activeSubscriptions] = await db.execute(findQuery, [userId]);
    
    if (activeSubscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No active subscription found'
      });
    }
    
    // Update subscription status to cancelled (0)
    const updateQuery = `
      UPDATE user_subscription 
      SET SUBSCRIPTION_STATUS = 0 
      WHERE USER_ID = ? AND SUBSCRIPTION_STATUS = 1
    `;
    
    const [result] = await db.execute(updateQuery, [userId]);
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      cancelledSubscription: activeSubscriptions[0]
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
};

// Get transaction details
const getTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        t.TRANSACTION_ID,
        t.METHOD_ID,
        t.USER_ID,
        t.AMOUNT,
        t.TRANSACTION_DATE,
        t.TRANSACTION_STATUS,
        m.METHOD_NAME,
        m.METHOD_ICON
      FROM transaction t
      JOIN method m ON t.METHOD_ID = m.METHOD_ID
      WHERE t.TRANSACTION_ID = ? AND t.USER_ID = ?
    `;
    
    const [transactions] = await db.execute(query, [id, userId]);
    
    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    const transaction = transactions[0];
    
    // Get payment details based on method type
    let paymentDetails = null;
    
    try {
      // Try to get PayPal details
      const paypalQuery = 'SELECT * FROM PAYPAL WHERE TRANSACTION_ID = ?';
      const [paypalResult] = await db.execute(paypalQuery, [id]);
      if (paypalResult.length > 0) {
        paymentDetails = { type: 'PAYPAL', ...paypalResult[0] };
      }
    } catch (error) {
      // PayPal table might not exist or no record found
    }
    
    if (!paymentDetails) {
      try {
        // Try to get Mobile Banking details
        const mobileQuery = 'SELECT * FROM MOBILE_BANKING WHERE TRANSACTION_ID = ?';
        const [mobileResult] = await db.execute(mobileQuery, [id]);
        if (mobileResult.length > 0) {
          paymentDetails = { type: 'MOBILE_BANKING', ...mobileResult[0] };
        }
      } catch (error) {
        // Mobile Banking table might not exist or no record found
      }
    }
    
    if (!paymentDetails) {
      try {
        // Try to get Card details
        const cardQuery = 'SELECT * FROM CARD WHERE TRANSACTION_ID = ?';
        const [cardResult] = await db.execute(cardQuery, [id]);
        if (cardResult.length > 0) {
          paymentDetails = { type: 'CARD', ...cardResult[0] };
        }
      } catch (error) {
        // Card table might not exist or no record found
      }
    }
    
    res.json({
      success: true,
      transaction: {
        ...transaction,
        paymentDetails
      }
    });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction details'
    });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { methodId, amount, paymentDetails, promotionId } = req.body;
    
    if (!methodId || !amount || !paymentDetails) {
      return res.status(400).json({
        success: false,
        error: 'Method ID, amount, and payment details are required'
      });
    }
    
    // Start transaction
    await db.query('START TRANSACTION');
    
    try {
      // Create transaction record with discounted amount
      const transactionQuery = `
        INSERT INTO transaction (METHOD_ID, USER_ID, AMOUNT, TRANSACTION_STATUS)
        VALUES (?, ?, ?, 'PENDING')
      `;
      
      const [transactionResult] = await db.execute(transactionQuery, [methodId, userId, amount]);
      const transactionId = transactionResult.insertId;
      
      // Insert into appropriate payment method table based on payment type
      if (paymentDetails.paymentType === 'PAYPAL') {
        const paypalQuery = `
          INSERT INTO PAYPAL (TRANSACTION_ID, PAYPAL_ID, PAYPAL_EMAIL, METHOD_ID)
          VALUES (?, ?, ?, 1)
        `;
        await db.execute(paypalQuery, [
          transactionId,
          paymentDetails.paypalId || null,
          paymentDetails.paypalEmail || null
        ]);
      } else if (paymentDetails.paymentType === 'MOBILE_BANKING') {
        const mobileQuery = `
          INSERT INTO MOBILE_BANKING (TRANSACTION_ID, PROVIDER_NAME, MOBILE_NUMBER, ACCOUNT_EMAIL, METHOD_ID)
          VALUES (?, ?, ?, ?, 3)
        `;
        await db.execute(mobileQuery, [
          transactionId,
          paymentDetails.providerName || null,
          paymentDetails.mobileNumber || null,
          paymentDetails.accountEmail || null
        ]);
      } else if (paymentDetails.paymentType === 'CARD') {
        const cardQuery = `
          INSERT INTO CARD (TRANSACTION_ID, CARD_ID, CARD_VCC, EXPIRY_DATE, CARD_HOLDER_NAME, METHOD_ID)
          VALUES (?, ?, ?, ?, ?, 2)
        `;
        await db.execute(cardQuery, [
          transactionId,
          paymentDetails.cardId || null,
          paymentDetails.cardVcc || null,
          paymentDetails.expiryDate || null,
          paymentDetails.cardHolderName || null
        ]);
      }
      
      await db.query('COMMIT');
      
      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        transactionId
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
};

// Update transaction status
const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, promotionId } = req.body;
    const userId = req.user.userId;
    
    const query = `
      UPDATE transaction 
      SET TRANSACTION_STATUS = ? 
      WHERE TRANSACTION_ID = ? AND USER_ID = ?
    `;
    
    const [result] = await db.execute(query, [status, id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // If transaction is completed and promo code was used, record the usage
    if (status === 'COMPLETED' && promotionId) {
      const promoResult = await recordPromoUsage(userId, promotionId);
      if (!promoResult.success) {
        console.error('Failed to record promo usage:', promoResult.error);
        // Don't fail the transaction, just log the error
      }
    }
    
    res.json({
      success: true,
      message: 'Transaction status updated successfully'
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction status'
    });
  }
};

module.exports = {
  getUserSubscription,
  getAllSubscriptionTypes,
  createSubscription,
  getSubscriptionById,
  updateSubscriptionStatus,
  cancelSubscription,
  getTransactionDetails,
  createTransaction,
  updateTransactionStatus
};
