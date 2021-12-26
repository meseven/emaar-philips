import { memo, useMemo } from 'react';

const situations = [
  'Unlocked',
  'Buttons are locked (+ / -)',
  'Only fan buttons are locked',
  'Only operating button locked',
  'All buttons are locked',
];

function LockStatus({ lockData, setLockStatus, value }) {
  const lockStatus = useMemo(() => {
    return situations[lockData] || 'Unkown';
  }, [lockData]);

  return (
    <div className="modal-footer">
      <div className="left">
        <div>
          <strong>Lock Status</strong>
        </div>
        <div>{lockStatus}</div>
      </div>
      <div className="right">
        <select
          placeholder="Select a option and change input text above"
          onChange={(e) => setLockStatus(e.target.value)}
          value={value}
          style={{ width: 220 }}
        >
          <option value="0">Unlock</option>
          <option value="1">Lock buttons (+ / -)</option>
          <option value="2">Lock fan button only</option>
          <option value="3">Lock operating button only</option>
          <option value="4">Lock all buttons</option>
        </select>
      </div>
    </div>
  );
}

export default memo(LockStatus);
