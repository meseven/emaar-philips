import { useState, useEffect, useCallback } from 'react';

import { Modal } from 'antd';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

import thermostats from './wshps';
import WshpModal from './WshpModal';

import { tempratureColorsWshp } from '../../temprature-colors';
import ZoomArea from 'components/ZoomArea';
import FloorPlanImage from 'components/FloorPlanImage';

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

  const showModal = useCallback((wshp_id) => {
    setModal((m) => ({ ...m, isVisible: true, wshp_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  // const thermostat = thermostats.find((item) => item.id === modal.wshp_id);

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />
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
                <div onClick={() => showModal(item.id)} className="title">
                  {item.text}
                </div>
                <button onClick={() => showModal(item.id)} className="modal-btn">
                  {roomTemprature && <span>{roomTemprature} °C</span>}
                </button>
              </div>
            );
          })}
        </div>
      </ZoomArea>

      <WshpModal isModalVisible={modal.isVisible} closeModal={closeModal} wshp_id={modal.wshp_id} />

      {/* {modal.isVisible && modal.multi && (
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
      )} */}
    </>
  );
}

export default Container;
