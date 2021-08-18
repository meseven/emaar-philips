import { memo, useEffect, useState } from 'react';

import { Modal, Alert } from 'antd';
import sensors from './sensors';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import waterLeakageImg from '../../assets/water-leakage.png';

function TrenchHeaterModal({ isModalVisible, closeModal, sensor_id }) {
  const [serviceData, setServiceData] = useState({});

  const sensor = sensors.find((item) => item.id === sensor_id);

  useEffect(() => {
    subscribe(`W/SENSOR/${sensor_id}`);

    onMessage((message) => {
      console.log('NewMessage:WaterLeakagesModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`W/SENSOR/${sensor_id}`);
  }, [sensor_id]);

  const sensorKey = `wSensor_${sensor_id}_CKG`;
  const sensorData = serviceData.hasOwnProperty(sensorKey) ? serviceData[sensorKey] : null;

  return (
    <Modal
      title={sensor.text}
      visible={isModalVisible}
      width={'30%'}
      footer={null}
      onCancel={closeModal}
    >
      {sensorData === 0 || sensorData === null ? (
        <Alert message="Has no any water leakages." type="success" showIcon />
      ) : (
        <img src={waterLeakageImg} alt="" className="leakage-img" />
      )}
    </Modal>
  );
}

export default memo(TrenchHeaterModal);
