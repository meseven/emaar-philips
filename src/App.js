import { useEffect } from 'react';

import './App.css';
import Container from './components/Thermostats';
import TrenchHeaters from './components/TrenchHeaters';

import { closeConnection } from './mqtt-service';

import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import WaterLeakages from './components/WaterLeakages';

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
              <NavLink activeClassName="active" exact to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/trench-heaters">
                Trench Heaters
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/water-leakages">
                Water Leakages
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Container} />
          <Route path="/trench-heaters" component={TrenchHeaters} />
          <Route path="/water-leakages" component={WaterLeakages} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
