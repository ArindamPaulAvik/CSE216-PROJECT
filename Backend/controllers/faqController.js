const db = require('../db');

// Get all FAQs
const getAllFAQs = async (req, res) => {
  try {
    const query = 'SELECT * FROM FAQ';
    const [faqs] = await db.execute(query);
    
    res.json({
      success: true,
      faqs: faqs
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs'
    });
  }
};

// Get FAQ by ID
const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM FAQ WHERE FAQ_ID = ?';
    const [faqs] = await db.execute(query, [id]);
    
    if (faqs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      faq: faqs[0]
    });
  } catch (error) {
    console.error('Error fetching FAQ by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ'
    });
  }
};

// Create new FAQ (Support Admin only)
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    // Check if user is support admin
    if (userType !== 'admin' || adminType !== 'Support') {
      return res.status(403).json({
        success: false,
        error: 'Only support admins can create FAQs'
      });
    }
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: 'Question and answer are required'
      });
    }
    
    const query = 'INSERT INTO FAQ (QUESTION, ANSWER) VALUES (?, ?)';
    const [result] = await db.execute(query, [question.trim(), answer.trim()]);
    
    // Fetch the created FAQ
    const [newFAQ] = await db.execute('SELECT * FROM FAQ WHERE FAQ_ID = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq: newFAQ[0]
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create FAQ'
    });
  }
};

// Update FAQ (Support Admin only)
const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    // Check if user is support admin
    if (userType !== 'admin' || adminType !== 'Support') {
      return res.status(403).json({
        success: false,
        error: 'Only support admins can update FAQs'
      });
    }
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: 'Question and answer are required'
      });
    }
    
    // Check if FAQ exists
    const [existingFAQ] = await db.execute('SELECT * FROM FAQ WHERE FAQ_ID = ?', [id]);
    if (existingFAQ.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    const query = 'UPDATE FAQ SET QUESTION = ?, ANSWER = ? WHERE FAQ_ID = ?';
    await db.execute(query, [question.trim(), answer.trim(), id]);
    
    // Fetch the updated FAQ
    const [updatedFAQ] = await db.execute('SELECT * FROM FAQ WHERE FAQ_ID = ?', [id]);
    
    res.json({
      success: true,
      message: 'FAQ updated successfully',
      faq: updatedFAQ[0]
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update FAQ'
    });
  }
};

// Delete FAQ (Support Admin only)
const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    // Check if user is support admin
    if (userType !== 'admin' || adminType !== 'Support') {
      return res.status(403).json({
        success: false,
        error: 'Only support admins can delete FAQs'
      });
    }
    
    // Check if FAQ exists
    const [existingFAQ] = await db.execute('SELECT * FROM FAQ WHERE FAQ_ID = ?', [id]);
    if (existingFAQ.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    const query = 'DELETE FROM FAQ WHERE FAQ_ID = ?';
    await db.execute(query, [id]);
    
    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete FAQ'
    });
  }
};

// Get FAQ statistics (for admin dashboard)
const getFAQStats = async (req, res) => {
  try {
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    // Check if user is support admin
    if (userType !== 'admin' || adminType !== 'Support') {
      return res.status(403).json({
        success: false,
        error: 'Only support admins can access FAQ statistics'
      });
    }
    
    const [totalCount] = await db.execute('SELECT COUNT(*) as total FROM FAQ');
    const [recentCount] = await db.execute(
      'SELECT COUNT(*) as recent FROM FAQ'
    );
    
    res.json({
      success: true,
      stats: {
        total: totalCount[0].total,
        recent: recentCount[0].recent
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ statistics'
    });
  }
};

// Search FAQs
const searchFAQs = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return getAllFAQs(req, res);
    }
    
    const query = `
      SELECT * FROM FAQ 
      WHERE QUESTION LIKE ? OR ANSWER LIKE ?
    `;
    const searchTerm = `%${q}%`;
    const [faqs] = await db.execute(query, [searchTerm, searchTerm]);
    
    res.json({
      success: true,
      faqs: faqs,
      searchTerm: q
    });
  } catch (error) {
    console.error('Error searching FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search FAQs'
    });
  }
};

module.exports = {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQStats,
  searchFAQs
};
