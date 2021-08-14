import { useEffect } from 'react';

import './App.css';
import Container from './components/Container';

import { client, onMessage, closeConnection, subscribe, publish } from './mqtt-service';

function App() {
  useEffect(() => {
    onMessage((message) => {
      console.log(message);
    });

    subscribe('topic1');

    return () => closeConnection(client);
  }, []);

  return (
    <div className="App">
      <Container />
    </div>
  );
}

export default App;
