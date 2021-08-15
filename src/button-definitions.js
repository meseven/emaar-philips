const button_definitions = [
  {
    id: 'id_1',
    text: 'id:1-btn',
    title: 'id:1-btn title',
    position: {
      x: '6%',
      y: '10%',
    },
    subscribe_topic_prefix: 'FCU01',
    sub_topics: [
      'ON', // power - (on=1, off=4)
      'FS', // fan speed - (auto=0, low=33, mid=66, high=100)
      'SET', // set room temprature - (5...40 * 50)
      'LOCK', // lock (unlock=0, lock-buttons=1, lock-fan-button-only=2, lock-operating-button-only=3, lock-all-buttons=4)
      'RT', // room temprature (param)
      'MODE', // cooling/heating condencator
    ],
    publish_topic_prefix: 'FCU_1_Pub',
  },
  {
    id: 'id_2',
    text: 'id:2-btn',
    title: 'id:2-btn title',
    position: {
      x: '6%',
      y: '34.2%',
    },
    subscribe_topic_prefix: 'FCU02',
    publish_topic_prefix: 'FCU_2_Pub',
  },
];

export default button_definitions;
