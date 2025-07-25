import './App.css';
import Show from './Show.jsx';
import Text from './Text.jsx';
import { useState } from 'react';

function App() {
  const [activeComponent, setActiveComponent] = useState('show'); // default to Show

  return (
    <div className="app">
      <h1>Search Information</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveComponent('show')} disabled={activeComponent === 'show'}>
          Global Search
        </button>
        <button onClick={() => setActiveComponent('text')} disabled={activeComponent === 'text'} style={{ marginLeft: '10px' }}>
          Search By Email & Query
        </button>
      </div>

      {activeComponent === 'show' && <Show />}
      {activeComponent === 'text' && <Text />}
    </div>
  );
}

export default App;

