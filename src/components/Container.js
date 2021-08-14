import React from 'react';

import { publish } from '../mqtt-service';

import bg from '../assets/bg.png';

function Container() {
  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        <div className="controls">
          <button onClick={() => publish('topic1', '{"message":"hello from container component"}')}>
            Click{' '}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Container;
