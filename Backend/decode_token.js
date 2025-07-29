const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key';

// Function to decode a JWT token
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token decoded successfully:', decoded);
    return decoded;
  } catch (err) {
    console.error('Token decode error:', err.message);
    return null;
  }
}

// Test with some example tokens
console.log('JWT Token Decoder');
console.log('To test your token, you can run:');
console.log('node decode_token.js "your_actual_token_here"');

// Check if token was provided as command line argument
const token = process.argv[2];
if (token) {
  console.log('\nDecoding provided token...');
  decodeToken(token);
} else {
  console.log('\nNo token provided. Usage: node decode_token.js "your_jwt_token"');
}

// For testing, let's also create a sample token for publisher ID 1
console.log('\nCreating sample token for publisher ID 1 (Warner Bros):');
const sampleToken = jwt.sign(
  { 
    userId: 5, 
    userType: 'publisher',
    publisherId: 1,
    publisherName: 'Warner Bros Pictures'
  }, 
  SECRET_KEY, 
  { expiresIn: '24h' }
);
console.log('Sample token for publisher 1:', sampleToken);
console.log('Decoded sample token:', jwt.decode(sampleToken));
