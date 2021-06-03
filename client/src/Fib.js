import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Fib() {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState([]);
  const [index, setIndex] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const shouldUpdate = submitted === true;

  useEffect(() => {
    fetchValues();
    fetchIndexes();
    setSubmitted(false);
  }, [shouldUpdate]);

  const fetchValues = async () => {
    const apiValues = await axios.get('/api/values/current');
    const entries = Object.entries(apiValues.data);
    setValues(entries);
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/all');
    setSeenIndexes(seenIndexes.data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: index,
    });
    setIndex('');
    setSubmitted(true);
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    return values.map(([key, value]) => (
      <div key={key}>
        For index {key} I calculated {value}
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
}

export default Fib;
