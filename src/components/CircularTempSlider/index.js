import { memo, useState } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';
import { publish } from '../../mqtt-service';

function CircularTempSlider({ id, settedTemperature }) {
  const [value, setValue] = useState(settedTemperature || 16);

  const onMouseUp = () => {
    const new_value = value * 50;
    publish(`FCU/SET/${id}`, `{"FCU_${id}_SET_WR": ${new_value},"FCU_${id}_SET_R": ${new_value}}`);
  };

  return (
    <div className="temprature-slider">
      <span onMouseUp={onMouseUp}>
        <CircularSlider
          progressColorFrom="#00bfbd"
          progressColorTo="#005a58"
          width={200}
          min={16}
          max={30}
          knobSize={40}
          // progressSize={16}
          // label={coolingStatus === 1 ? 'Heating' : 'Cooling'}
          label="Set Temp"
          trackColor="#eeeeee"
          labelColor="#F8F8F8"
          knobColor="#fff"
          appendToValue="°"
          dataIndex={value - 16}
          onChange={setValue}
        />
      </span>
    </div>
  );
}

export default memo(CircularTempSlider);
