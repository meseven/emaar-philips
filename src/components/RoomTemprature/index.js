import { memo } from 'react';
import { Title } from '@mantine/core';

function RoomTemprature({ roomTemprature }) {
  return (
    <div className="room-temprature-wrapper">
      <Title order={2}>{roomTemprature} °C</Title>
    </div>
  );
}

export default memo(RoomTemprature);
