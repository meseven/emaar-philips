import { useState, useEffect, memo, useMemo } from 'react';

// import { tempratureColorsWshp } from '../../temprature-colors';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import { Modal, Title } from '@mantine/core';

import RoomTemprature from 'components/RoomTemprature';
import PowerBtn from 'components/PowerBtn';
import CircularTempSlider from 'components/CircularTempSlider';
import FanSpeedController from 'components/FanSpeedController';
import LockStatus from 'components/LockStatus';

function WshpModal({ wshp_id, isModalVisible, closeModal, thermostats }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`WSHP/+/${wshp_id}`);

    onMessage((message) => {
      console.log('NewMessage:WSHP-MODAL', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`WSHP/+/${wshp_id}`);
  }, [wshp_id]);

  const { settedTemperature, powerStatus, roomTemprature, coolingStatus, fanSpeed, lockData } =
    useMemo(() => {
      return getData(wshp_id, serviceData);
    }, [wshp_id, serviceData]);

  const wshp = useMemo(() => {
    return thermostats.find((item) => item.id === wshp_id);
  }, [wshp_id, thermostats]);

  return (
    <Modal opened={isModalVisible} onClose={closeModal} hideCloseButton centered>
      <>
        {/* <pre>{JSON.stringify(serviceData, null, 2)}</pre> */}

        <div className="modal-head">
          <Title order={4}>{wshp && wshp.text}</Title>
          <RoomTemprature roomTemprature={roomTemprature} coolingStatus={coolingStatus} />
          <PowerBtn id={wshp_id} publish_prefix="WSHP" powerStatus={powerStatus} />
        </div>

        <>
          <CircularTempSlider
            id={wshp_id}
            settedTemperature={settedTemperature}
            publish_prefix={'WSHP'}
          />
          <FanSpeedController id={wshp_id} fanSpeed={fanSpeed} publish_prefix={'WSHP'} />
        </>

        <LockStatus
          lockData={lockData}
          id={wshp_id}
          publish_prefix={'WSHP'}
          value={serviceData[`WSHP_${wshp_id}_LOCK_R`]}
        />
      </>
    </Modal>
  );
}

const getData = (wshp_id, serviceData) => {
  const roomTempratureKey = `WSHP_${wshp_id}_ROOMT_R`;
  const coolingStatusKey = `WSHP_${wshp_id}_MODE_R`;
  const fanSpeedKey = `WSHP_${wshp_id}_FS_R`;
  const powerStatusKey = `WSHP_${wshp_id}_ON_R`;
  const tempratureSetKey = `WSHP_${wshp_id}_SET_R`;
  const lockStatusKey = `WSHP_${wshp_id}_LOCK_R`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 50
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  const settedTemperature = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey] / 50
    : null;

  const fanSpeed = serviceData.hasOwnProperty(fanSpeedKey) ? serviceData[fanSpeedKey] : null;

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    settedTemperature,
    lockData,
    fanSpeed,
  };
};

export default memo(WshpModal);
