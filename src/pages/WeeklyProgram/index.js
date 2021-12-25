import React from 'react';
import Program from './Program';

function WeeklyProgram() {
  return (
    <>
      <div className="page-area">
        <Program topic_prefix="HZ/F" payload_prefix="HZ_F" title="Heating/Cooling" />
        <Program topic_prefix="HZ/K" payload_prefix="HZ_K" title="Trench Heaters" />
      </div>
    </>
  );
}

export default WeeklyProgram;