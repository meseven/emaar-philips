import { useState, useEffect, useCallback } from 'react';
import ZoomArea from 'components/ZoomArea';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import thermostats from './thermostats';
import ThermostatModal from './ThermostatModal';
import tempratureColors from '../../temprature-colors';
import FloorPlanImage from 'components/FloorPlanImage';

const tempColors = tempratureColors;

// let activeButton = null;

function Thermostats() {
  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, thermostat_id: null });

  useEffect(() => {
    subscribe(`FCU/RT/#`);

    onMessage((message) => {
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`FCU/RT/#`);
  }, []);

  const showModal = useCallback((thermostat_id) => {
    setModal((m) => ({ ...m, isVisible: true, thermostat_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />

          {thermostats.map((item, i) => {
            const roomTemprature = serviceData.hasOwnProperty(`FCU_${item.id}_ROOMT_R`)
              ? serviceData[`FCU_${item.id}_ROOMT_R`] / 50
              : null;

            return (
              <div
                className="modal-btn-container"
                style={{ left: item.position.x, top: item.position.y }}
                key={i}
              >
                <div className="title" onClick={() => showModal(item.id)}>
                  {item.text}
                </div>
                <button
                  onClick={() => showModal(item.id)}
                  className="modal-btn"
                  style={{
                    backgroundColor: roomTemprature
                      ? '#' + tempColors[Math.ceil(roomTemprature - 15) - 2]
                      : '',
                  }}
                >
                  {roomTemprature && <span>{roomTemprature} °C</span>}
                </button>
              </div>
            );
          })}
        </div>
      </ZoomArea>

      <ThermostatModal
        isModalVisible={modal.isVisible}
        closeModal={closeModal}
        thermostat_id={modal.thermostat_id}
      />
    </>
  );
}

export default Thermostats;
