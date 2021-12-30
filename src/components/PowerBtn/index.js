import { memo } from 'react';
import { IoIosPower } from 'react-icons/io';
import { ActionIcon } from '@mantine/core';
import { publish } from '../../mqtt-service';

function PowerBtn({ id, powerStatus, publish_prefix }) {
  const togglePower = () => {
    const new_value = powerStatus === 1 ? 0 : 1;

    publish(
      `${publish_prefix}/ON/${id}`,
      `{"${publish_prefix}_${id}_ON_WR": ${new_value},"${publish_prefix}_${id}_ON_R": ${new_value}}`,
    );
  };

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
