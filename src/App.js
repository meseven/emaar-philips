import './App.css';
import Container from './components/Thermostats';
import ServerRooms from './components/ServerRooms';
import WeeklyProgram from './components/WeeklyProgram';
import Settings from './components/Settings';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WaterLeakages from './components/WaterLeakages';
import Alarm from './components/WaterLeakages/Alarm';
import Nav from './components/Nav';

function App() {
  return (
    <>
      <Alarm />
      <Router>
        <Nav />

        <Switch>
          <Route path="/" exact component={Container} />
          <Route path="/water-leakages" component={WaterLeakages} />
          <Route path="/server-rooms" component={ServerRooms} />
          <Route path="/weekly-program" component={WeeklyProgram} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
