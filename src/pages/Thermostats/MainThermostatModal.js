import { useMemo } from 'react';
import { Modal, Switch, Title, Button, Select } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { publish } from '../../mqtt-service';
import { useFloor } from 'contexts/FloorContext';
import thermostats from './thermostats';

const publishData = (floor, id, values) => {
  const power = values.power ? 1 : 4;

  publish(
    `L${floor}/F/ON/${id}`,
    `{"L${floor}_F_${id}_ON_WR": ${power},"L${floor}_F_${id}_ON_R": ${power}}`,
  );
};

const MainThermostatModal = ({ isModalVisible, closeModal }) => {
  const { floor } = useFloor();

  const form = useForm({
    initialValues: {
      power: false,
      setTemperature: false,
    },
  });

  const thermostat = useMemo(() => {
    return thermostats[floor - 1];
  }, [floor]);

  const onSubmit = (values) => {
    console.log(values);

    thermostat.map((item, i) => {
      if (item.ignoreBatch) {
        return false;
      }

      setTimeout(() => {
        publishData(floor, item.id, values);
      }, i * 1000);
    });

    // publish(
    //   `L${floor}/F/ON/${item.id}`,
    //   `{"L${floor}_F_${item.id}_ON_WR": ${1},"L${floor}_F_${item.id}_ON_R": ${1}}`,
    // );
  };

  return (
    <Modal opened={isModalVisible} onClose={closeModal} title="Main Thermostat" centered>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <div className="modal_list_item">
          <div>
            <Title order={6}>Power</Title>
          </div>
          <div>
            <Switch size="md" {...form.getInputProps('power', { type: 'checkbox' })} />
          </div>
        </div>

        <div className="modal_list_item">
          <div>
            <Title order={6}>Set Temperature</Title>
          </div>
          <div>
            <Select
              placeholder="Pick one"
              size="xs"
              data={[
                { value: '16', label: '16' },
                { value: '17', label: '17' },
                { value: '18', label: '18' },
                { value: '19', label: '19' },
              ]}
              {...form.getInputProps('setTemperature', { type: 'select' })}
            />
          </div>
        </div>

        <Button type="submit" size="xs" color="primary">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default MainThermostatModal;
