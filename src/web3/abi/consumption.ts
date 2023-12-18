export default [
  { inputs: [{ internalType: 'address', name: '_consumptionToken', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'account', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'memo', type: 'string' },
    ],
    name: 'ConsumptionBurned',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'memo', type: 'string' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'consumptionToken',
    outputs: [{ internalType: 'contract ERC20Burnable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
