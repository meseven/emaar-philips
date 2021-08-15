import { useState, useEffect } from 'react';

import bg from '../assets/bg.png';
import temprature from '../assets/temprature.png';
import power_on from '../assets/power_on.png';
import power_off from '../assets/power_off.png';

import { subscribe, unsubscribe, onMessage } from '../mqtt-service';
import { Modal } from 'antd';

import buttonDefinitions from '../button-definitions';

let activeButton = null;

function Container() {
  const [serviceData, setServiceData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    onMessage((message) => {
      console.log('Container', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {};
  }, []);

  const showModal = (data) => {
    activeButton = data;
    setIsModalVisible(true);

    subscribe(`${data.subscribe_topic_prefix}/#`);

    // data.sub_topics.map((sub_topic_name) => {
    //   subscribe(`${data.subscribe_topic_prefix}/${sub_topic_name}`);
    // });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    unsubscribe(`${activeButton.subscribe_topic_prefix}/#`);
    activeButton = null;
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <img src={bg} alt="bg" className="container-bg" />
        {buttonDefinitions.map((item, i) => (
          <button
            key={i}
            onClick={() => showModal(item)}
            className="modal-btn"
            style={{ left: item.position.x, top: item.position.y }}
          >
            {item.text}
          </button>
        ))}
      </div>

      <Modal
        title={activeButton && activeButton.title}
        visible={isModalVisible}
        width={'80%'}
        footer={null}
        onCancel={closeModal}
      >
        <div>{JSON.stringify(serviceData, null, 2)}</div>

        <div className="modal-head">
          <div className="left">left</div>
          <div className="center">
            <img src={temprature} width={40} alt="" />
            <h1>{serviceData.FCU_01_ROOMT_R / 50} °C</h1>
          </div>
          <div className="right">
            <a href="#/">
              <img src={power_on} alt="" className="power_btn" />
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Container;
