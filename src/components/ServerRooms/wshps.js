const wshps = [
  {
    id: '01',
    text: 'WSHP01',
    position: {
      x: '26%',
      y: '54%',
    },
  },
  {
    id: '02',
    text: 'WSHP02',
    position: {
      x: '26%',
      y: '44%',
    },
  },
  {
    id: '98',
    text: 'IT Room',
    multi: true,
    rooms: ['01', '02'],
    position: {
      x: '36%',
      y: '48%',
    },
  },
  {
    id: '03',
    text: 'WSHP03',
    position: {
      x: '72%',
      y: '50%',
    },
  },
  {
    id: '04',
    text: 'WSHP04',
    position: {
      x: '72%',
      y: '38%',
    },
  },
  {
    id: '99',
    text: 'Electrical Room',
    multi: true,
    rooms: ['03', '04'],
    position: {
      x: '60%',
      y: '48%',
    },
  },
];

export default wshps;
