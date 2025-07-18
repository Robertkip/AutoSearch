import React, { useState } from 'react';
import './App.css';

function Text() {
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = `https://thegoodbroker.app.n8n.cloud/webhook/c69ce562-2f86-4f1b-a5ad-d33d473f9ce4`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, query }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
      }

      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        setResults([responseData]);
      } else {
        setResults(Array.isArray(responseData) ? responseData : []);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Search Query</h1>

      <form onSubmit={handleQuerySubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {results.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <p>{item.output}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Text;