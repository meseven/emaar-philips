import React from 'react';
import { Table, TimePicker, Checkbox } from 'antd';
import moment from 'moment';

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

const daysObject = days.map((day) => ({
  title: day.name,
  dataIndex: day.name.toLocaleLowerCase(),
  key: day.name.toLocaleLowerCase(),
  render: (text, record) => <Checkbox onChange={() => {}} />,
}));

const columns = [
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

const data = [
  {
    key: '1',
    name: 'John Brown',
  },
];

function WeeklyProgram() {
  return (
    <div className="container-wrapper" style={{ marginTop: 30 }}>
      <div>
        <div>
          <h2>Heating/Cooling</h2>
          <Table columns={columns} dataSource={data} bordered pagination={false} />
        </div>

        <div>
          <h2>Trench Heaters</h2>
          <Table columns={columns} dataSource={data} bordered pagination={false} />
        </div>
      </div>

      {/* <table>
        <tr>
          {days.map((day, i) => (
            <td key={i}>{day}</td>
          ))}
        </tr>
      </table> */}
    </div>
  );
}

export default WeeklyProgram;
