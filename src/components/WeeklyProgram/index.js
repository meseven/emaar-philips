import React from 'react';
import Program from './Program';

function WeeklyProgram() {
  return (
    <div className="container-wrapper" style={{ marginTop: 30 }}>
      <div>
        <Program topic_prefix="HZ/F" payload_prefix="HZ_F" title="Heating/Cooling" />
        <Program topic_prefix="HZ/K" payload_prefix="HZ_K" title="Trench Heaters" />

        {/* <div>
          <h2>Trench Heaters</h2>
          <Table columns={columns} dataSource={data} bordered pagination={false} />
        </div> */}
      </div>
    </div>
  );
}

export default WeeklyProgram;
