import { useState, useEffect, memo, useCallback } from 'react';
import { Modal, Title } from '@mantine/core';

// import tempratureColors from '../../temprature-colors';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';
import thermostats from './thermostats';

import CircularTempSlider from 'components/CircularTempSlider';
import RoomTemprature from 'components/RoomTemprature';
import PowerBtn from 'components/PowerBtn';
import FanSpeedController from 'components/FanSpeedController';
import LockStatus from 'components/LockStatus';

function ThermostatModal({ isModalVisible, closeModal, thermostat_id }) {
  const [serviceData, setServiceData] = useState({});

  const thermostat = thermostats.find((item) => item.id === thermostat_id);

  useEffect(() => {
    subscribe(`FCU/+/${thermostat_id}`);

    onMessage((message) => {
      // console.log('NewMessage:ThermostatModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {
      unsubscribe(`FCU/+/${thermostat_id}`);
    };
  }, [thermostat_id]);

  const setLockStatus = (status) => {
    publish(
      `FCU/LOCK/${thermostat_id}`,
      `{"FCU_${thermostat_id}_LOCK_WR": ${status},"FCU_${thermostat_id}_LOCK_R": ${status}}`,
    );
  };

  const togglePower = useCallback(() => {
    const new_value = serviceData[`FCU_${thermostat_id}_ON_R`] === 1 ? 4 : 1;
    setServiceData((prev) => ({
      ...prev,
      [`FCU_${thermostat_id}_ON_R`]: new_value,
    }));

    publish(
      `FCU/ON/${thermostat_id}`,
      `{"FCU_${thermostat_id}_ON_WR": ${new_value},"FCU_${thermostat_id}_ON_R": ${new_value}}`,
    );
  }, [thermostat_id, serviceData]);

  // const setTemprature = (val) => {
  //   console.log(val);
  //   const key = [`FCU_${thermostat_id}_SET_R`];
  //   const new_value = val * 50;

  //   setServiceData((prev) => ({
  //     ...prev,
  //     [key]: new_value,
  //   }));

  //   publish(
  //     `FCU/SET/${thermostat_id}`,
  //     `{"FCU_${thermostat_id}_SET_WR": ${new_value},"FCU_${thermostat_id}_SET_R": ${new_value}}`,
  //   );
  // };

  const { settedTemperature, fanSpeed, powerStatus, roomTemprature, coolingStatus, lockData } =
    getData(thermostat_id, serviceData);

  return (
    <Modal opened={isModalVisible} onClose={closeModal} hideCloseButton centered>
      {/* <pre>{JSON.stringify(serviceData, null, 2)}</pre> */}

      <>
        <div className="modal-head">
          <Title order={4}>{thermostat && thermostat.text}</Title>
          <RoomTemprature roomTemprature={roomTemprature} coolingStatus={coolingStatus} />
          <PowerBtn id={thermostat_id} powerStatus={powerStatus} publish_prefix={'FCU'} />
        </div>

        <>
          <CircularTempSlider
            id={thermostat_id}
            settedTemperature={settedTemperature}
            publish_prefix={'FCU'}
          />
          <FanSpeedController id={thermostat_id} fanSpeed={fanSpeed} publish_prefix="FCU" />
        </>

        <LockStatus
          lockData={lockData}
          id={thermostat_id}
          publish_prefix={'FCU'}
          value={serviceData[`FCU_${thermostat_id}_LOCK_R`]}
        />
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

  const settedTemperature = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey] / 50
    : null;

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    fanSpeed,
    settedTemperature,
    lockData,
  };
};

export default memo(ThermostatModal);
