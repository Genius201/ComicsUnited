import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

function TestApp() {
  console.log('TestApp rendering...');
  
  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h1>🎭 Comics United - Test Mode</h1>
      <p>✅ React is working</p>
      <p>✅ Router is working</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  );
}

function App() {
  console.log('App wrapper rendering...');
  
  return (
    <Router>
      <TestApp />
    </Router>
  );
}

export default App;