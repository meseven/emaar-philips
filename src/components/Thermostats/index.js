import { useState, useEffect, useCallback } from 'react';
import ZoomArea from '../ZoomArea';
import Header from '../Header';
import { Menu } from 'antd';
import { IoMdArrowDropdown } from 'react-icons/io';

import { Dropdown } from 'antd';

import bg from '../../assets/bg.png';

import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

import thermostats from './thermostats';
import ThermostatModal from './ThermostatModal';

import tempratureColors from '../../temprature-colors';

const tempColors = tempratureColors;

// let activeButton = null;

function Thermostats() {
  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, thermostat_id: null });

  useEffect(() => {
    subscribe(`FCU/RT/#`);

    onMessage((message) => {
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`FCU/RT/#`);
  }, []);

  const showModal = useCallback((thermostat_id) => {
    setModal((m) => ({ ...m, isVisible: true, thermostat_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  const menu = (
    <Menu className="room-dropdown" onClick={handleMenuClick}>
      <Menu.Item key="1">Room 1</Menu.Item>
      <Menu.Item key="2">Room 2</Menu.Item>
      <Menu.Item key="3">Room 3</Menu.Item>
    </Menu>
  );

  function handleMenuClick(e) {
    console.log('click', e);
  }

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
          trigger="click"
          overlay={menu}
          placement="bottomRight"
          icon={<IoMdArrowDropdown size={20} />}
        >
          Room 1
        </Dropdown.Button>
      </Header>

      <ZoomArea>
        <div className="container">
          <img src={bg} alt="bg" className="container-bg" />
          {thermostats.map((item, i) => {
            const roomTemprature = serviceData.hasOwnProperty(`FCU_${item.id}_ROOMT_R`)
              ? serviceData[`FCU_${item.id}_ROOMT_R`] / 50
              : null;

            return (
              <div
                className="modal-btn-container"
                style={{ left: item.position.x, top: item.position.y }}
                key={i}
              >
                <div className="title">{item.text}</div>
                <button
                  onClick={() => showModal(item.id)}
                  className="modal-btn"
                  style={{
                    backgroundColor: roomTemprature
                      ? '#' + tempColors[Math.ceil(roomTemprature - 15) - 2]
                      : '',
                  }}
                >
                  {roomTemprature && <span>{roomTemprature} °C</span>}
                </button>
              </div>
            );
          })}
        </div>
      </ZoomArea>

      {modal.isVisible && (
        <ThermostatModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          thermostat_id={modal.thermostat_id}
        />
      )}
    </div>
  );
}

export default Thermostats;
