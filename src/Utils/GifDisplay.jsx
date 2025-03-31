import React, { useState, useEffect } from 'react';

const GifDisplay = ({ gifUrl }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = gifUrl;
    img.onload = () => setLoading(false);
  }, [gifUrl]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <img src={gifUrl} alt="gif" style={{ maxWidth: '100%', height: 'auto' }} />
      )}
    </div>
  );
};

export default GifDisplay;
