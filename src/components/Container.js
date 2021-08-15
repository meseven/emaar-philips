import { useState, useEffect } from 'react';

import bg from '../assets/bg.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';

import buttonDefinitions from '../button-definitions';
import ThermostatModal from './ThermostatModal';

// let activeButton = null;

function Container() {
  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, thermostat_id: null });

  useEffect(() => {
    subscribe(`FCU/RT/#`);

    onMessage((message) => {
      console.log('Container', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`FCU/RT/#`);
  }, []);

  const showModal = (thermostat_id) => {
    setModal((m) => ({ ...m, isVisible: true, thermostat_id }));

    // subscribe(`${data.subscribe_topic_prefix}/#`);
  };

  const closeModal = () => {
    setModal((m) => ({ ...m, isVisible: false }));
    // unsubscribe(`${activeButton.subscribe_topic_prefix}/#`);
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        {buttonDefinitions.map((item, i) => {
          const roomTemprature = serviceData.hasOwnProperty(`FCU_${item.id}_ROOMT_R`)
            ? serviceData[`FCU_${item.id}_ROOMT_R`] / 50
            : null;

          return (
            <button
              key={i}
              onClick={() => showModal(item.id)}
              className="modal-btn"
              style={{ left: item.position.x, top: item.position.y }}
            >
              {item.text} {roomTemprature && <span>({roomTemprature} °C)</span>}
            </button>
          );
        })}
      </div>

      {modal.isVisible && (
        <ThermostatModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          thermostat_id={modal.thermostat_id}
        />
      )}
    </div>
  );
}

export default Container;
