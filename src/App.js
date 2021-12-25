import './App.css';

import DashboardRoute from './layouts/dashboard/DashboardRoute';

import Thermostats from './pages/Thermostats';
import ServerRooms from './pages/ServerRooms';
import WeeklyProgram from './pages/WeeklyProgram';
import Settings from './pages/Settings';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import WaterLeakages from './pages/WaterLeakages';
import Alarm from './pages/WaterLeakages/Alarm';
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
