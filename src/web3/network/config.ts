import Arbitrum from './avatars/arbitrum.png';

export default [
  {
    chainId: 42161,
    chainName: 'Arbitrum One',
    chainAvatar: Arbitrum,
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    //rpcUrls: ['https://arbitrum-mainnet.infura.io'],
    decimals: 18,
    symbol: 'ETH',
    symbolName: 'ETH',
    blockExplorerUrls: ['https://explorer.arbitrum.io'],
    tokens: {
      emc: { contract: '0xDFB8BE6F8c87f74295A87de951974362CedCFA30', symbolName: 'EMC', decimal: 18 },
    },
    apis: {
      consumption: { contract: '0x7957cEFE6aE140F529146e04c868C1FD835a110b' },
    },
  },
  // {
  //   chainId: 421614,
  //   chainName: 'Arbitrum Sepolia Testnet',
  //   chainAvatar: Arbitrum,
  //   rpcUrls: ['https://arbitrum-sepolia.blockpi.network/v1/rpc/public', 'https://sepolia-rollup.arbitrum.io/rpc'],
  //   decimals: 18,
  //   symbol: 'AGOR',
  //   symbolName: 'AGOR',
  //   blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
  //   tokens: {
  //     emc: { contract: '0x20Dcf8106bdC2cCCcf84DD62dc486A7123A41d13', symbolName: 'EMC.t', decimal: 18 },
  //   },
  //   apis: {
  //     consumption: { contract: '' },
  //   },
  // },
  // {
  //   chainId: 421613,
  //   chainName: 'Arbitrum Goerli Testnet',
  //   chainAvatar: Arbitrum,
  //   rpcUrls: ['https://arbitrum-goerli.publicnode.com'],
  //   decimals: 18,
  //   symbol: 'AGOR',
  //   symbolName: 'AGOR',
  //   blockExplorerUrls: ['https://goerli.arbiscan.io/'],
  // },
];
