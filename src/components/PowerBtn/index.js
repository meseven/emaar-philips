import { memo } from 'react';
import { IoIosPower } from 'react-icons/io';
import { ActionIcon } from '@mantine/core';

function PowerBtn({ powerStatus, togglePower }) {
  return (
    <div className="power-btn-wrapper">
      <ActionIcon
        variant="filled"
        size="lg"
        color={powerStatus === 1 ? 'green' : 'red'}
        onClick={togglePower}
      >
        <IoIosPower size={26} />
      </ActionIcon>
    </div>
  );
}

export default memo(PowerBtn);
