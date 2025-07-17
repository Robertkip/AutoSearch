import { useState } from 'react';


function Show() {
  const [contactId, setContactId] = useState('');
  const [context, setContext] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Construct query params string for non-empty inputs
      const params = new URLSearchParams();

      if (contactId.trim()) params.append('contactId', contactId.trim());
      if (context.trim()) params.append('context', context.trim());
      if (email.trim()) params.append('email', email.trim());
      if (phoneNumber.trim()) params.append('phoneNumber', phoneNumber.trim());

      // Replace with your actual API endpoint
      const response = await fetch(`https://thegoodbroker.app.n8n.cloud/webhook-test/c69ce562-2f86-4f1b-a5ad-d33d473f9ce4`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []); // Adjust based on your API response shape
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'left' }}>
      <h2>Search by All Fields</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Contact ID"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>Results ({results.length})</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && results.length === 0 && <p>No results found.</p>}
        <ul>
          {results.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>Contact ID:</strong> {item.contactId} <br />
              <strong>Context:</strong> {item.context} <br />
              <strong>Email:</strong> {item.email} <br />
              <strong>Phone:</strong> {item.phoneNumber} <br />
              <em>{item.info}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Show;
