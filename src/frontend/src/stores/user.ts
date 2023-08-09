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
  principal: string;
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
      const { account = '', password = '', nickname = '', email = '', principal = '' } = params;
      const resp1 = await http.postJSON({
        url: '/mrchaiemc/applyRegister.do',
        data: { bussData: { loginId: account, nickName: nickname, email: email } },
      });
      const userId = resp1?.bussData?.custId;
      if (!userId) {
        return { _result: 1, _desc: 'Failure' };
      }
      const [resp2, resp3] = await Promise.all([
        http.postJSON({
          url: '/mrchaiemc/setAutoration.do',
          data: { custId: userId, bussData: { identityType: 'PASSWD', authToken: password } },
        }),
        http.postJSON({
          url: '/mrchaiemc/setAutoration.do',
          data: { custId: userId, bussData: { identityType: 'PRINCIPAL', authToken: principal } },
        }),
      ]);
      if (resp2.resultCode !== 'SUCCESS' || resp3.resultCode !== 'SUCCESS') {
        return { _result: 2, _desc: 'Auth Failure' };
      }
      return { _result: 0 };
    },
    async signin(params: SigninParams) {
      const _account = params.account;
      const _password = params.password || '';
      const _principal = params.principal || '';
      const _type = params.type;
      const result = { _result: 0, _desc: '', user: defaultUser() };
      const http = Http.getInstance();
      const authData = { identityType: '', authToken: '' };
      if (_type === 'password') {
        authData.identityType = 'PASSWD';
        authData.authToken = _password as string;
      } else if (_type === 'wallet') {
        authData.identityType = 'PRINCIPAL';
        authData.authToken = _principal as string;
      }
      const resp = await http.postJSON({
        url: '/mrchaiemc/userLogin.do',
        data: { loginId: _account, bussData: authData },
      });
      if (resp?.resultCode === 'SUCCESS') {
        result._result = 0;
        result._desc = '';
      } else if (resp?.resultCode === 'NEEDREGISTER') {
        result._result = 1;
        result._desc = 'Account does not exist';
      } else {
        result._result = 1;
        result._desc = 'Failure';
      }
      if (result._result === 0) {
        const session = { token: '' };
        const nickname: string = resp?.bussData?.nickName as string;
        result.user = {
          id: resp?.bussData?.custId,
          nickname: nickname || 'EMCHub',
          avatar: '',
        };
        const cache = {
          account: _account,
          password: window.btoa(_password),
          principal: window.btoa(_principal),
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
