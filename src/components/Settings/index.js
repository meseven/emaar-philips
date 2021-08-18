import { useEffect, useState } from 'react';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

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

  const tx_bayrak = serviceData['Tx_Bayrak'];
  const err_bayrak = serviceData['Err_Bayrak'];
  const tsb = serviceData['CON_TSB'];
  const gsm_sinyal = serviceData['GSM_SINYAL'];
  const mqtt_con = serviceData['MQTT_CON'];
  const mqtt_net = serviceData['MQTT_NET'];
  const mqtt_timeout = serviceData['MQTT_TIMEOUT'];

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

  return (
    <div
      className="container-wrapper"
      style={{ marginTop: 30, flexDirection: 'column', alignItems: 'center' }}
    >
      <div>
        <div>
          <strong>Transfer Packets:</strong> {tx_bayrak}
        </div>
        <div>
          <strong>Error Packets:</strong> {err_bayrak}
        </div>
        <div>
          <strong>Server Connection:</strong> {tsb === 1 ? 'Connected' : 'Not connected'}
        </div>
        <div>
          <strong>GSM Signal:</strong> {gsm_sinyal}
        </div>
        <div>
          <strong>MQTT Connection:</strong> {mqtt_con_status}
        </div>
        <div>
          <strong>MQTT Com. Status:</strong> {mqtt_net_status}
        </div>
        <div>
          <strong>MQTT Timeout:</strong> {mqtt_timeout}
        </div>
      </div>
    </div>
  );
}

export default Settings;
