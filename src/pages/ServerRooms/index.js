import { useState, useEffect, useCallback } from 'react';

import bg from '../../assets/bg.png';

import { Modal } from 'antd';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

import thermostats from './wshps';
import WshpModal from './WshpModal';

import { tempratureColorsWshp } from '../../temprature-colors';
import ZoomArea from '../../components/ZoomArea';

const tempColors = tempratureColorsWshp;

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

  return (
    <>
      <ZoomArea>
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
                {!item.multi && <div className="title">{item.text}</div>}
                <button
                  onClick={() => showModal(item.id, item.multi)}
                  className="modal-btn"
                  style={{
                    backgroundColor: roomTemprature
                      ? Math.ceil(roomTemprature) < 22
                        ? '#34c8fa'
                        : '#' + tempColors[Math.ceil(roomTemprature)]
                      : '',
                  }}
                >
                  {!item.multi && roomTemprature && <span>{roomTemprature} °C</span>}
                  {item.multi && <span>{item.text}</span>}
                </button>
              </div>
            );
          })}
        </div>
      </ZoomArea>

      {modal.isVisible && !modal.multi && (
        <Modal
          title={thermostat && thermostat.text}
          visible={modal.isVisible}
          width={450}
          footer={null}
          onCancel={closeModal}
          closeModal={closeModal}
          centered
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
              {thermostat.rooms.map((room, i) => {
                const t = thermostats.find((item) => item.id === room);

                return <WshpModal key={i} wshp_id={room} text={t.text} />;
              })}
            </div>
          </Modal>
        </>
      )}
    </>
  );
}

export default Container;
