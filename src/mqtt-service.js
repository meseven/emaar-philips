import mqtt from 'mqtt';

const websocketUrl = 'ws://127.0.0.1:8888';
const apiEndpoint = '';

const client = mqtt.connect(websocketUrl);

client.stream.on('connect', () => {
  console.log('Connected');
});

client.stream.on('error', (err) => {
  console.log(`Connection to ${websocketUrl} failed`);
  client.end();
});

function subscribe(topic, errorHandler) {
  const callBack = (err, granted) => {
    if (err) {
      errorHandler('Subscription request failed');
    }
  };
  return client.subscribe(apiEndpoint + topic, callBack);
}

function onMessage(callBack) {
  client.on('message', (topic, message, packet) => {
    callBack(JSON.parse(new TextDecoder('utf-8').decode(message)));
  });
}

function publish(topic, data) {
  client.publish(topic, data);
}

function unsubscribe(topic) {
  client.unsubscribe(apiEndpoint + topic);
}

function closeConnection() {
  client.end();
}

const mqttService = {
  client,
  subscribe,
  onMessage,
  unsubscribe,
  closeConnection,
  publish,
};

export default mqttService;
