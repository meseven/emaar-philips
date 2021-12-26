import { memo } from 'react';
import { Slider, Title, Paper } from '@mantine/core';

const MARKS = [
  { value: 0, label: 'Auto' },
  { value: 25, label: 'Low' },
  { value: 50, label: 'Mid' },
  { value: 75, label: 'High' },
];

function FanSpeedController({ fanSpeed, increase_or_decrease_fan_speed }) {
  return (
    <div className="fan-speed-controller-wrapper">
      <Title order={5} mb={8}>
        Fan Speed
      </Title>

      <div className="fan-speed-slider">
        <Slider
          label={(val) => MARKS.find((mark) => mark.value === val).label}
          defaultValue={0}
          step={25}
          radius={0}
          marks={MARKS}
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
