import { useCallback, useState, useEffect, memo } from 'react';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

import moment from 'moment';

function ReloadBtn() {
  const [countdown, setCountdown] = useState(0);
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`RL`);

    onMessage((message) => {
      console.log('NewMessage:ReloadBtn', message);
      setServiceData((m) => ({ ...m, ...message }));

      const reload_time = serviceData['time'];
      var duration = moment.duration(moment().diff(reload_time));
      var seconds = Math.ceil(duration.asSeconds());
      setCountdown(seconds);
    });

    let interval;
    if (countdown < 0) {
      interval = setInterval(() => {
        setCountdown((m) => m - 1);
      }, 1000);
    }

    return () => {
      unsubscribe(`RL`);
      clearInterval(interval);
    };
  }, [serviceData, countdown]);

  const reload_all_data = useCallback(() => {
    publish(
      'RL',
      `{"mQtt_Reload": "${Math.ceil(Math.random() * 9999)}" ,"time": "${moment().format()}"}`,
    );
  }, []);

  return (
    <div>
      <div>{countdown}</div>

      <button onClick={reload_all_data} disabled={countdown < 0}>
        Reload All Data
      </button>
    </div>
  );
}

export default memo(ReloadBtn);
