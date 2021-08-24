import { useState, useEffect, memo } from 'react';

import temprature from '../../assets/temprature.png';
import power_on from '../../assets/power_on.png';
import power_off from '../../assets/power_off.png';
import cooling from '../../assets/cooling.png';
import heating from '../../assets/heating.png';
import logo from '../../assets/logo.png';

import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

import { Modal } from 'antd';
import trench_heaters from './trench-heaters';

function TrenchHeaterModal({ isModalVisible, closeModal, trench_heater_id }) {
  const [serviceData, setServiceData] = useState({});

  const trench_heater = trench_heaters.find((item) => item.id === trench_heater_id);

  useEffect(() => {
    subscribe(`KNV/+/${trench_heater_id}`);

    onMessage((message) => {
      console.log('NewMessage:TrenchHeaterModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {
      console.log('unmount');
      unsubscribe(`KNV/+/${trench_heater_id}`);
    };
  }, [trench_heater_id]);

  const setLockStatus = (status) => {
    publish(
      `KNV/LOCK/${trench_heater_id}`,
      `{"KNV_${trench_heater_id}_LOCK_WR": ${status},"KNV_${trench_heater_id}_LOCK_R": ${status}}`,
    );
  };

  const togglePower = () => {
    publish(`KNV/SET/${trench_heater_id}`, `{"KNV_${trench_heater_id}_SET_WR": 1550}`);

    const new_value = serviceData[`KNV_${trench_heater_id}_ON_WR`] === 1 ? 4 : 1;
    setServiceData((prev) => ({
      ...prev,
      [`KNV_${trench_heater_id}_ON_R`]: new_value,
    }));

    publish(
      `KNV/ON/${trench_heater_id}`,
      `{"KNV_${trench_heater_id}_ON_WR": ${new_value},"KNV_${trench_heater_id}_ON_R": ${new_value}}`,
    );
  };

  const { powerStatus, roomTemprature, coolingStatus, lockStatus } = getData(
    trench_heater_id,
    serviceData,
  );

  return (
    <Modal
      title={trench_heater && trench_heater.text}
      visible={isModalVisible}
      width={400}
      footer={null}
      onCancel={closeModal}
      centered
    >
      {/* <pre>{JSON.stringify(serviceData, null, 2)}</pre> */}

      <>
        <div className="modal-head">
          <div className="left"></div>
          <div className="center">
            <img src={temprature} width={40} alt="" />
            {roomTemprature && <h1>{roomTemprature} °C</h1>}
          </div>
          <div className="right"></div>
        </div>

        <div className="modal-content">
          <div className="left">
            <div>
              <img
                src={coolingStatus === 1 ? heating : cooling}
                alt=""
                className="cooling_status_img"
              />
            </div>
          </div>
          <div className="center">
            <img src={logo} alt="" className="modal-logo" />
          </div>
          <div className="right">
            <a href="#/" onClick={togglePower}>
              <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
            </a>
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
              value={serviceData[`KNV_${trench_heater_id}_LOCK_R`]}
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

const getData = (trench_heater_id, serviceData) => {
  const roomTempratureKey = `KNV_${trench_heater_id}_ROOMT_R`;
  const coolingStatusKey = `KNV_${trench_heater_id}_MODE_R`;
  const powerStatusKey = `KNV_${trench_heater_id}_ON_R`;
  const lockStatusKey = `KNV_${trench_heater_id}_LOCK_R`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 50
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

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
    lockStatus,
    coolingStatus,
  };
};

export default memo(TrenchHeaterModal);
