const db = require('../db');

// Get all users with their details
const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        U.USER_ID,
        U.PERSON_ID,
        U.USER_FIRSTNAME,
        U.USER_LASTNAME,
        U.PHONE_NO,
        U.BIRTH_DATE,
        P.EMAIL,
        C.COUNTRY_NAME,
        C.COUNTRY_ID
      FROM USER U
      JOIN PERSON P ON U.PERSON_ID = P.PERSON_ID
      JOIN COUNTRY C ON U.COUNTRY_ID = C.COUNTRY_ID
      ORDER BY U.USER_FIRSTNAME, U.USER_LASTNAME
    `;
    
    const [users] = await db.execute(query);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID with detailed information
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        U.USER_ID,
        U.PERSON_ID,
        U.USER_FIRSTNAME,
        U.USER_LASTNAME,
        U.PHONE_NO,
        U.BIRTH_DATE,
        P.EMAIL,
        C.COUNTRY_NAME,
        C.COUNTRY_ID
      FROM USER U
      JOIN PERSON P ON U.PERSON_ID = P.PERSON_ID
      JOIN COUNTRY C ON U.COUNTRY_ID = C.COUNTRY_ID
      WHERE U.USER_ID = ?
    `;
    
    const [users] = await db.execute(query, [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsersQuery = 'SELECT COUNT(*) as total FROM USER';
    const recentUsersQuery = `
      SELECT COUNT(*) as recent 
      FROM USER 
      WHERE BIRTH_DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `;
    const countriesQuery = 'SELECT COUNT(DISTINCT COUNTRY_ID) as countries FROM USER';
    
    const [totalResult] = await db.execute(totalUsersQuery);
    const [recentResult] = await db.execute(recentUsersQuery);
    const [countriesResult] = await db.execute(countriesQuery);
    
    res.json({
      totalUsers: totalResult[0].total,
      recentUsers: recentResult[0].recent,
      countries: countriesResult[0].countries
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};

// Search users by name or email
const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return getAllUsers(req, res);
    }
    
    const query = `
      SELECT 
        U.USER_ID,
        U.PERSON_ID,
        U.USER_FIRSTNAME,
        U.USER_LASTNAME,
        U.PHONE_NO,
        U.BIRTH_DATE,
        P.EMAIL,
        C.COUNTRY_NAME,
        C.COUNTRY_ID
      FROM USER U
      JOIN PERSON P ON U.PERSON_ID = P.PERSON_ID
      JOIN COUNTRY C ON U.COUNTRY_ID = C.COUNTRY_ID
      WHERE 
        U.USER_FIRSTNAME LIKE ? OR 
        U.USER_LASTNAME LIKE ? OR 
        P.EMAIL LIKE ? OR
        CONCAT(U.USER_FIRSTNAME, ' ', U.USER_LASTNAME) LIKE ?
      ORDER BY U.USER_FIRSTNAME, U.USER_LASTNAME
    `;
    
    const searchTerm = `%${search}%`;
    const [users] = await db.execute(query, [searchTerm, searchTerm, searchTerm, searchTerm]);
    
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

// Get all countries for dropdown
const getAllCountries = async (req, res) => {
  try {
    const query = 'SELECT COUNTRY_ID, COUNTRY_NAME FROM COUNTRY ORDER BY COUNTRY_NAME';
    const [countries] = await db.execute(query);
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserStats,
  searchUsers,
  getAllCountries
};
