import { useState, useEffect, memo } from 'react';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import { Modal } from '@mantine/core';
import alarm from 'assets/alarm.gif';

function Alarm() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceData, setServiceData] = useState({});
  const [alarmed, setAlarmed] = useState([]);

  useEffect(() => {
    subscribe('W/SENSOR/+');

    onMessage((message, topic) => {
      if (topic.startsWith('W/SENSOR')) {
        setServiceData((m) => ({ ...m, ...message }));
      }
    });

    return () => unsubscribe('W/SENSOR/+');
  }, []);

  useEffect(() => {
    const filteredByValue = Object.fromEntries(
      Object.entries(serviceData).filter(
        ([key, value]) => key.startsWith('wSensor') && value === 1,
      ),
    );

    const filtered = Object.keys(filteredByValue);

    setAlarmed(filtered);

    if (filtered.length > 0) {
      setIsModalVisible(true);
    }
  }, [serviceData]);

  const handleCancel = () => {
    setIsModalVisible(false);

    setTimeout(() => {
      setIsModalVisible(true);
    }, 30000);
  };

  return (
    <>
      {alarmed.length > 0 && (
        <Modal title="Alarm" opened={isModalVisible} onClose={handleCancel} footer={null} centered>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {alarmed.map((item, i) => {
              const text = item.split('_');

              return (
                <div key={i}>
                  <strong>There is a water leak in area {text[1]} </strong>
                </div>
              );
            })}
            <img src={alarm} style={{ width: '50%', marginTop: 20 }} alt="" />
          </div>
        </Modal>
      )}
    </>
  );
}

export default memo(Alarm);
