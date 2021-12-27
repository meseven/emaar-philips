import { memo, useEffect, useState } from 'react';
import { Slider, Title } from '@mantine/core';
import { publish } from '../../mqtt-service';

// create an array

const marks = [
  { value: 0, label: 'Auto', serviceValue: 0 },
  { value: 25, label: 'Low', serviceValue: 33 },
  { value: 50, label: 'Mid', serviceValue: 66 },
  { value: 75, label: 'High', serviceValue: 100 },
];

function FanSpeedController({ fanSpeed, id }) {
  const [value, setValue] = useState(
    marks.find((mark) => mark.serviceValue === fanSpeed)?.value || 0,
  );

  const onChange = (val) => {
    if (value !== val) {
      console.log('value,val', value, val);
      setValue(() => val);
    }

    // const new_value = marks.find((mark) => mark.value === val).serviceValue;
    // publish(`FCU/FS/${id}`, `{"FCU_${id}_FS_WR": ${new_value},"FCU_${id}_FS_R": ${new_value}}`);
  };

  useEffect(() => {
    // console.log('value', value);
  }, [value]);

  return (
    <div className="fan-speed-controller-wrapper">
      <Title order={5} mb={8}>
        Fan Speed
      </Title>

      <div className="fan-speed-slider">
        <Slider
          label={(val) => marks.find((mark) => mark.value === val).label}
          value={value}
          onChange={onChange}
          step={25}
          radius={0}
          marks={marks}
          size="lg"
          min={0}
          max={75}
        />
      </div>
      {/* <div className="modes">
        <div
          className={`mode-item ${!fanSpeed || fanSpeed > 0 || fanSpeed === 0 ? 'active' : ''}`}
        ></div>
        <div className={`mode-item ${fanSpeed > 33 || fanSpeed === 0 ? 'active' : ''}`}></div>
        <div className={`mode-item ${fanSpeed > 66 || fanSpeed === 0 ? 'active' : ''}`}></div>
      </div>

      <div className="mode-controls">
        <a href="#/" onClick={() => increase_or_decrease_fan_speed('+')}>
          <img src={arrow_up} alt="" className="arrow" />
        </a>
        <div className="auto-status">{fanSpeed === 0 && <span>A</span>}</div>
        <a href="#/" onClick={() => increase_or_decrease_fan_speed('-')}>
          <img src={arrow_down} alt="" className="arrow" />
        </a>
      </div> */}
    </div>
  );
}

export default memo(FanSpeedController);
