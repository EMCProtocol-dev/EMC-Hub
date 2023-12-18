import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Utils } from '@/tools/utils';
import { Http } from '@/tools/http';
import { Wallet } from '@/web3/wallet/wallet';
import { getWallet } from '@/web3/wallet';
import { Web3Service } from '@/web3';
import { getDefaultNetwork } from '@/web3/network';
interface User {
  id: string | number;
  nickname: string;
  avatar: string;
}

const defaultUser = (): User => ({
  id: 0,
  nickname: '',
  avatar: '',
});

const STORAGE_KEY = 'rwa.website.web3user';

export const useWeb3UserStore = defineStore('web3user', () => {
  const user = ref<User>(defaultUser());
  const accounts = ref<string[]>([]);
  const account0 = ref<string>('');
  const chainId = ref<number | undefined>();
  const targetChainId = getDefaultNetwork().chainId;
  let wallet: Wallet | null = null;

  /**
   * It has to be in that order!!
   * Because the sdk will automatically requestAccount!!
   * 1.get chain id
   * 2.switch network
   * 3.connect
   */
  const signIn = async ({ type }: { type: 'metamask' }) => {
    const Wallet = getWallet(type);
    if (!Wallet) {
      return { _result: 1, _desc: `Unsupport wallet type "${type}"` };
    }
    wallet = new Wallet();
    await wallet.init();

    const resp = await wallet.connect();
    if (resp._result !== 0) {
      console.info(resp._desc);
      resp._desc = resp._desc || 'Connect error. Please try again.';
      return resp;
    }

    const provider = wallet.getProvider();
    if (!provider) {
      return { _result: 1, _desc: 'The provider is null' };
    }
    const w3s = Web3Service.getInstance();
    w3s.setup({ provider: provider });

    const resp1 = await w3s.getChainId();
    if (resp1.chainId !== targetChainId) {
      const resp2 = await w3s.switchNetwork(targetChainId);
      if (resp2._result !== 0) {
        console.info(resp2._desc);
        resp2._desc = resp2._desc || 'Switch network error. Please try again.';
        return resp2;
      }
    }

    // const resp = await wallet.connect();
    // if (resp._result !== 0) {
    //   console.info(resp._desc);
    //   resp._desc = resp._desc || 'Connect error. Please try again.';
    //   return resp;
    // }
    accounts.value = resp.data;
    account0.value = accounts.value[0] ? accounts.value[0].toLocaleLowerCase() : '';
    chainId.value = targetChainId;

    provider.removeAllListeners();

    provider.on('chainChanged', (chainIdHex: string) => {
      console.info('chainChanged', chainIdHex);
      const _chainId = parseInt((chainIdHex as string) || '');
      chainId.value = _chainId;
      if (_chainId !== targetChainId) {
        signOut();
      }
      /** Metamask recommend reloading the page, unless you must do otherwise. **/
    });

    provider.on('accountsChanged', (_accounts: string[]) => {
      console.info('accountsChanged', _accounts);
      accounts.value = _accounts as string[];
      account0.value = accounts.value[0] ? accounts.value[0].toLocaleLowerCase() : '';
    });

    return { _result: 0, _desc: '', accounts, chainId };
  };

  const signOut = async () => {
    await wallet!.disconnect();

    Utils.removeLocalStorage(STORAGE_KEY);
    accounts.value = [];
    account0.value = '';

    user.value = defaultUser();
    Http.getInstance().clearSession();
    return { _result: 0 };
  };

  return {
    user,
    accounts,
    account0,
    chainId,
    initLocalData() {
      const cache = Utils.getLocalStorage(STORAGE_KEY);
      if (cache) {
        user.value = cache.user;
      }
    },
    signIn,
    signOut,
  };
});
