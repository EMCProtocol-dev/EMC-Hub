declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'copy-to-clipboard';

declare module '*.png';
declare module '*.svg';
declare module '*.jpg';


interface Window {
  ic: any;
}

interface Resp365 {
  _result: number;
  _desc?: string;
  [k: string]: any;
}
