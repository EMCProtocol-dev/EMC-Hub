export abstract class Wallet {
  abstract init(): Promise<void>;
  abstract getProvider(): any;
  abstract connect(): Promise<Resp>;
  abstract disconnect(): Promise<void>;
}
