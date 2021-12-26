import { useState, useEffect, memo } from 'react';

import power_on from '../../assets/power_on.png';
import power_off from '../../assets/power_off.png';
import cooling from '../../assets/cooling.png';
import heating from '../../assets/heating.png';
import arrow_down from '../../assets/arrow_down.png';
import arrow_up from '../../assets/arrow_up.png';

import { tempratureColorsWshp } from '../../temprature-colors';

import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

import { Tag } from 'antd';

const tag_style = { fontSize: 16 };

function WshpModal({ wshp_id, text }) {
  const [serviceData, setServiceData] = useState({});

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
    const new_value = serviceData[`WSHP_${wshp_id}_ON_R`] === 1 ? 0 : 1;
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
    let new_value = serviceData[key]
      ? type === '+'
        ? serviceData[key] + 1
        : serviceData[key] - 1
      : 5;

    if (serviceData[key] > 30 && type === '-') {
      new_value = 30;
    }

    if (serviceData[key] < 5 && type === '+') {
      new_value = 5;
    }

    if (new_value > 30 || new_value < 5) return false;

    setServiceData((prev) => ({
      ...prev,
      [key]: new_value,
    }));

    publish(
      `WSHP/SET/${wshp_id}`,
      `{"WSHP_${wshp_id}_SET_WR": ${new_value},"WSHP_${wshp_id}_SET_R": ${new_value}}`,
    );
  };

  const {
    tempratureSet,
    tempratureSetList,
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
    ALStatus,
    AR,
    ALARM,
    SW,
  } = getData(wshp_id, serviceData);

  return (
    <div className="multi-modal-container">
      <div>{text && <h2 style={{ textAlign: 'center' }}>{text}</h2>}</div>

      <div className="modal-head">
        <div className="left">
          <img
            src={coolingStatus === 1 ? heating : cooling}
            alt=""
            className="cooling_status_img"
          />
        </div>
        <div className="center">{roomTemprature && <h1>{roomTemprature} °C</h1>}</div>
        <div className="right">
          <a href="#/" onClick={togglePower}>
            <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
          </a>
        </div>
      </div>

      <div className="modal-content">
        <div className="left " style={{ flex: 5, border: 'none' }}>
          <ul className="wshp-list">
            <li>
              <Tag color="default" style={tag_style}>
                {T1 / 10} °C
              </Tag>{' '}
              <span>Exhaust Air Temp. T1 </span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {T2 / 10} °C
              </Tag>
              <span>Supply Air Temp. T2 </span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {T3 / 10} °C
              </Tag>
              <span>Entering Water Temp. T3 </span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {T4 / 10} °C
              </Tag>
              <span>Leaving Water Temp T4 </span>
            </li>
            <li>
              {FS === 0 ? (
                <Tag color="red" style={tag_style}>
                  Deactive
                </Tag>
              ) : (
                <Tag color="green" style={tag_style}>
                  Active
                </Tag>
              )}
              <span>Fan State </span>
            </li>
            <li>
              {RV === 0 ? (
                <Tag color="red" style={tag_style}>
                  Deactive
                </Tag>
              ) : (
                <Tag color="green" style={tag_style}>
                  Active
                </Tag>
              )}
              <span>Reverse Valve </span>
            </li>
            <li>
              {C1S === 0 ? (
                <Tag color="red" style={tag_style}>
                  Deactive
                </Tag>
              ) : (
                <Tag color="green" style={tag_style}>
                  Active
                </Tag>
              )}
              <span>Compressor 1 State </span>
            </li>
            <li>
              {C2S === 0 ? (
                <Tag color="red" style={tag_style}>
                  Deactive
                </Tag>
              ) : (
                <Tag color="green" style={tag_style}>
                  Active
                </Tag>
              )}
              <span>Compressor 2 State </span>
            </li>
            <li>
              {(AM === 0 || !AM) && (
                <Tag color="default" style={tag_style}>
                  IDLE
                </Tag>
              )}
              {AM === 1 && (
                <Tag color="red" style={tag_style}>
                  Heat
                </Tag>
              )}
              {AM === 2 && (
                <Tag color="blue" style={tag_style}>
                  Cool
                </Tag>
              )}
              <span>Active Mode </span>
            </li>
            <li>
              {E1 === 0 ? (
                <Tag color="red" style={tag_style}>
                  Deactive
                </Tag>
              ) : (
                <Tag color="green" style={tag_style}>
                  Active
                </Tag>
              )}
              <span>Error 1 </span>
            </li>
            <li>
              {E2 === 0 ? (
                <Tag color="red" style={tag_style}>
                  Deactive
                </Tag>
              ) : (
                <Tag color="green" style={tag_style}>
                  Active
                </Tag>
              )}
              <span>Error 2 </span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {ALStatus}
              </Tag>
              <span>Alarm</span>
            </li>
            <li>
              {AR === 0 ? (
                <Tag color="default" style={tag_style}>
                  Normal
                </Tag>
              ) : (
                <Tag color="warning" style={tag_style}>
                  High
                </Tag>
              )}
              <span>Compressor Temp.</span>
            </li>
            <li>
              {ALARM === 0 ? (
                <Tag color="default" style={tag_style}>
                  Normal
                </Tag>
              ) : (
                <Tag color="warning" style={tag_style}>
                  Alarm Active
                </Tag>
              )}
              <span>Alarm Status</span>
            </li>
            <li>
              {SW === 0 ? (
                <Tag color="default" style={tag_style}>
                  Flow ON
                </Tag>
              ) : (
                <Tag color="default" style={tag_style}>
                  Flow OFF
                </Tag>
              )}
              <span>Flow Switch State</span>
            </li>
          </ul>
        </div>
        <div className="right" style={{ flex: 2 }}>
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
            <span>Lock Status</span>
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
            <option value="1">Lock all buttons</option>
          </select>
        </div>
      </div>
    </div>
  );
}

const getData = (wshp_id, serviceData) => {
  const roomTempratureKey = `WSHP_${wshp_id}_ROOMT_R`;
  const coolingStatusKey = `WSHP_${wshp_id}_MODE_R`;
  const powerStatusKey = `WSHP_${wshp_id}_ON_R`;
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
  const AR_KEY = `WSHP_${wshp_id}_ARIZA`;
  const ALARM_KEY = `WSHP_${wshp_id}_ALARM`;
  const SW_KEY = `WSHP_${wshp_id}_CKG`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 10
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

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
  const AR = serviceData.hasOwnProperty(AR_KEY) ? serviceData[AR_KEY] : null;
  const ALARM = serviceData.hasOwnProperty(ALARM_KEY) ? serviceData[ALARM_KEY] : null;
  const SW = serviceData.hasOwnProperty(SW_KEY) ? serviceData[SW_KEY] : null;

  let ALStatus = '';
  switch (AL) {
    case 0:
      ALStatus = 'No Error';
      break;

    case 2:
      ALStatus = 'High Pressure-AL02';
      break;

    case 4:
      ALStatus = 'Low Pressure-AL03';
      break;

    case 8:
      ALStatus = 'FP1 Fault-AL04';
      break;

    case 16:
      ALStatus = 'FP2 Fault-AL05';
      break;

    case 32:
      ALStatus = 'Condensate Overflow-AL06';
      break;

    case 64:
      ALStatus = 'Over/Under Voltage-AL07';
      break;

    case 128:
      ALStatus = 'UPS Warning-AL08';
      break;

    case 256:
      ALStatus = 'Swapped FP1/FP2-AL09';
      break;

    case 512:
      ALStatus = 'Error2-AL10';
      break;

    case 1024:
      ALStatus = 'Room Temp. Sen. Error-AL11';
      break;

    case 2048:
      ALStatus = 'Water Low Lim Error-AL12';
      break;

    case 4096:
      ALStatus = 'Water High Lim Error-AL13';
      break;

    default:
      ALStatus = 'No Error';
  }

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
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
    ALStatus,
    AR,
    ALARM,
    SW,
  };
};

export default memo(WshpModal);
