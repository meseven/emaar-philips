import { useState, useCallback } from 'react';
import trenchHeaters from './trench-heaters';
import bg from '../../assets/bg.png';

import TrenchHeaterModal from './TrenchHeaterModal';

function TrenchHeaters() {
  const [modal, setModal] = useState({ isVisible: false, trench_heater_id: null });

  const showModal = useCallback((trench_heater_id) => {
    setModal((m) => ({ ...m, isVisible: true, trench_heater_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />

        {trenchHeaters.map((item, i) => {
          return (
            <div
              className="modal-btn-container"
              style={{ left: item.position.x, top: item.position.y }}
              key={i}
            >
              <button onClick={() => showModal(item.id)} className="modal-btn knv">
                {item.text}
              </button>
            </div>
          );
        })}
      </div>

      {modal.isVisible && (
        <TrenchHeaterModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          trench_heater_id={modal.trench_heater_id}
        />
      )}
    </div>
  );
}

export default TrenchHeaters;
