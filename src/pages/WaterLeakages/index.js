import { useState, useCallback, useEffect, useMemo } from 'react';
import WaterLeakagesModal from './WaterLeakagesModal';
import sensors from './sensors';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import ZoomArea from 'components/ZoomArea';
import FloorPlanImage from 'components/FloorPlanImage';
import { useFloor } from 'contexts/FloorContext';

function WaterLeakages() {
  const { floor } = useFloor();

  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, sensor_id: null });

  useEffect(() => {
    subscribe(`W/SENSOR/#`);

    onMessage((message) => {
      console.log('WaterLeakages:', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`W/SENSOR/#`);
  }, []);

  const showModal = useCallback((sensor_id) => {
    setModal((m) => ({ ...m, isVisible: true, sensor_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  // wSensor_id_CKG

  const sensorList = useMemo(() => {
    return sensors[floor - 1] || [];
  }, [floor]);

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />

          {sensorList.map((item, i) => {
            const key = `wSensor_${item.id}_CKG`;
            const leakStatus = serviceData.hasOwnProperty(key) ? serviceData[key] : null;

            return (
              <div
                className="modal-btn-container"
                style={{
                  left: item.position.x,
                  top: item.position.y,
                }}
                key={i}
              >
                <button
                  onClick={() => showModal(item.id)}
                  className="modal-btn knv"
                  style={{
                    backgroundColor: leakStatus === 1 ? 'red' : 'green',
                  }}
                >
                  {item.text}
                </button>
              </div>
            );
          })}
        </div>
      </ZoomArea>

      {modal.isVisible && (
        <WaterLeakagesModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          sensor_id={modal.sensor_id}
          sensors={sensorList}
        />
      )}
    </>
  );
}

export default WaterLeakages;
