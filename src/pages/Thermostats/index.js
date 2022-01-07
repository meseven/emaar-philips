import { useState, useEffect, useCallback, useMemo } from 'react';
import ZoomArea from 'components/ZoomArea';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import thermostats from './thermostats';
import ThermostatModal from './ThermostatModal';
import tempratureColors from '../../temprature-colors';
import FloorPlanImage from 'components/FloorPlanImage';
import { useFloor } from 'contexts/FloorContext';

const tempColors = tempratureColors;

function Thermostats() {
  const { floor } = useFloor();
  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, thermostat_id: null });

  useEffect(() => {
    subscribe(`L${floor}/F/RT/#`);

    onMessage((message) => {
      console.log('message', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`L${floor}/F/RT/#`);
  }, [floor]);

  const showModal = useCallback((thermostat_id) => {
    setModal((m) => ({ ...m, isVisible: true, thermostat_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  const thermostatList = useMemo(() => {
    return thermostats[floor - 1] || [];
  }, [floor]);

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />

          {thermostatList.map((item, i) => {
            const roomTemprature = serviceData.hasOwnProperty(`L${floor}_F_${item.id}_RT_R`)
              ? serviceData[`L${floor}_F_${item.id}_RT_R`] / 50
              : null;

            const tColor = tempColors[Math.ceil(roomTemprature - 16)];

            return (
              <div
                className="modal-btn-container"
                style={{ left: item.position.x, top: item.position.y }}
                key={i}
              >
                <div className="title" onClick={() => showModal(item.id)}>
                  {item.text}
                </div>

                {roomTemprature && roomTemprature !== 0 && (
                  <button
                    onClick={() => showModal(item.id)}
                    className="modal-btn"
                    style={{
                      backgroundColor: roomTemprature ? '#' + tColor : '',
                    }}
                  >
                    <span>{roomTemprature} °C</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </ZoomArea>

      {modal.isVisible && (
        <ThermostatModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          thermostat_id={modal.thermostat_id}
          thermostats={thermostatList}
        />
      )}
    </>
  );
}

export default Thermostats;
