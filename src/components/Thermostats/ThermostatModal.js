import { useState, useEffect, memo } from 'react';

import temprature from '../../assets/temprature.png';
import power_on from '../../assets/power_on.png';
import power_off from '../../assets/power_off.png';
import cooling from '../../assets/cooling.png';
import heating from '../../assets/heating.png';
import arrow_down from '../../assets/arrow_down.png';
import arrow_up from '../../assets/arrow_up.png';
import logo from '../../assets/logo.png';

import tempratureColors from '../../temprature-colors';

import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

import { Modal } from 'antd';
import thermostats from './thermostats';

function ThermostatModal({ isModalVisible, closeModal, thermostat_id }) {
  const [serviceData, setServiceData] = useState({});

  const thermostat = thermostats.find((item) => item.id === thermostat_id);

  useEffect(() => {
    subscribe(`FCU/+/${thermostat_id}`);

    onMessage((message) => {
      console.log('NewMessage:ThermostatModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {
      console.log('unmount');
      unsubscribe(`FCU/+/${thermostat_id}`);
    };
  }, [thermostat_id]);

  const setLockStatus = (status) => {
    publish(
      `FCU/LOCK/${thermostat_id}`,
      `{"FCU_${thermostat_id}_LOCK_WR": ${status},"FCU_${thermostat_id}_LOCK_R": ${status}}`,
    );
  };

  const togglePower = () => {
    const new_value = serviceData[`FCU_${thermostat_id}_ON_R`] === 1 ? 4 : 1;
    setServiceData((prev) => ({
      ...prev,
      [`FCU_${thermostat_id}_ON_R`]: new_value,
    }));

    publish(
      `FCU/ON/${thermostat_id}`,
      `{"FCU_${thermostat_id}_ON_WR": ${new_value},"FCU_${thermostat_id}_ON_R": ${new_value}}`,
    );
  };

  const increase_or_decrease_temprature = (type) => {
    const key = [`FCU_${thermostat_id}_SET_R`];
    const new_value = serviceData[key]
      ? type === '+'
        ? serviceData[key] + 25
        : serviceData[key] - 25
      : 15;

    console.log(new_value);

    if (new_value / 50 > 30 || new_value / 50 < 15) return false;

    setServiceData((prev) => ({
      ...prev,
      [key]: new_value,
    }));

    publish(
      `FCU/SET/${thermostat_id}`,
      `{"FCU_${thermostat_id}_SET_WR": ${new_value},"FCU_${thermostat_id}_SET_R": ${new_value}}`,
    );
  };

  const increase_or_decrease_fan_speed = (type) => {
    const key = [`FCU_${thermostat_id}_FS_R`];

    const current_value = serviceData[key];

    let new_value = null;

    if (type === '+') {
      if (!current_value || current_value === 33) {
        new_value = 66;
      } else if (current_value === 66) {
        new_value = 100;
      }
    } else {
      if (current_value === 100) {
        new_value = 66;
      } else if (current_value === 66) {
        new_value = 33;
      } else if (current_value === 33) {
        new_value = 0;
      } else {
        new_value = 33;
      }
    }

    publish(
      `FCU/FS/${thermostat_id}`,
      `{"FCU_${thermostat_id}_FS_WR": ${new_value},"FCU_${thermostat_id}_FS_R": ${new_value}}`,
    );
  };

  const {
    tempratureSet,
    tempratureSetList,
    fanSpeed,
    powerStatus,
    roomTemprature,
    coolingStatus,
    lockStatus,
  } = getData(thermostat_id, serviceData);

  return (
    <Modal
      title={thermostat && thermostat.text}
      visible={isModalVisible}
      width={'30%'}
      footer={null}
      onCancel={closeModal}
    >
      {/* <pre>{JSON.stringify(serviceData, null, 2)}</pre> */}

      <>
        <div className="modal-head">
          <div className="left">
            <img
              src={coolingStatus === 1 ? heating : cooling}
              alt=""
              className="cooling_status_img"
            />
          </div>
          <div className="center">
            <img src={temprature} width={40} alt="" />
            {roomTemprature && <h1>{roomTemprature} °C</h1>}
          </div>
          <div className="right">
            <a href="#/" onClick={togglePower}>
              <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
            </a>
          </div>
        </div>

        <div className="modal-content">
          <div className="left">
            <div className="modes">
              <div className={`mode-item ${fanSpeed > 66 || fanSpeed === 0 ? 'active' : ''}`}></div>
              <div className={`mode-item ${fanSpeed > 33 || fanSpeed === 0 ? 'active' : ''}`}></div>
              <div
                className={`mode-item ${
                  !fanSpeed || fanSpeed > 0 || fanSpeed === 0 ? 'active' : ''
                }`}
              ></div>
            </div>

            <div className="mode-controls">
              <a href="#/" onClick={() => increase_or_decrease_fan_speed('+')}>
                <img src={arrow_up} alt="" className="arrow" />
              </a>
              <div className="auto-status">{fanSpeed === 0 && <span>A</span>}</div>
              <a href="#/" onClick={() => increase_or_decrease_fan_speed('-')}>
                <img src={arrow_down} alt="" className="arrow" />
              </a>
            </div>
          </div>
          <div className="center">
            <img src={logo} alt="" className="modal-logo" />
          </div>
          <div className="right">
            <div className="temprature-set-controls">
              <a href="#/" onClick={() => increase_or_decrease_temprature('+')}>
                <img src={arrow_up} alt="" className="arrow" />
              </a>

              <div className="temprature-set-status">
                {tempratureSet && <span>{tempratureSet} °C</span>}
              </div>

              <a href="#/" onClick={() => increase_or_decrease_temprature('-')}>
                <img src={arrow_down} alt="" className="arrow" />
              </a>
            </div>

            <div className="temprature-set">
              {tempratureSetList.map((item, i) => (
                <div
                  key={i}
                  className={`temprature-set-item ${item.isActive ? 'active' : ''}`}
                  style={{ backgroundColor: item.isActive ? `#${item.color}` : 'lightgray' }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="left">
            <div>
              <strong>Lock Status</strong>
            </div>
            <div>{lockStatus}</div>
          </div>
          <div className="right">
            <select
              placeholder="Select a option and change input text above"
              onChange={(e) => setLockStatus(e.target.value)}
              value={serviceData[`FCU_${thermostat_id}_LOCK_R`]}
              style={{ width: 220 }}
            >
              <option value="0">Unlock</option>
              <option value="1">Lock buttons (+ / -)</option>
              <option value="2">Lock fan button only</option>
              <option value="3">Lock operating button only</option>
              <option value="4">Lock all buttons</option>
            </select>
          </div>
        </div>
      </>
    </Modal>
  );
}

const getData = (thermostat_id, serviceData) => {
  const roomTempratureKey = `FCU_${thermostat_id}_ROOMT_R`;
  const coolingStatusKey = `FCU_${thermostat_id}_MODE_R`;
  const powerStatusKey = `FCU_${thermostat_id}_ON_R`;
  const fanSpeedKey = `FCU_${thermostat_id}_FS_R`;
  const tempratureSetKey = `FCU_${thermostat_id}_SET_R`;
  const lockStatusKey = `FCU_${thermostat_id}_LOCK_R`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 50
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  const fanSpeed = serviceData.hasOwnProperty(fanSpeedKey) ? serviceData[fanSpeedKey] : null;

  const tempratureSet = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey] / 50
    : null;

  const tempratureSetList = new Array(15)
    .fill(null)
    .map((_, i) => {
      return { i: i + 1, isActive: i < tempratureSet - 14, color: tempratureColors[i] };
    })
    .reverse();

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;
  let lockStatus = '';
  switch (lockData) {
    case 0:
      lockStatus = 'Unlocked';
      break;

    case 1:
      lockStatus = 'Buttons are locked (+ / -)';
      break;

    case 2:
      lockStatus = 'Only fan buttons are locked';
      break;

    case 3:
      lockStatus = 'Only operating button locked';
      break;

    case 4:
      lockStatus = 'All buttons are locked';
      break;

    default:
      lockStatus = 'Unkown';
  }

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    fanSpeed,
    tempratureSetList,
    tempratureSet,
    lockStatus,
  };
};

export default memo(ThermostatModal);
