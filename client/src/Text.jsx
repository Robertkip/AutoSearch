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

    // Replace with your actual API endpoint
    const apiUrl = `https://thegoodbroker.app.n8n.cloud/webhook-test/c69ce562-2f86-4f1b-a5ad-d33d473f9ce4?contactId=${encodeURIComponent(contactId)}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // A component to handle the "Search All Fields" functionality can be implemented here.
  // For now, it's a placeholder.
  function All() {
    return <h2>Search All Fields Form</h2>;
  }

  return (
    <div className="app">
      <h1>Search Contact</h1>

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
            <h2>Search by Contact ID</h2>
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
            {error && <p>Error: {error}</p>}
            {!loading && !error && results.length === 0 && <p>No results found.</p>}
            <ul>
              {results.map((item, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <strong>Contact ID:</strong> {item.contactId} <br />
                  <strong>Email:</strong> {item.email} <br />
                  <em>{item.info}</em>
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