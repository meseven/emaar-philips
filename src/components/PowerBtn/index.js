import { memo } from 'react';
import power_on from 'assets/power_on.png';
import power_off from 'assets/power_off.png';

function PowerBtn({ powerStatus, togglePower }) {
  return (
    <div className="power-btn-wrapper">
      <a href="#/" onClick={togglePower}>
        <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
      </a>
    </div>
  );
}

export default memo(PowerBtn);
