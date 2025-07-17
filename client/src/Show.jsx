import { useState } from 'react';

function Show() {
  // State for each input field
  const [contactId, setContactId] = useState('');
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // State for API interaction
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results on new search

    // 1. Conditionally build an object with only the fields that are filled out.
    const searchCriteria = {};
    if (contactId.trim()) searchCriteria.contactId = contactId.trim();
    if (query.trim()) searchCriteria.query = query.trim();
    if (email.trim()) searchCriteria.email = email.trim();
    if (phoneNumber.trim()) searchCriteria.phoneNumber = phoneNumber.trim();

    // Prevent API call if no fields are filled
    if (Object.keys(searchCriteria).length === 0) {
      setError("Please fill in at least one field to search.");
      setLoading(false);
      return;
    }

    const apiUrl = `https://thegoodbroker.app.n8n.cloud/webhook-test/c69ce562-2f86-4f1b-a5ad-d33d473f9ce4`;

    try {
      // 2. Send the dynamically created 'searchCriteria' object in the POST body.
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchCriteria),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `API error: ${response.status}`);
      }

      // 3. Handle both single object and array responses, just like before.
      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        setResults([responseData]); // Wrap a single object in an array
      } else {
        setResults(Array.isArray(responseData) ? responseData : []);
      }

    } catch (err) {
      setError(err.message || 'Something went wrong');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // The JSX for the form and results display
  return (
    <div style={{ marginTop: '20px', textAlign: 'left' }}>
      <h2>Search by Any Field</h2>
      <form onSubmit={handleSearch}>
        {/* Each input is correctly tied to its own state */}
        <input
          type="text"
          placeholder="Contact ID"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        {/* Only show the "Results" header if there has been a search */}
        {(results.length > 0 || error || loading) && <h3>Results ({results.length})</h3>}
        
        {loading && <p>Searching...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && results.length === 0 && <p>No results found. Enter criteria above and click Search.</p>}
        
        <ul>
          {/* 4. Ensure your rendering matches the fields your API will return */}
          {results.map((item, index) => (
            <li key={item.id || index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              {/* Conditionally render each piece of data only if it exists */}
              {item.contactId && <><strong>Contact ID:</strong> {item.contactId} <br /></>}
              {item.context && <><strong>Context:</strong> {item.context} <br /></>}
              {item.email && <><strong>Email:</strong> {item.email} <br /></>}
              {item.phoneNumber && <><strong>Phone:</strong> {item.phoneNumber} <br /></>}
              {item.output && <em>{item.output}</em>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Show;