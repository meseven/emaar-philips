import { useState, useEffect, useCallback } from 'react';

import bg from '../../assets/bg.png';

import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

import thermostats from './wshps';
import WshpModal from './WshpModal';

import tempratureColors from '../../temprature-colors';

const tempColors = tempratureColors;

// let activeButton = null;

function Container() {
  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, wshp_id: null });

  useEffect(() => {
    subscribe(`WSHP/RT/#`);

    onMessage((message) => {
      console.log(message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`WSHP/RT/#`);
  }, []);

  const showModal = useCallback((wshp_id) => {
    setModal((m) => ({ ...m, isVisible: true, wshp_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        {thermostats.map((item, i) => {
          const roomTemprature = serviceData.hasOwnProperty(`WSHP_${item.id}_ROOMT_R`)
            ? serviceData[`WSHP_${item.id}_ROOMT_R`] / 50
            : null;

          return (
            <div
              className="modal-btn-container"
              style={{ left: item.position.x, top: item.position.y }}
              key={i}
            >
              <div className="title">{item.text}</div>
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

      {modal.isVisible && (
        <WshpModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          wshp_id={modal.wshp_id}
        />
      )}
    </div>
  );
}

export default Container;
