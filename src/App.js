import { useEffect } from 'react';

import './App.css';
import Container from './components/Container';

import { closeConnection } from './mqtt-service';

function App() {
  useEffect(() => {
    return () => closeConnection();
  }, []);

  return (
    <div className="App">
      <Container />
    </div>
  );
}

export default App;
