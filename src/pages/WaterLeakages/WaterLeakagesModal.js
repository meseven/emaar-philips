import { memo, useEffect, useState, useMemo } from 'react';
import { Modal, Alert } from '@mantine/core';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import waterLeakageImg from 'assets/water-leakage.png';

function WaterLeakagesModal({ isModalVisible, closeModal, sensor_id, sensors }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`W/SENSOR/${sensor_id}`);

    onMessage((message) => {
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`W/SENSOR/${sensor_id}`);
  }, [sensor_id]);

  const sensorKey = `wSensor_${sensor_id}_CKG`;
  const sensorData = serviceData.hasOwnProperty(sensorKey) ? serviceData[sensorKey] : null;

  const sensor = useMemo(() => {
    return sensors.find((item) => item.id === sensor_id);
  }, [sensor_id, sensors]);

  return (
    <Modal title={sensor.text} opened={isModalVisible} width={400} onClose={closeModal} centered>
      {sensorData === 0 || sensorData === null ? (
        <Alert title="Everything is fine!" color="green">
          Has no any water leakages.
        </Alert>
      ) : (
        <img src={waterLeakageImg} alt="" className="leakage-img" />
      )}
    </Modal>
  );
}

export default memo(WaterLeakagesModal);
