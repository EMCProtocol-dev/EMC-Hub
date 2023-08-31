import { Axios } from 'axios';
import { Utils } from '@/tools/utils';

const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  POST_JSON: 'POST_JSON',
  POST_FORMDATA: 'POST_FORMDATA',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

interface HttpConfig {
  baseURL?: string;
  timeout?: number;
}

const _defaultHttpConfig = {
  baseURL: 'https://client.emchub.ai', //'http://36.155.7.130:9092', , //'https://api.emchub.ai', //'http://36.155.7.134:9080', //
};

type Session = {
  token: '';
  [k: string]: string;
};

const STORAGE_KEY = 'emchub.session';

class Http {
  private client: Axios;
  private session: Session | null = null;

  static _instance: any;

  constructor(config?: HttpConfig) {
    this.client = new Axios(config || _defaultHttpConfig);
    this.client.interceptors.response.use(
      (response) => response,
      (error) => error.response || {}
    );
    this.initSession();
  }

  static getInstance() {
    if (!Http._instance) {
      Http._instance = new Http();
    }
    return Http._instance;
  }

  initSession() {
    const session = Utils.getLocalStorage(STORAGE_KEY);
    if (session) {
      this.setSession(session);
    }
  }

  clearSession() {
    this.session = null;
    Utils.removeLocalStorage(STORAGE_KEY);
  }

  setSession(session: Session) {
    if (session && session.token) {
      Utils.setLocalStorage(STORAGE_KEY, session);
      this.session = session;
    }
  }

  _formatOptions(method: string, options: any) {
    if (typeof options.data === 'object' && !(options.data instanceof window.FormData)) {
      const newData: any = {};
      Object.keys(options.data).forEach((key) => {
        if (options.data[key] !== void 0) {
          newData[key] = options.data[key];
        } else {
          console.info(`remove undefined attr:${key}`);
        }
      });
      options.data = newData;
    }

    if (typeof options.headers !== 'object') {
      options.headers = {};
    }

    if (method === HTTP_METHOD.GET) {
      options.method = 'GET';
      if (options.data) {
        options.params = options.data;
        options.paramsSerializer = {
          serialize: (params: any) =>
            Object.keys(params)
              .map((k) => `${k}=${params[k]}`)
              .join('&'),
        };
        delete options.data;
      }
    } else if (method === HTTP_METHOD.POST) {
      options.method = 'POST';
      options.headers['content-type'] = 'application/x-www-form-urlencoded';
      options.data = Object.keys(options.data)
        .map((key) => `${key}=${encodeURIComponent(options.data[key])}`)
        .join('&');
    } else if (method === HTTP_METHOD.POST_JSON) {
      options.method = 'POST';
      options.headers['content-type'] = 'application/json';
      options.data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
    } else if (method === HTTP_METHOD.POST_FORMDATA) {
      options.method = 'POST';
      options.headers['content-type'] = 'multipart/form-data';
    } else if (method === HTTP_METHOD.DELETE) {
      options.method = 'DELETE';
      options.headers['content-type'] = 'application/json';
    } else if (method === HTTP_METHOD.PUT) {
      options.method = 'PUT';
      options.headers['content-type'] = 'application/json';
    }
    if (this.session) {
      const and = options.url.includes('?') ? '&' : '?';
      const session = this.session as Session;
      const sessionStr = `sid=${session.token}`;
      options.url = `${options.url}${and}${sessionStr}`;
    }
    return options;
  }

  _handler(options: any) {
    return (response: any) => {
      let result = { _result: 0, _desc: '' };
      if (!response.status) {
        result._result = 99;
        result._desc = 'Network error';
      } else if (response.status !== 200) {
        result._result = 96;
        result._desc = `Server Error[${response.status}]`;
      } else {
        if (response.headers['content-type'].includes('application/json')) {
          if (typeof response.data === 'string') {
            try {
              result = JSON.parse(response.data);
            } catch (e) {
              result._result = 98;
              result._desc = 'Failed to parse network data';
            }
          } else if (typeof response.data === 'object') {
            result = response.data;
          }
        } else {
          result._result = 97;
          result._desc = 'Network data format error';
        }
      }

      // if (result._result !== 0) {
      //   if (!options.noAutoHint) {
      //     window.$message.warning(result._desc);
      //   }
      // }

      return result;
    };
  }

  get(options: any) {
    const _opt = this._formatOptions(HTTP_METHOD.GET, options);
    return this.client?.request(_opt).then(this._handler(_opt));
  }

  post(options: any) {
    const _opt = this._formatOptions(HTTP_METHOD.POST, options);
    return this.client?.request(_opt).then(this._handler(_opt));
  }

  postFormData(options: any) {
    const _opt = this._formatOptions(HTTP_METHOD.POST_FORMDATA, options);
    return this.client?.request(_opt).then(this._handler(_opt));
  }

  postJSON(options: any) {
    const _opt = this._formatOptions(HTTP_METHOD.POST_JSON, options);
    return this.client?.request(_opt).then(this._handler(_opt));
  }

  delete(options: any) {
    const _opt = this._formatOptions(HTTP_METHOD.DELETE, options);
    return this.client?.request(_opt).then(this._handler(_opt));
  }

  put(options: any) {
    const _opt = this._formatOptions(HTTP_METHOD.PUT, options);
    return this.client?.request(_opt).then(this._handler(_opt));
  }
}

export { Http };
