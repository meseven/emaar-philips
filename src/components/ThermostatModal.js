import { useState, useEffect, memo } from 'react';

import temprature from '../assets/temprature.png';
import power_on from '../assets/power_on.png';
import power_off from '../assets/power_off.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';

import { Modal } from 'antd';

let activeButton = null;
function ThermostatModal({ isModalVisible, closeModal, thermostat_id }) {
  console.log('modal');
  useEffect(() => {
    // subscribe(`${data.subscribe_topic_prefix}/#`);

    return () => {};
  }, []);

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
          {/* <h1>{serviceData.FCU_01_ROOMT_R / 50} °C</h1> */}
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
