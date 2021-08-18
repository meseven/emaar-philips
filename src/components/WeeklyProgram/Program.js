import { useMemo, useEffect, useState } from 'react';
import { Table, TimePicker, Checkbox } from 'antd';
import moment from 'moment';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

const format = 'HH:mm';

const days = [
  {
    id: '01',
    name: 'Monday',
  },
  {
    id: '02',
    name: 'Tuesday',
  },
  {
    id: '03',
    name: 'Wednesday',
  },
  {
    id: '04',
    name: 'Thursday',
  },
  {
    id: '05',
    name: 'Friday',
  },
  {
    id: '06',
    name: 'Saturday',
  },
  {
    id: '07',
    name: 'Sunday',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
  },
];

function Program({ topic_prefix, payload_prefix }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`${topic_prefix}/#`);

    onMessage((message) => {
      console.log('NewMessage:ThermostatModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`${topic_prefix}/#`);
  }, [topic_prefix]);

  const daysObject = days.map((day) => ({
    title: day.name,
    dataIndex: day.name.toLocaleLowerCase(),
    key: day.name.toLocaleLowerCase(),
    render: (text, record) => (
      <Checkbox
        checked={serviceData[`${payload_prefix}_${day.id}`] === 1 ? true : false}
        onChange={(e) => {
          publish(
            `${topic_prefix}/${day.id}`,
            `{"${payload_prefix}_${day.id}": ${e.target.checked ? 1 : 0}}`,
          );
        }}
      />
    ),
  }));

  const columns = useMemo(() => {
    return [
      ...daysObject,
      {
        title: 'Start Time',
        key: 'start-time',
        render: () => (
          <TimePicker defaultValue={moment('12:00', format)} format={format} allowClear={false} />
        ),
      },
      {
        title: 'End Time',
        key: 'end-time',
        render: () => (
          <TimePicker defaultValue={moment('18:00', format)} format={format} allowClear={false} />
        ),
      },
      {
        title: 'Is Active',
        key: 'is-active',
        render: (text, record) => <Checkbox onChange={() => {}} />,
      },
    ];
  }, [daysObject]);

  return (
    <div>
      <pre>{JSON.stringify(serviceData, null, 2)}</pre>
      <h2>Heating/Cooling</h2>
      <Table columns={columns} dataSource={data} bordered pagination={false} />
    </div>
  );
}

export default Program;
