import { useState } from 'react';

function All() {
  const [contactId, setContactId] = useState('');
  const [context, setContext] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    const searchPayload = {
      contactId,
      context,
      email,
      phoneNumber,
    };

    console.log('Search Payload:', searchPayload);
    alert('Search initiated!');
  };

  return (
    <div style={{ marginTop: '20px' }}>
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
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default All;
