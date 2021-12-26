import { memo } from 'react';
import { Title, Text } from '@mantine/core';

function RoomTemprature({ roomTemprature }) {
  return (
    <div className="room-temprature-wrapper">
      <Text size={'sm'}>Room Temprature</Text>
      <Title order={3}>{roomTemprature} °C</Title>
    </div>
  );
}

export default memo(RoomTemprature);
