const button_definitions = [
  {
    id: 'id_1',
    text: 'id:1-btn',
    title: 'id:1-btn title',
    subscribe_topic_prefix: 'FCU_1_Sub',
    sub_topics: [
      'FCU_01_ON_R', // power - (on=1, off=4)
      'FCU_01_FS_R', // fan speed - (auto=0, low=33, mid=66, high=100)
      'FCU_01_SET_R', // set room temprature - (5...40 * 50)
      'FCU_01_LOCK_R', // lock (unlock=0, lock-buttons=1, lock-fan-button-only=2, lock-operating-button-only=3, lock-all-buttons=4)
      'FCU_01_ROOMT_R', // room temprature (param)
      'FCU_01_MODE_R', // cooling/heating condencator
    ],
    publish_topic_prefix: 'FCU_1_Pub',
  },
  {
    id: 'id_2',
    text: 'id:2-btn',
    title: 'id:2-btn title',
    subscribe_topic_prefix: 'FCU_2_Sub',
    publish_topic_prefix: 'FCU_2_Pub',
  },
];

export default button_definitions;
