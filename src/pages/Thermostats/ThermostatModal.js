import { useState, useEffect, memo, useCallback } from 'react';
import { Modal, Title } from '@mantine/core';

import tempratureColors from '../../temprature-colors';
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

  const setTemprature = (val) => {
    console.log(val);
    const key = [`FCU_${thermostat_id}_SET_R`];
    const new_value = val * 50;

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
    lockData,
  } = getData(thermostat_id, serviceData);

  return (
    <Modal opened={isModalVisible} onClose={closeModal} hideCloseButton centered>
      {/* <pre>{JSON.stringify(serviceData, null, 2)}</pre> */}

      <>
        <div className="modal-head">
          <Title order={4}>{thermostat && thermostat.text}</Title>
          <RoomTemprature roomTemprature={roomTemprature} />
          <PowerBtn powerStatus={powerStatus} togglePower={togglePower} />
        </div>

        <>
          <CircularTempSlider coolingStatus={coolingStatus} />
          <FanSpeedController
            fanSpeed={fanSpeed}
            id={thermostat_id}
            // increase_or_decrease_fan_speed={increase_or_decrease_fan_speed}
          />
        </>

        <LockStatus
          lockData={lockData}
          setLockStatus={setLockStatus}
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

  const tempratureSet = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey] / 50
    : null;

  const tempratureSetList = new Array(15)
    .fill(null)
    .map((_, i) => {
      return { i: i + 1, isActive: i < tempratureSet - 14 || i === 0, color: tempratureColors[i] };
    })
    .reverse();

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    fanSpeed,
    tempratureSetList,
    tempratureSet,
    lockData,
  };
};

export default memo(ThermostatModal);
