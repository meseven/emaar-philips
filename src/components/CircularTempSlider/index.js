import { memo } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';

function CircularTempSlider({ coolingStatus }) {
  return (
    <div className="temprature-slider">
      <CircularSlider
        progressColorFrom="#00bfbd"
        progressColorTo="#005a58"
        width={200}
        min={16}
        max={30}
        // dataIndex={ts - 16}
        knobSize={40}
        // progressSize={16}
        // label={coolingStatus === 1 ? 'Heating' : 'Cooling'}
        label="Set Temp"
        trackColor="#eeeeee"
        labelColor="#F8F8F8"
        knobColor="#fff"
        appendToValue="°"
        // onChange={setTemprature}
      />
    </div>
  );
}

export default memo(CircularTempSlider);
