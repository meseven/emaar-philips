import { useState, useEffect, memo } from 'react';

import temprature from '../assets/temprature.png';
import power_on from '../assets/power_on.png';
import power_off from '../assets/power_off.png';
import cooling from '../assets/cooling.png';
import heating from '../assets/heating.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';

import { Modal } from 'antd';

import thermostats from '../thermostats';

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

  const roomTemprature = serviceData.hasOwnProperty(`FCU_${thermostat_id}_ROOMT_R`)
    ? serviceData[`FCU_${thermostat_id}_ROOMT_R`] / 50
    : null;

  const powerStatus = serviceData.hasOwnProperty(`FCU_${thermostat_id}_ON_R`)
    ? serviceData[`FCU_${thermostat_id}_ON_R`]
    : null;

  const coolingStatusKey = `FCU_${thermostat_id}_MODE_R`;
  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  return (
    <Modal
      title={thermostat && thermostat.title}
      visible={isModalVisible}
      width={'40%'}
      footer={null}
      onCancel={closeModal}
    >
      {/* <div>{JSON.stringify(serviceData, null, 2)}</div> */}

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
          <a href="#/">
            <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default memo(ThermostatModal);
