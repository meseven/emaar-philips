import { useState, useEffect } from 'react';

import bg from '../assets/bg.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';
import { Modal } from 'antd';

import buttonDefinitions from '../button-definitions';

let activeButton = null;

function Container() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    onMessage((message) => {
      console.log('Container', message);
    });

    return () => {};
  }, []);

  const showModal = (data) => {
    activeButton = data;
    setIsModalVisible(true);
    subscribe(data.sub_topic);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    unsubscribe(activeButton.sub_topic);
    activeButton = null;
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        <div className="controls">
          {/* <button onClick={() => publish('topic1', '{"message":"hello from container component"}')}>
            Click{' '}
          </button> */}

          {buttonDefinitions.map((item, i) => (
            <button key={i} onClick={() => showModal(item)}>
              {item.text}
            </button>
          ))}
        </div>
      </div>

      <Modal
        title={activeButton && activeButton.title}
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
