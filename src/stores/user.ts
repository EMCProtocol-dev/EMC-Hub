import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Utils } from '@/tools/utils';
import { Http } from '@/tools/http';
import { useMessage } from 'naive-ui';

interface User {
  id: string | number;
  nickname: string;
  avatar: string;
  description?: string;
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
};
export type GoogleSigninParams = {
  //google token
  token: string;
};

const STORAGE_KEY = 'emchub.user';

export const useUserStore = defineStore('user', () => {
  const defaultUser = (): User => ({
    id: '',
    nickname: '',
    avatar: '',
    description: '',
  });
  const user = ref<User>(defaultUser());
  const http = Http.getInstance();
  const setUser = (_user: User) => {
    //set pinia user
    user.value = _user;
    //set localstorage
    const cache = { user: _user };
    Utils.setLocalStorage(STORAGE_KEY, cache);
  };
  const handleSignResponse = (token: string, _user: User) => {
    setUser(_user);
    //set http session
    const session = { token };
    http.setSession(session);
  };
  const initSignResult = () => {
    return { _result: 0, _desc: '', user: defaultUser() };
  };
  return {
    user,
    setUser,
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
    async signinWithWallet(params: any) {
      const result = initSignResult();
      result._result = 1;
      result._desc = 'Error';
      return result;
    },
    async signinWithGoogle(params: GoogleSigninParams) {
      http.clearSession();
      const resp = await http.post({
        url: '/emchub/api/client/user/googleLogin',
        data: { token: params.token },
      });
      const result = initSignResult();
      if (resp?._result !== 0) {
        result._result = 1;
        result._desc = resp?._desc || '';
      }
      if (result._result === 0) {
        const token = resp._sid;
        const respUser = resp.user;
        const nickname: string = respUser.username || '';
        const userId: number = respUser.userId || 0;
        const avatar: string = respUser.userImage || '';
        const user = { id: userId, nickname: nickname || 'EMCHub', avatar: avatar };
        result.user = user;
        handleSignResponse(token, user);
      }
      return result;
    },
    async signin(params: SigninParams) {
      http.clearSession();
      const resp = await http.post({
        url: '/emchub/api/client/user/login',
        data: {
          userCode: params.account,
          password: params.password || '',
        },
      });
      const result = initSignResult();
      if (resp?._result !== 0) {
        result._result = 1;
        result._desc = resp?._desc || '';
      }
      if (result._result === 0) {
        const token = resp._sid;
        const respUser = resp.user;
        const nickname: string = respUser.username || '';
        const userId: number = respUser.userId || 0;
        const avatar: string = respUser.userImage || '';
        const user = { id: userId, nickname: nickname || 'EMCHub', avatar: avatar };
        result.user = user;
        handleSignResponse(token, user);
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
