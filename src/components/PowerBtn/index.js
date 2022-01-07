import { memo, useState } from 'react';
import { IoIosPower } from 'react-icons/io';
import { ActionIcon, Tooltip } from '@mantine/core';
import { publish } from '../../mqtt-service';

function PowerBtn({ id, powerStatus, powerStatusIsChangeable, publish_prefix }) {
  const [opened, setOpened] = useState(false);

  const togglePower = () => {
    console.log(powerStatusIsChangeable);
    if (!powerStatusIsChangeable) {
      return setOpened(!opened);
    }

    const new_value = powerStatus === 1 ? 4 : 1;

    publish(
      `${publish_prefix}/ON/${id}`,
      `{"${publish_prefix.replace('/', '_')}_${id}_ON_WR": ${new_value},"${publish_prefix.replace(
        '/',
        '_',
      )}_${id}_ON_R": ${new_value}}`,
    );
  };

  const Btn = () => (
    <ActionIcon
      variant="filled"
      size="lg"
      color={powerStatus === 1 ? 'green' : 'red'}
      onClick={togglePower}
      disabled={!powerStatusIsChangeable}
    >
      <IoIosPower size={26} />
    </ActionIcon>
  );

  return (
    <div className="power-btn-wrapper">
      {powerStatusIsChangeable ? (
        <Btn />
      ) : (
        <Tooltip label="Not changeable" delay={500}>
          <Btn />
        </Tooltip>
      )}
    </div>
  );
}

export default memo(PowerBtn);
