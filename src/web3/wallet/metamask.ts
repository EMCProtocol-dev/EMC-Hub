import { Wallet } from './wallet';
import { MetaMaskSDK } from '@metamask/sdk';
import { Web3Utils } from '@/web3/utils';

export class Metamask extends Wallet {
  sdk: MetaMaskSDK | undefined;

  constructor() {
    super();
  }

  async init() {
    this.sdk = new MetaMaskSDK();
    await this.sdk.init();
  }

  getProvider() {
    if (!this.sdk) return null;
    return this.sdk.getProvider();
  }

  async connect(): Promise<Resp> {
    if (!this.sdk) return { _result: 1, _desc: 'The sdk is undefined' };
    const [err, _accounts] = await Web3Utils.to(this.sdk.connect());
    const accounts = _accounts as string[];
    if (err) {
      if (err.code === -32002) {
        return { _result: 0, data: [] };
      }
      return { _result: 1, _desc: `Connect error ${err}` };
    }
    if (!accounts || accounts.length === 0) {
      return { _result: 1, _desc: `Account is empty: ${err}` };
    }
    return { _result: 0, data: accounts };
  }

  async disconnect() {
    this.sdk?.disconnect();
  }
}

function singleton() {
  let instance: any = null;
  return new Proxy(Metamask, {
    construct(target, argArray, newTarget) {
      if (!instance) {
        instance = new target();
      }
      return instance;
    },
  });
}

export const MetamaskSingle = singleton();
