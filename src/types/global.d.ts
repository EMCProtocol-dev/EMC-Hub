declare interface Window {
  $message?: import('naive-ui').MessageApiInjection;
  $loadingBar?: import('naive-ui').LoadingBarApiInjection;
  icx?: any;
}

type Resp = {
  _result: number;
  _desc?: string;
  data?: any;
};
