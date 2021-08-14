import { useState, useEffect } from 'react';

import bg from '../assets/bg.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';
import { Modal } from 'antd';

function Container() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    onMessage((message) => {
      console.log('Container', message);
    });

    return () => {};
  }, []);

  const showModal = () => {
    setIsModalVisible(true);

    subscribe('topic2');
  };

  const closeModal = () => {
    setIsModalVisible(false);
    unsubscribe('topic2');
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        <div className="controls">
          {/* <button onClick={() => publish('topic1', '{"message":"hello from container component"}')}>
            Click{' '}
          </button> */}
          <button onClick={showModal}>Click </button>
        </div>
      </div>

      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        width={'80%'}
        footer={null}
        onCancel={closeModal}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}

export default Container;
