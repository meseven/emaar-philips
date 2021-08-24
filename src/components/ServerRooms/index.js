import { useState, useEffect, useCallback } from 'react';

import bg from '../../assets/bg.png';

import { Modal } from 'antd';
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

  const showModal = useCallback((wshp_id, multi) => {
    setModal((m) => ({ ...m, isVisible: true, wshp_id, multi }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  const thermostat = thermostats.find((item) => item.id === modal.wshp_id);

  console.log(thermostat);

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        {thermostats.map((item, i) => {
          const roomTemprature = serviceData.hasOwnProperty(`WSHP_${item.id}_ROOMT_R`)
            ? serviceData[`WSHP_${item.id}_ROOMT_R`] / 10
            : null;

          return (
            <div
              className="modal-btn-container"
              style={{ left: item.position.x, top: item.position.y }}
              key={i}
            >
              <div className="title">{item.text}</div>
              <button
                onClick={() => showModal(item.id, item.multi)}
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

      {modal.isVisible && !modal.multi && (
        <Modal
          title={thermostat && thermostat.text}
          visible={modal.isVisible}
          width={400}
          footer={null}
          onCancel={closeModal}
          closeModal={closeModal}
        >
          <WshpModal wshp_id={modal.wshp_id} />
        </Modal>
      )}

      {modal.isVisible && modal.multi && (
        <>
          <Modal
            title={thermostat && thermostat.text}
            visible={modal.isVisible}
            width={'100%'}
            footer={null}
            onCancel={closeModal}
            closeModal={closeModal}
            centered
          >
            <div className="multi-modal">
              {thermostat.rooms.map((room, i) => (
                <WshpModal key={room} wshp_id={room} />
              ))}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Container;
