const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key';

// Create a test token for Publisher ID 1 (Warner Bros Pictures)
// This publisher has series available for episode creation
const testToken = jwt.sign(
  { 
    userId: 5,
    userType: 'publisher',
    publisherId: 1,
    publisherName: 'Warner Bros Pictures'
  }, 
  SECRET_KEY, 
  { expiresIn: '24h' }
);

console.log('=== Test Token for Episode Creation (DEPLOYED BACKEND) ===');
console.log('Publisher: Warner Bros Pictures (ID: 1)');
console.log('Backend URL: https://cse216-project.onrender.com');
console.log('Token:');
console.log(testToken);
console.log('\n=== Instructions ===');
console.log('1. Copy the token above');
console.log('2. Open browser Developer Tools (F12)');
console.log('3. Go to Application/Storage > Local Storage');
console.log('4. Set "token" = [paste token here]');
console.log('5. Navigate to Add Episode page');
console.log('6. You should see available series to add episodes to');
console.log('7. Frontend will use deployed backend: https://cse216-project.onrender.com');

// Also decode the token to verify it's correct
const decoded = jwt.decode(testToken);
console.log('\n=== Token Contents ===');
console.log(JSON.stringify(decoded, null, 2));

console.log('\n=== Quick Test Commands ===');
console.log('Test deployed backend API:');
console.log(`curl -H "Authorization: Bearer ${testToken}" https://cse216-project.onrender.com/publishers/my-shows`);
