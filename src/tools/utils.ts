import type { FormItemRule } from 'naive-ui';

function getLocalStorage(key: string) {
  let data = window.localStorage.getItem(key);
  if (!data) return data;
  if (data.startsWith('{') || data.startsWith('[')) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  } else {
    return data;
  }
}

function setLocalStorage(key: string, data: any) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  window.localStorage.setItem(key, data);
}

function removeLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}

function getSessionStorage(key: string) {
  let data = window.sessionStorage.getItem(key);
  if (!data) return data;
  if (data.startsWith('{') || data.startsWith('[')) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  } else {
    return data;
  }
}

function setSessionStorage(key: string, data: any) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  window.sessionStorage.setItem(key, data);
}

function removeSessionStorage(key: string) {
  window.sessionStorage.removeItem(key);
}

function parseJSON(str: string | object) {
  if (!str) {
    return null;
  }
  if (typeof str === 'object') {
    return str;
  }
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function toFixed(value: number, fix: number) {
  if (typeof value !== 'number') return value;
  return parseFloat(value.toFixed(fix || 2));
}

function textOverflow(value: string = '', width: number = 10) {
  if (value.length < width * 2) {
    return value;
  }
  if (typeof value.slice === 'function') {
    return `${value.slice(0, width)}...${value.slice(-width)}`;
  } else {
    console.warn('the value is not a srting', value);
    return '';
  }
}

function formatAddress(value = '', width = 10) {
  if (value.length < width * 2) {
    return value;
  }
  if (typeof value.slice === 'function') {
    return `${value.slice(0, width)}...${value.slice(-width)}`;
  } else {
    console.warn('the value is not a srting', value);
    return '';
  }
}

const validatorNotEmpty = (rule: FormItemRule, value: string) => {
  return !value ? new Error('Can not be empty') : true;
};
const validatorStrLength =
  (min: number = 0, max: number = 200) =>
  (rule: FormItemRule, value: string) => {
    if (value.length < min) {
      return new Error('Minimum exceeded');
    }
    if (value.length > max) {
      return new Error('Maximum exceeded');
    }
    return true;
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard && navigator.permissions) {
      return navigator.clipboard.writeText(text)
    } else {
      // 判断是否支持拷贝
      if (!document.execCommand('copy')) return Promise.reject()
      // 创建标签，并隐藏
      const textArea = document.createElement('textarea')
      textArea.style.position = 'fixed'
      textArea.style.top = textArea.style.left = '-100vh'
      textArea.style.opacity = '0'
      textArea.value = text
      document.body.appendChild(textArea)
      // 聚焦、复制
      textArea.focus()
      textArea.select()
      return new Promise<void>((resolve, reject) => {
        document.execCommand('copy') ? resolve() : reject()
        textArea.remove()
      })
    }
  }
export const Utils = {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  parseJSON,
  toFixed,
  textOverflow,
  formatAddress,
  validatorNotEmpty,
  validatorStrLength,
  handleCopy
};
