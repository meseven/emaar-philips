import { useEffect } from 'react';

import './App.css';

import { Connector } from 'mqtt-react-hooks';
import { useMqttState } from 'mqtt-react-hooks';

function App() {
  useEffect(() => {}, []);

  return (
    <div className="App">
      <Connector brokerUrl="ws://127.0.0.1:8888">
        <Status />
      </Connector>
    </div>
  );
}

function Status() {
  /*
   * Status list
   * - Offline
   * - Connected
   * - Reconnecting
   * - Closed
   * - Error: printed in console too
   */
  const { connectionStatus, client } = useMqttState();

  const handleClick = (message) => {
    return client.publish('esp32/led', message);
  };

  return (
    <h1>
      {`Status: ${connectionStatus}`}

      <br />
      <br />

      <button type="button" onClick={() => handleClick('false')}>
        Disable led
      </button>
    </h1>
  );
}

export default App;
