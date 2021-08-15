import { useState, useEffect, memo } from 'react';

import temprature from '../assets/temprature.png';
import power_on from '../assets/power_on.png';
import power_off from '../assets/power_off.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';

import { Modal } from 'antd';

import thermostats from '../thermostats';

let activeButton = null;
function ThermostatModal({ isModalVisible, closeModal, thermostat_id }) {
  const [serviceData, setServiceData] = useState({});

  const thermostat = thermostats.find((item) => item.id === thermostat_id);

  useEffect(() => {
    subscribe(`FCU/#/${thermostat.id}`);

    onMessage((message) => {
      console.log('NewMessage:ThermostatModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`FCU/#/${thermostat.id}`);
  }, []);

  const roomTemprature = serviceData.hasOwnProperty(`FCU_${thermostat_id}_ROOMT_R`)
    ? serviceData[`FCU_${thermostat_id}_ROOMT_R`] / 50
    : null;

  return (
    <Modal
      title={activeButton && activeButton.title}
      visible={isModalVisible}
      width={'80%'}
      footer={null}
      onCancel={closeModal}
    >
      {/* <div>{JSON.stringify(serviceData, null, 2)}</div> */}

      <div className="modal-head">
        <div className="left">left</div>
        <div className="center">
          <img src={temprature} width={40} alt="" />
          {roomTemprature && <h1>{roomTemprature} °C</h1>}
        </div>
        <div className="right">
          <a href="#/">
            <img src={power_on} alt="" className="power_btn" />
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default memo(ThermostatModal);
