import { useState, useEffect, memo } from 'react';

import temprature from '../../assets/temprature.png';
import power_on from '../../assets/power_on.png';
import power_off from '../../assets/power_off.png';
import cooling from '../../assets/cooling.png';
import heating from '../../assets/heating.png';
import arrow_down from '../../assets/arrow_down.png';
import arrow_up from '../../assets/arrow_up.png';

import { tempratureColorsWshp } from '../../temprature-colors';

import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

import { Modal } from 'antd';
import thermostats from './wshps';

function WshpModal({ isModalVisible, closeModal, wshp_id }) {
  const [serviceData, setServiceData] = useState({});

  const thermostat = thermostats.find((item) => item.id === wshp_id);

  useEffect(() => {
    subscribe(`WSHP/+/${wshp_id}`);

    onMessage((message) => {
      console.log('NewMessage:WSHP-MODAL', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`WSHP/+/${wshp_id}`);
  }, [wshp_id]);

  const setLockStatus = (status) => {
    publish(
      `WSHP/LOCK/${wshp_id}`,
      `{"WSHP_${wshp_id}_LOCK_WR": ${status},"WSHP_${wshp_id}_LOCK_R": ${status}}`,
    );
  };

  const togglePower = () => {
    const new_value = serviceData[`WSHP_${wshp_id}_ON_R`] === 1 ? 4 : 1;
    setServiceData((prev) => ({
      ...prev,
      [`WSHP_${wshp_id}_ON_R`]: new_value,
    }));

    publish(
      `WSHP/ON/${wshp_id}`,
      `{"WSHP_${wshp_id}_ON_WR": ${new_value},"WSHP_${wshp_id}_ON_R": ${new_value}}`,
    );
  };

  const increase_or_decrease_temprature = (type) => {
    const key = [`WSHP_${wshp_id}_SET_R`];
    const new_value = serviceData[key]
      ? type === '+'
        ? serviceData[key] + 1
        : serviceData[key] - 1
      : 5;

    if (new_value > 30 || new_value < 5) return false;

    setServiceData((prev) => ({
      ...prev,
      [key]: new_value,
    }));

    console.log(serviceData);

    publish(
      `WSHP/SET/${wshp_id}`,
      `{"WSHP_${wshp_id}_SET_WR": ${new_value},"WSHP_${wshp_id}_SET_R": ${new_value}}`,
    );
  };

  const increase_or_decrease_fan_speed = (type) => {
    const key = [`WSHP_${wshp_id}_FS_R`];

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
      `WSHP/FS/${wshp_id}`,
      `{"WSHP_${wshp_id}_FS_WR": ${new_value},"WSHP_${wshp_id}_FS_R": ${new_value}}`,
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
    T1,
    T2,
    T3,
    T4,
    FS,
    RV,
    C1S,
    C2S,
    AM,
    E1,
    E2,
    AL,
    FLOW,
  } = getData(wshp_id, serviceData);

  return (
    <Modal
      title={thermostat && thermostat.text}
      visible={isModalVisible}
      width={'35%'}
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
            <ul>
              <li>T1: {T1}</li>
              <li>T2: {T2}</li>
              <li>T3: {T3}</li>
              <li>T4: {T4}</li>
              <li>FS: {FS}</li>
              <li>RV: {RV}</li>
              <li>C1S: {C1S}</li>
              <li>C2S: {C2S}</li>
              <li>AM: {AM}</li>
              <li>E1: {E1}</li>
              <li>E2: {E2}</li>
              <li>AL: {AL}</li>
              <li>FLOW: {FLOW}</li>
            </ul>
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
              value={serviceData[`WSHP_${wshp_id}_LOCK_R`]}
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

const getData = (wshp_id, serviceData) => {
  const roomTempratureKey = `WSHP_${wshp_id}_ROOMT_R`;
  const coolingStatusKey = `WSHP_${wshp_id}_MODE_R`;
  const powerStatusKey = `WSHP_${wshp_id}_ON_R`;
  const fanSpeedKey = `WSHP_${wshp_id}_FS_R`;
  const tempratureSetKey = `WSHP_${wshp_id}_SET_R`;
  const lockStatusKey = `WSHP_${wshp_id}_LOCK_R`;

  const T1_KEY = `WSHP_${wshp_id}_T1`;
  const T2_KEY = `WSHP_${wshp_id}_T2`;
  const T3_KEY = `WSHP_${wshp_id}_T3`;
  const T4_KEY = `WSHP_${wshp_id}_T4`;
  const FS_KEY = `WSHP_${wshp_id}_FS`;
  const RV_KEY = `WSHP_${wshp_id}_RV`;
  const C1S_KEY = `WSHP_${wshp_id}_C1S`;
  const C2S_KEY = `WSHP_${wshp_id}_C2S`;
  const AM_KEY = `WSHP_${wshp_id}_AM`;
  const E1_KEY = `WSHP_${wshp_id}_E1`;
  const E2_KEY = `WSHP_${wshp_id}_E2`;
  const AL_KEY = `WSHP_${wshp_id}_AL`;
  const FLOW_KEY = `WSHP_${wshp_id}_FLOW`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 10
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  const fanSpeed = serviceData.hasOwnProperty(fanSpeedKey) ? serviceData[fanSpeedKey] : null;

  const tempratureSet = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey]
    : null;

  const tempratureSetList = new Array(26)
    .fill(null)
    .map((_, i) => {
      return {
        i: i + 1,
        isActive: i < tempratureSet - 4 || i === 0,
        color: tempratureColorsWshp[i],
      };
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

  const T1 = serviceData.hasOwnProperty(T1_KEY) ? serviceData[T1_KEY] : null;
  const T2 = serviceData.hasOwnProperty(T2_KEY) ? serviceData[T2_KEY] : null;
  const T3 = serviceData.hasOwnProperty(T3_KEY) ? serviceData[T3_KEY] : null;
  const T4 = serviceData.hasOwnProperty(T4_KEY) ? serviceData[T4_KEY] : null;
  const FS = serviceData.hasOwnProperty(FS_KEY) ? serviceData[FS_KEY] : null;
  const RV = serviceData.hasOwnProperty(RV_KEY) ? serviceData[RV_KEY] : null;
  const C1S = serviceData.hasOwnProperty(C1S_KEY) ? serviceData[C1S_KEY] : null;
  const C2S = serviceData.hasOwnProperty(C2S_KEY) ? serviceData[C2S_KEY] : null;
  const AM = serviceData.hasOwnProperty(AM_KEY) ? serviceData[AM_KEY] : null;
  const E1 = serviceData.hasOwnProperty(E1_KEY) ? serviceData[E1_KEY] : null;
  const E2 = serviceData.hasOwnProperty(E2_KEY) ? serviceData[E2_KEY] : null;
  const AL = serviceData.hasOwnProperty(AL_KEY) ? serviceData[AL_KEY] : null;
  const FLOW = serviceData.hasOwnProperty(FLOW_KEY) ? serviceData[FLOW_KEY] : null;

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    fanSpeed,
    tempratureSetList,
    tempratureSet,
    lockStatus,
    T1,
    T2,
    T3,
    T4,
    FS,
    RV,
    C1S,
    C2S,
    AM,
    E1,
    E2,
    AL,
    FLOW,
  };
};

export default memo(WshpModal);
