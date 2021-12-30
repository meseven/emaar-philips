import { useState, useEffect, memo, useMemo } from 'react';

import { tempratureColorsWshp } from '../../temprature-colors';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';
import { Modal, Title } from '@mantine/core';

import wshps from './wshps';
import RoomTemprature from 'components/RoomTemprature';
import PowerBtn from 'components/PowerBtn';
import CircularTempSlider from 'components/CircularTempSlider';
import FanSpeedController from 'components/FanSpeedController';
import LockStatus from 'components/LockStatus';

function WshpModal({ wshp_id, text, isModalVisible, closeModal }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`WSHP/+/${wshp_id}`);

    onMessage((message) => {
      console.log('NewMessage:WSHP-MODAL', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`WSHP/+/${wshp_id}`);
  }, [wshp_id]);

  const togglePower = () => {
    const new_value = serviceData[`WSHP_${wshp_id}_ON_R`] === 1 ? 0 : 1;
    setServiceData((prev) => ({
      ...prev,
      [`WSHP_${wshp_id}_ON_R`]: new_value,
    }));

    publish(
      `WSHP/ON/${wshp_id}`,
      `{"WSHP_${wshp_id}_ON_WR": ${new_value},"WSHP_${wshp_id}_ON_R": ${new_value}}`,
    );
  };

  const { settedTemperature, powerStatus, roomTemprature, coolingStatus, fanSpeed, lockData } =
    useMemo(() => {
      return getData(wshp_id, serviceData);
    }, [wshp_id, serviceData]);

  const wshp = useMemo(() => {
    return wshps.find((item) => item.id === wshp_id);
  }, [wshp_id]);

  return (
    <Modal opened={isModalVisible} onClose={closeModal} hideCloseButton centered>
      <>
        {/* <pre>{JSON.stringify(serviceData, null, 2)}</pre> */}

        <div className="modal-head">
          <Title order={4}>{wshp && wshp.text}</Title>
          <RoomTemprature roomTemprature={roomTemprature} coolingStatus={coolingStatus} />
          <PowerBtn powerStatus={powerStatus} togglePower={togglePower} />
        </div>

        <>
          <CircularTempSlider
            id={wshp_id}
            settedTemperature={settedTemperature}
            publish_prefix={'WSHP'}
          />
          <FanSpeedController id={wshp_id} fanSpeed={fanSpeed} publish_prefix={'WSHP'} />
        </>

        <LockStatus
          lockData={lockData}
          id={wshp_id}
          publish_prefix={'WSHP'}
          value={serviceData[`WSHP_${wshp_id}_LOCK_R`]}
        />
      </>
      {/* <div className="multi-modal-container">
        <div>{text && <h2 style={{ textAlign: 'center' }}>{text}</h2>}</div>

        <div className="modal-head">
          <div className="left">
            <img
              src={coolingStatus === 1 ? heating : cooling}
              alt=""
              className="cooling_status_img"
            />
          </div>
          <div className="center">{roomTemprature && <h1>{roomTemprature} °C</h1>}</div>
          <div className="right">
            <a href="#/" onClick={togglePower}>
              <img src={powerStatus === 1 ? power_on : power_off} alt="" className="power_btn" />
            </a>
          </div>
        </div>

        <div className="modal-content">
          <div className="left " style={{ flex: 5, border: 'none' }}>
            <ul className="wshp-list">
              <li>
                <Tag color="default" style={tag_style}>
                  {T1 / 10} °C
                </Tag>{' '}
                <span>Exhaust Air Temp. T1 </span>
              </li>
              <li>
                <Tag color="default" style={tag_style}>
                  {T2 / 10} °C
                </Tag>
                <span>Supply Air Temp. T2 </span>
              </li>
              <li>
                <Tag color="default" style={tag_style}>
                  {T3 / 10} °C
                </Tag>
                <span>Entering Water Temp. T3 </span>
              </li>
              <li>
                <Tag color="default" style={tag_style}>
                  {T4 / 10} °C
                </Tag>
                <span>Leaving Water Temp T4 </span>
              </li>
              <li>
                {FS === 0 ? (
                  <Tag color="red" style={tag_style}>
                    Deactive
                  </Tag>
                ) : (
                  <Tag color="green" style={tag_style}>
                    Active
                  </Tag>
                )}
                <span>Fan State </span>
              </li>
              <li>
                {RV === 0 ? (
                  <Tag color="red" style={tag_style}>
                    Deactive
                  </Tag>
                ) : (
                  <Tag color="green" style={tag_style}>
                    Active
                  </Tag>
                )}
                <span>Reverse Valve </span>
              </li>
              <li>
                {C1S === 0 ? (
                  <Tag color="red" style={tag_style}>
                    Deactive
                  </Tag>
                ) : (
                  <Tag color="green" style={tag_style}>
                    Active
                  </Tag>
                )}
                <span>Compressor 1 State </span>
              </li>
              <li>
                {C2S === 0 ? (
                  <Tag color="red" style={tag_style}>
                    Deactive
                  </Tag>
                ) : (
                  <Tag color="green" style={tag_style}>
                    Active
                  </Tag>
                )}
                <span>Compressor 2 State </span>
              </li>
              <li>
                {(AM === 0 || !AM) && (
                  <Tag color="default" style={tag_style}>
                    IDLE
                  </Tag>
                )}
                {AM === 1 && (
                  <Tag color="red" style={tag_style}>
                    Heat
                  </Tag>
                )}
                {AM === 2 && (
                  <Tag color="blue" style={tag_style}>
                    Cool
                  </Tag>
                )}
                <span>Active Mode </span>
              </li>
              <li>
                {E1 === 0 ? (
                  <Tag color="red" style={tag_style}>
                    Deactive
                  </Tag>
                ) : (
                  <Tag color="green" style={tag_style}>
                    Active
                  </Tag>
                )}
                <span>Error 1 </span>
              </li>
              <li>
                {E2 === 0 ? (
                  <Tag color="red" style={tag_style}>
                    Deactive
                  </Tag>
                ) : (
                  <Tag color="green" style={tag_style}>
                    Active
                  </Tag>
                )}
                <span>Error 2 </span>
              </li>
              <li>
                <Tag color="default" style={tag_style}>
                  {ALStatus}
                </Tag>
                <span>Alarm</span>
              </li>
              <li>
                {AR === 0 ? (
                  <Tag color="default" style={tag_style}>
                    Normal
                  </Tag>
                ) : (
                  <Tag color="warning" style={tag_style}>
                    High
                  </Tag>
                )}
                <span>Compressor Temp.</span>
              </li>
              <li>
                {ALARM === 0 ? (
                  <Tag color="default" style={tag_style}>
                    Normal
                  </Tag>
                ) : (
                  <Tag color="warning" style={tag_style}>
                    Alarm Active
                  </Tag>
                )}
                <span>Alarm Status</span>
              </li>
              <li>
                {SW === 0 ? (
                  <Tag color="default" style={tag_style}>
                    Flow ON
                  </Tag>
                ) : (
                  <Tag color="default" style={tag_style}>
                    Flow OFF
                  </Tag>
                )}
                <span>Flow Switch State</span>
              </li>
            </ul>
          </div>
          <div className="right" style={{ flex: 2 }}>
            <div className="temprature-set-controls">
              <a href="#/" onClick={() => increase_or_decrease_temprature('+')}>
                <img src={arrow_up} alt="" className="arrow" />
              </a>

              <div className="temprature-set-status">
                {tempratureSet && <span>{tempratureSet} °C</span>}
              </div>

              <a href="#/" onClick={() => increase_or_decrease_temprature('-')}>
                <img src={arrow_down} alt="" className="arrow" />
              </a>
            </div>

            <div className="temprature-set">
              {tempratureSetList.map((item, i) => (
                <div
                  key={i}
                  className={`temprature-set-item ${item.isActive ? 'active' : ''}`}
                  style={{ backgroundColor: item.isActive ? `#${item.color}` : 'lightgray' }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="left">
            <div>
              <span>Lock Status</span>
            </div>
            <div>{lockStatus}</div>
          </div>
          <div className="right">
            <select
              placeholder="Select a option and change input text above"
              onChange={(e) => setLockStatus(e.target.value)}
              value={serviceData[`WSHP_${wshp_id}_LOCK_R`]}
              style={{ width: 220 }}
            >
              <option value="0">Unlock</option>
              <option value="1">Lock all buttons</option>
            </select>
          </div>
        </div>
      </div> */}
    </Modal>
  );
}

const getData = (wshp_id, serviceData) => {
  const roomTempratureKey = `WSHP_${wshp_id}_ROOMT_R`;
  const coolingStatusKey = `WSHP_${wshp_id}_MODE_R`;
  const fanSpeedKey = `WSHP_${wshp_id}_FS_R`;
  const powerStatusKey = `WSHP_${wshp_id}_ON_R`;
  const tempratureSetKey = `WSHP_${wshp_id}_SET_R`;
  const lockStatusKey = `WSHP_${wshp_id}_LOCK_R`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 50
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  const settedTemperature = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey] / 50
    : null;

  const fanSpeed = serviceData.hasOwnProperty(fanSpeedKey) ? serviceData[fanSpeedKey] : null;

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    settedTemperature,
    lockData,
    fanSpeed,
  };
};

export default memo(WshpModal);
