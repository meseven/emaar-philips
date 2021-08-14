import { useEffect } from 'react';

import './App.css';

import mqttService from './mqtt-service';

function App() {
  useEffect(() => {
    const client = mqttService.getClient(console.log);

    mqttService.onMessage(client, (d) => {
      console.log(d);
    });

    mqttService.subscribe(client, 'topic1');

    return () => mqttService.closeConnection(client);
  }, []);

  const publish = () => {};

  return (
    <div className="App">
      <button onClick={() => publish()}>Publish</button>
    </div>
  );
}

export default App;
