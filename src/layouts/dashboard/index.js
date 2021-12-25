import { useMemo, useCallback } from 'react';
import { Menu, Dropdown } from 'antd';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import Header from 'components/Header';
import { useFloor } from 'contexts/FloorContext';

function Dashboard({ children }) {
  const history = useHistory();
  const { floor, setFloor } = useFloor();

  const handleMenuClick = useCallback(
    (e) => {
      history.push({
        search: `?floor=${e.key}`,
      });

      setFloor(e.key);
    },
    [history, setFloor],
  );

  const menu = useMemo(
    () => (
      <Menu className="room-dropdown" onClick={handleMenuClick}>
        <Menu.Item key="1">Floor 1</Menu.Item>
        <Menu.Item key="2">Floor 2</Menu.Item>
        <Menu.Item key="3">Floor 3</Menu.Item>
        <Menu.Item key="4">Floor 4</Menu.Item>
      </Menu>
    ),
    [handleMenuClick],
  );

  return (
    <div className="container-wrapper">
      <Header title="Thermostats">
        <label className="colorpicker">
          <span></span>
          <input
            type="color"
            onChange={(e) =>
              document.documentElement.style.setProperty('--zoom-color', e.target.value)
            }
          />
        </label>

        <Dropdown.Button
          className="room-select"
          trigger={'click'}
          overlay={menu}
          placement="bottomRight"
          icon={<IoMdArrowDropdown size={20} />}
        >
          Floor {floor}
        </Dropdown.Button>
      </Header>

      {children}
    </div>
  );
}

export default Dashboard;
