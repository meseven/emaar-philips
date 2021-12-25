import './App.css';

import DashboardRoute from './layouts/dashboard/DashboardRoute';

import Thermostats from './components/Thermostats';
import ServerRooms from './components/ServerRooms';
import WeeklyProgram from './components/WeeklyProgram';
import Settings from './components/Settings';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import WaterLeakages from './components/WaterLeakages';
import Alarm from './components/WaterLeakages/Alarm';
import Nav from './components/Nav';

import { FloorContextProvider } from './contexts/FloorContext';

function App() {
  return (
    <>
      <Alarm />

      <FloorContextProvider>
        <Router>
          <Nav />

          <Switch>
            <DashboardRoute path="/" exact component={Thermostats} />
            <DashboardRoute path="/water-leakages" component={WaterLeakages} />
            <DashboardRoute path="/server-rooms" component={ServerRooms} />
            <DashboardRoute path="/weekly-program" component={WeeklyProgram} />
            <DashboardRoute path="/settings" component={Settings} />
          </Switch>
        </Router>
      </FloorContextProvider>
    </>
  );
}

export default App;
