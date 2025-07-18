import { useState } from 'react';

function Show() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    if (!query.trim()) {
      setError("Please enter a query.");
      setLoading(false);
      return;
    }

    const apiUrl = `https://thegoodbroker.app.n8n.cloud/webhook/c69ce562-2f86-4f1b-a5ad-d33d473f9ce4`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `API error: ${response.status}`);
      }

      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        setResults([responseData]);
      } else {
        setResults(Array.isArray(responseData) ? responseData : []);
      }

    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'left' }}>
      <h2>Global Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {(results.length > 0 || error || loading) && <h3>Results ({results.length})</h3>}

        {loading && <p>Searching...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && results.length === 0 && <p>No results found. Enter criteria above and click Search.</p>}

        <ul>
          {results.map((item, index) => (
            <li key={item.id || index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              {item.context && (
                <>
                  <strong>Context:</strong> {item.context} <br />
                </>
              )}
              {item.output && <em>{item.output}</em>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Show;
