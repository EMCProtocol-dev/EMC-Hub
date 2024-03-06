export const list = [
  {
    value: 0,
    operator: '+',
    type: 'System adjustment',
  },
  {
    value: 1,
    operator: '', //'-',
    type: 'System adjustment',
  },
  {
    value: 2,
    operator: '+',
    type: 'Recharge',
  },
  {
    value: 3,
    operator: '', //'-',
    type: 'Consume',
  },
  {
    value: 6,
    operator: '+',
    type: 'Tranfer',
  },
  {
    value: 7,
    operator: '', //'-',
    type: 'Tranfer',
  },
];

export const map: any = {};
list.forEach((item) => {
  map[item.value] = item;
});
