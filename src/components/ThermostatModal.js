import { useState, useEffect, memo } from 'react';

import temprature from '../assets/temprature.png';
import power_on from '../assets/power_on.png';
import power_off from '../assets/power_off.png';
import cooling from '../assets/cooling.png';
import heating from '../assets/heating.png';
import arrow_down from '../assets/arrow_down.png';
import arrow_up from '../assets/arrow_up.png';
import logo from '../assets/logo.png';

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

  const roomTempratureKey = `FCU_${thermostat_id}_ROOMT_R`;
  const coolingStatusKey = `FCU_${thermostat_id}_MODE_R`;
  const powerStatusKey = `FCU_${thermostat_id}_ON_R`;
  const fanSpeedKey = `FCU_${thermostat_id}_FS_R`;
  const tempratureSetKey = `FCU_${thermostat_id}_SET_R`;

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
    ? serviceData[tempratureSetKey]
    : null;

  const tempratureSetList = new Array(15)
    .fill(null)
    .map((_, i) => {
      return { i: i + 1, isActive: i < tempratureSet - 14 };
    })
    .reverse();

  return (
    <Modal
      title={thermostat && thermostat.title}
      visible={isModalVisible}
      width={'45%'}
      footer={null}
      onCancel={closeModal}
    >
      {/* <div>{JSON.stringify(serviceData, null, 2)}</div> */}

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
            <a href="#/">
              <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
            </a>
          </div>
        </div>

        <div className="modal-content">
          <div className="left">
            <div className="modes">
              <div className={`mode-item ${fanSpeed > 66 || fanSpeed === 0 ? 'active' : ''}`}></div>
              <div className={`mode-item ${fanSpeed > 33 || fanSpeed === 0 ? 'active' : ''}`}></div>
              <div className={`mode-item ${fanSpeed > 0 || fanSpeed === 0 ? 'active' : ''}`}></div>
            </div>

            <div className="mode-controls">
              <a href="#/">
                <img src={arrow_up} alt="" className="arrow" />
              </a>
              <div className="auto-status">{fanSpeed === 0 && <span>A</span>}</div>
              <a href="#/">
                <img src={arrow_down} alt="" className="arrow" />
              </a>
            </div>
          </div>
          <div className="center">
            <img src={logo} alt="" className="modal-logo" />
          </div>
          <div className="right">
            <div className="temprature-set-controls">
              <a href="#/">
                <img src={arrow_up} alt="" className="arrow" />
              </a>
              <div className="temprature-set-status">
                {tempratureSet >= 14 && tempratureSet <= 30 && <span>{tempratureSet} °C</span>}
              </div>
              <a href="#/">
                <img src={arrow_down} alt="" className="arrow" />
              </a>
            </div>

            <div className="temprature-set">
              {tempratureSetList.map((item, i) => (
                <div
                  key={i}
                  className={`temprature-set-item ${item.isActive ? 'active' : ''}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}

export default memo(ThermostatModal);
