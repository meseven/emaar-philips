import { memo } from 'react';

import { Modal } from 'antd';

function TrenchHeaterModal({ isModalVisible, closeModal }) {
  return (
    <Modal
      title={'trench_heate'}
      visible={isModalVisible}
      width={'30%'}
      footer={null}
      onCancel={closeModal}
    >
      test
    </Modal>
  );
}

export default memo(TrenchHeaterModal);
