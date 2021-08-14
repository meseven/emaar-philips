import { useEffect } from 'react';

import mqtt from 'mqtt';
import './App.css';

let client;
function App() {
  useEffect(() => {
    client = mqtt.connect('ws://127.0.0.1:8888');

    client.subscribe('topic1');

    client.on('connect', function () {
      console.log('connected!');
    });

    client.on('message', (topic, message) => {
      console.log(topic, ' : ', message.toString());
    });
  }, []);

  const publish = () => {
    client.publish('topic1', "{ 'test': '1' }");
  };

  return (
    <div className="App">
      <button onClick={() => publish()}>Publish</button>
    </div>
  );
}

export default App;
