import { useState, useEffect, useCallback } from 'react';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import thermostats from './wshps';
import WshpModal from './WshpModal';
import ZoomArea from 'components/ZoomArea';
import FloorPlanImage from 'components/FloorPlanImage';

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
    </>
  );
}

export default Container;
