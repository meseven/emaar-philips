import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BiWater } from 'react-icons/bi';
import { FaServer, FaCog } from 'react-icons/fa';
import { GrSchedule } from 'react-icons/gr';
import { Tooltip } from 'antd';
import { useFloor } from 'contexts/FloorContext';

function Nav() {
  const { floor } = useFloor();

  const query = `?floor=${floor}`;

  return (
    <nav className="menu">
      <NavLink activeClassName="active" exact to={`/${query}`}>
        <Tooltip placement="right" title={'Thermostats'} color="#50d6e5">
          <AiFillHome size={20} />
        </Tooltip>
      </NavLink>
      <NavLink activeClassName="active" to={`/water-leakages${query}`}>
        <Tooltip placement="right" title={'Water Leakages'} color="#50d6e5">
          <BiWater size={20} />
        </Tooltip>
      </NavLink>
      <NavLink activeClassName="active" to={`/server-rooms${query}`}>
        <Tooltip placement="right" title={'Server Rooms'} color="#50d6e5">
          <FaServer size={20} />
        </Tooltip>
      </NavLink>
      <NavLink activeClassName="active" to={`/weekly-program${query}`}>
        <Tooltip placement="right" title={'Weekly Program'} color="#50d6e5">
          <GrSchedule size={20} />
        </Tooltip>
      </NavLink>
      <NavLink activeClassName="active" to={`/settings${query}`}>
        <Tooltip placement="right" title={'Settings'} color="#50d6e5">
          <FaCog size={20} />
        </Tooltip>
      </NavLink>
    </nav>
  );
}

export default memo(Nav);
