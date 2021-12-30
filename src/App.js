import './App.css';

import DashboardRoute from './layouts/dashboard/DashboardRoute';
import AuthRoute from './layouts/auth/AuthRoute';

import Thermostats from './pages/Thermostats';
import ServerRooms from './pages/ServerRooms';
import WeeklyProgram from './pages/WeeklyProgram';
import Settings from './pages/Settings';
import Login from './pages/Login';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import WaterLeakages from './pages/WaterLeakages';
import Alarm from './pages/WaterLeakages/Alarm';

import { FloorContextProvider } from './contexts/FloorContext';
// import Status from 'components/Status';

function App() {
  return (
    <>
      <Alarm />

      {/* <Status /> */}

      <FloorContextProvider>
        <Router>
          <Switch>
            <DashboardRoute path="/" exact component={Thermostats} />
            <DashboardRoute path="/water-leakages" component={WaterLeakages} />
            <DashboardRoute path="/server-rooms" component={ServerRooms} />
            <DashboardRoute path="/weekly-program" component={WeeklyProgram} />
            <DashboardRoute path="/settings" component={Settings} />
            <AuthRoute path="/login" component={Login} />
          </Switch>
        </Router>
      </FloorContextProvider>
    </>
  );
}

export default App;
