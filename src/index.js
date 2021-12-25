import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';

import App from './App';

import { Connector } from 'mqtt-react-hooks';
import { MantineProvider } from '@mantine/core';

ReactDOM.render(
  <Connector
    brokerUrl="ws://127.0.0.1:8888"
    options={{ keepalive: 0, clientId: `testingMqttReactHooks` }}
    parserMethod={(message) => JSON.parse(new TextDecoder('utf-8').decode(message))}
  >
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <App />
    </MantineProvider>
  </Connector>,

  document.getElementById('root'),
);
