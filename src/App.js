import { useEffect } from 'react';

import './App.css';

import mqttService from './mqtt-service';
const client = mqttService.getClient(console.log);

function App() {
  useEffect(() => {
    mqttService.onMessage(client, (d) => {
      console.log(d);
    });

    mqttService.subscribe(client, 'topic1');
  }, []);

  const publish = () => {};

  return (
    <div className="App">
      <button onClick={() => publish()}>Publish</button>
    </div>
  );
}

export default App;
