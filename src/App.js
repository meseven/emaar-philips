import { useEffect } from 'react';

import './App.css';
import Container from './components/Container';

import mqttService from './mqtt-service';

function App() {
  useEffect(() => {
    const client = mqttService.client;

    mqttService.onMessage((d) => {
      console.log(d);
    });

    mqttService.subscribe('topic1');

    return () => mqttService.closeConnection(client);
  }, []);

  const publish = () => {
    mqttService.publish('topic1', '{"message":"hello from react client"}');
  };

  return (
    <div className="App">
      <button onClick={publish}>click</button>

      <Container />
    </div>
  );
}

export default App;
