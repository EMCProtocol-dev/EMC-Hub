import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Utils } from '@/tools/utils';
import { Http } from '@/tools/http';
import { useMessage } from 'naive-ui';

interface User {
  id: string | number;
  nickname: string;
  avatar: string;
}

export type AuthType = 'password' | 'wallet';

export type SignupParams = {
  account: string;
  password: string;
  nickname: string;
  email: string;
};

export type SigninParams = {
  account: string;
  password?: string;
  principal?: string;
  type: AuthType;
};

const STORAGE_KEY = 'emchub.user';

export const useUserStore = defineStore('user', () => {
  const defaultUser = (): User => ({
    id: '',
    nickname: '',
    avatar: '',
  });
  const user = ref<User>(defaultUser());
  const http = Http.getInstance();
  return {
    user,
    getLocalAccount() {
      const cache = Utils.getLocalStorage(STORAGE_KEY);
      if (cache) {
        return {
          account: cache.account,
          password: window.atob(cache.password),
          principal: window.atob(cache.principal),
          type: cache.type,
        };
      }
      return { account: '', password: '', principal: '', type: '' };
    },
    initLocalData() {
      const cache = Utils.getLocalStorage(STORAGE_KEY);
      if (cache) {
        user.value = cache.user;
      }
    },
    async signup(params: SignupParams): Promise<{ _result: number; _desc?: string }> {
      const { account = '', password = '', nickname = '', email = '' } = params;
      const resp1 = await http.postJSON({
        url: '/emchub/api/client/user/reg',
        data: { userCode: account, password: password, username: nickname, email },
      });
      if (resp1._result !== 0) {
        return { _result: 1, _desc: resp1._desc };
      }
      return { _result: 0 };
    },
    async signin(params: SigninParams) {
      const _account = params.account;
      const _password = params.password || '';
      // const _principal = params.principal || '';
      const _type = params.type;
      const result = { _result: 0, _desc: '', user: defaultUser() };
      const http = Http.getInstance();
      const loginParams: any = {};
      if (_type === 'password') {
        loginParams.userCode = _account;
        loginParams.password = _password as string;
      }
      http.clearSession();
      const resp = await http.post({
        url: '/emchub/api/client/user/login',
        data: loginParams,
      });
      if (resp?._result === 0) {
        result._result = 0;
        result._desc = '';
      } else {
        result._result = 1;
        result._desc = resp?._desc || '';
      }
      if (resp?._result === 0) {
        const session = { token: resp._sid || '' };
        const respUser = resp.user;
        //query user info
        const nickname: string = respUser.username || '';
        const userId: number = respUser.userId || 0;
        const avatar: string = respUser.userImage || '';
        result.user = {
          id: userId,
          nickname: nickname || 'EMCHub',
          avatar: avatar,
        };
        const cache = {
          account: _account,
          password: window.btoa(_password),
          // principal: window.btoa(_principal),
          type: _type,
          user: result.user,
        };
        Utils.setLocalStorage(STORAGE_KEY, cache);
        user.value = result.user;

        http.setSession(session);
      }
      return result;
    },
    signOut() {
      Utils.removeLocalStorage(STORAGE_KEY);
      user.value = defaultUser();
      Http.getInstance().clearSession();
      return { _result: 0 };
    },
  };
});
