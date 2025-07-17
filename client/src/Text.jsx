import { useState } from 'react';
import './App.css';

function Text() {
  const [email, setEmail] = useState('');
  const [contactId, setContactId] = useState('');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllForm, setShowAllForm] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    setShowForm(true);
    setResults([]);
    setError(null);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = `https://thegoodbroker.app.n8n.cloud/webhook-test/c69ce562-2f86-4f1b-a5ad-d33d473f9ce4`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contactId, query }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData); // This is great for debugging!

      if (!response.ok) {
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
      }

      // FIX #1: Handle the API response correctly.
      // If the response is a single object, wrap it in an array so our .map() can work.
      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        setResults([responseData]);
      } else {
        // If it's already an array (or something else), use the old logic.
        setResults(Array.isArray(responseData) ? responseData : []);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function All() {
    return <h2>Search All Fields Form</h2>;
  }

  return (
    <div className="app">
      <h1>Search Contact</h1>

      {/* ... (The forms code is correct and unchanged) ... */}

      {!showForm && !showAllForm && (
        <>
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Continue</button>
          </form>
          <button onClick={() => setShowAllForm(true)} style={{ marginTop: '20px' }}>
            Search All Fields
          </button>
        </>
      )}

      {showForm && !showAllForm && (
        <>
          <form onSubmit={handleQuerySubmit}>
            <h2>Search by Contact ID & Query</h2>
            <p>Email: {email}</p>
            <input
              type="text"
              placeholder="Enter contact ID"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter your query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <h3>Results ({results.length})</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && results.length === 0 && <p>No results found.</p>}
            <ul>
              {/* FIX #2: Render only the data that exists in the response. */}
              {results.map((item, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {/* The API only provides 'output', so we only render that. */}
                  <p>{item.output}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {showAllForm && <All />}
    </div>
  );
}

export default Text;