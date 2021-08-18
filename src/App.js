import { useEffect } from 'react';

import './App.css';
import Container from './components/Thermostats';
import TrenchHeaters from './components/TrenchHeaters';
import ServerRooms from './components/ServerRooms';
import WeeklyProgram from './components/WeeklyProgram';

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
            <li>
              <NavLink activeClassName="active" to="/server-rooms">
                Server Rooms
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/weekly-program">
                Weekly Program
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Container} />
          <Route path="/trench-heaters" component={TrenchHeaters} />
          <Route path="/water-leakages" component={WaterLeakages} />
          <Route path="/server-rooms" component={ServerRooms} />
          <Route path="/weekly-program" component={WeeklyProgram} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
