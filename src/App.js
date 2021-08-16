import { useEffect } from 'react';

import './App.css';
import Container from './components/Thermostats';
import TrenchHeaters from './components/TrenchHeaters';

import { closeConnection } from './mqtt-service';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  useEffect(() => {
    return () => closeConnection();
  }, []);

  return (
    <div className="App">
      <Router>
        <nav>
          <ul className="menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/trench-heaters">Trench Heaters</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/trench-heaters" component={TrenchHeaters} />
          <Route path="/" component={Container} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
