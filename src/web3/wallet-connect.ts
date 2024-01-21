import { list as networkList } from './network';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue';

export class WalletConnect {
  constructor() {}

  static init() {
    // 1. Get projectId at https://cloud.walletconnect.com
    const projectId = 'b910ce2140dce72d3cc430fe7dc9c862';
    const network = networkList[0];
    
    // 2. Set chains
    const mainnet = {
      chainId: network.chainId,
      name: network.chainName,
      currency: network.symbol,
      explorerUrl: network.blockExplorerUrls[0],
      rpcUrl: network.rpcUrls[0],
    };

    // 3. Create modal
    const metadata = {
      name: 'EMCHub',
      description: 'EMCHub',
      url: 'https://emchub.ai',
      icons: ['https://emchub.ai/assets/logo-6f8acd72.png'],
    };

    createWeb3Modal({
      ethersConfig: defaultConfig({ metadata }),
      chains: [mainnet],
      projectId,
    });
  }
}
