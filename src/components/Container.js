import React from 'react';

import bg from '../assets/bg.png';

function Container() {
  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        <div className="controls">
          <button>Click </button>
        </div>
      </div>
    </div>
  );
}

export default Container;
