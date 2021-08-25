import { useEffect, useState, useCallback } from 'react';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

import { Tag } from 'antd';
import moment from 'moment';

const tag_style = { fontSize: 16 };

function Settings() {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`CON/#`);
    subscribe(`MQTT/#`);

    onMessage((message) => {
      console.log('NewMessage:Settings', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {
      unsubscribe(`CON/#`);
    };
  }, []);

  const reload_all_data = useCallback(() => {
    publish(
      'MQTT/RL',
      `{"mQtt_Reload": "${Math.ceil(Math.random() * 9999)}" ,"time": "${moment().format()}"}`,
    );
  }, []);

  const tx_bayrak = serviceData['Tx_Bayrak'];
  const err_bayrak = serviceData['Err_Bayrak'];
  const tsb = serviceData['CON_TSB'];
  const gsm_sinyal = serviceData['GSM_SINYAL'];
  const mqtt_con = serviceData['MQTT_CON'];
  const mqtt_net = serviceData['MQTT_NET'];
  const mqtt_timeout = serviceData['MQTT_TIMEOUT'];
  const reload_time = serviceData['time'];

  var duration = moment.duration(moment().diff(reload_time));
  var seconds = 60 - Math.ceil(duration.asSeconds());

  let mqtt_con_status, mqtt_net_status;

  switch (mqtt_con) {
    case 0:
      mqtt_con_status = 'TCP is not connected';
      break;

    case 1:
      mqtt_con_status = 'TCP connecting';
      break;

    case 2:
      mqtt_con_status = 'TCP connecting';
      break;

    case 3:
      mqtt_con_status = 'MQTT connected';
      break;

    default:
      mqtt_con_status = 'Unkown';
      break;
  }

  switch (mqtt_net) {
    case 0:
      mqtt_net_status = 'Sending MQTT connection packet';
      break;

    case 1:
      mqtt_net_status = 'MQTT status pending';
      break;

    case 2:
      mqtt_net_status = 'MQTT status tracking';
      break;

    case 3:
      mqtt_net_status = 'MQTT status is broadcasting';
      break;

    default:
      mqtt_net_status = 'Unkown';
      break;
  }

  console.log(seconds);
  return (
    <div
      className="container-wrapper"
      style={{ marginTop: 30, flexDirection: 'row', alignItems: 'flex-start' }}
    >
      <div className="page-area">
        <div style={{ textAlign: 'center' }}>
          <button onClick={reload_all_data} disabled={seconds > 0 && seconds !== 60}>
            Reload All Data
          </button>
        </div>
      </div>
      <div className="page-area">
        <h2>System Status</h2>
        <div>
          <ul className="wshp-list">
            <li>
              <Tag color="default" style={tag_style}>
                {tx_bayrak}
              </Tag>{' '}
              <span>Transfer Packets</span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {err_bayrak}
              </Tag>{' '}
              <span>Error Packets</span>
            </li>
            <li>
              {tsb === 1 ? (
                <Tag color="green" style={tag_style}>
                  Connected
                </Tag>
              ) : (
                <Tag color="red" style={tag_style}>
                  Not Connected
                </Tag>
              )}

              <span>Server Connection</span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {gsm_sinyal}
              </Tag>
              <span>GSM Signal</span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {mqtt_con_status}
              </Tag>
              <span>MQTT Connection</span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {mqtt_net_status}
              </Tag>
              <span>MQTT Com. Status</span>
            </li>
            <li>
              <Tag color="default" style={tag_style}>
                {mqtt_timeout}
              </Tag>
              <span>MQTT Timeout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
