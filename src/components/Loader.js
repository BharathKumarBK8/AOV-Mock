// components/Loader.js
import React from 'react';

const Loader = ({ isLoading, children }) => {
  if (!isLoading) {
    return children;
  }

  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
