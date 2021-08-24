import './App.css';
import Container from './components/Thermostats';
import TrenchHeaters from './components/TrenchHeaters';
import ServerRooms from './components/ServerRooms';
import WeeklyProgram from './components/WeeklyProgram';
import Settings from './components/Settings';

import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import WaterLeakages from './components/WaterLeakages';
import Alarm from './components/WaterLeakages/Alarm';

function App() {
  return (
    <div className="App">
      <Alarm />
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
            <li>
              <NavLink activeClassName="active" to="/settings">
                Settings
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
          <Route path="/settings" component={Settings} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
