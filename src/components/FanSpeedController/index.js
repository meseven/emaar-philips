import { memo } from 'react';
import arrow_down from 'assets/arrow_down.png';
import arrow_up from 'assets/arrow_up.png';

function FanSpeedController({ fanSpeed, increase_or_decrease_fan_speed }) {
  return (
    <div className="left">
      <div className="modes">
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
      </div>
    </div>
  );
}

export default memo(FanSpeedController);
