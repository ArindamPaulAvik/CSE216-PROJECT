async function testAPI() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJUeXBlIjoicHVibGlzaGVyIiwicHVibGlzaGVySWQiOjEsInB1Ymxpc2hlck5hbWUiOiJXYXJuZXIgQnJvcyBQaWN0dXJlcyIsImlhdCI6MTc1MzgxNjMwOCwiZXhwIjoxNzUzOTAyNzA4fQ.BR72joVN0DC8w2Yu8i6UIPlAy0niVNusDIQftHUf1i8';
  
  try {
    console.log('Testing /publishers/my-shows endpoint...');
    const response = await fetch('https://cse216-project.onrender.com/publishers/my-shows', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Publisher shows:', data);
      
      // Filter for series specifically
      const series = data.filter(show => show.CATEGORY_ID === 2 && show.REMOVED === 0);
      console.log('Filtered series:', series);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testAPI();
