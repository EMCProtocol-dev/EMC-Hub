import { createClient as create, IConnector } from "@connect2ic/core";
import {
  AstroX,
  ICX,
  InfinityWallet,
  NFID,
  StoicWallet,
} from "@connect2ic/core/providers";
import { isPrincipalText } from "../wallet/utils";
import { ConnectedIdentity, ConnectType, ActorCreator } from "./identity";
import { CustomInternetIdentity, getIIFrame } from "./providers/ii";
import { MetamaskAuthIC } from "./providers/metamask";
import { IDL } from "@dfinity/candid";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";

export const getActorCreatorByActiveProvider = (
  activeProvider: IConnector
): ActorCreator => {
  return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
    const result = await activeProvider.createActor<ActorSubclass<T>>(
      canisterId,
      idlFactory as any
    );
    if (result.isOk()) return result.value;
    throw new Error(result.error.message);
  };
};

export const createClient = () => {
  const astroXProvider = (window as any).icx
    ? new ICX({
        delegationModes: ["domain", "global"],
        dev: false,
      })
    : new AstroX({
        delegationModes: ["domain", "global"],
        dev: false,
      });
  const infinityProvider = new InfinityWallet();
  const iiProvider = new CustomInternetIdentity({
    windowOpenerFeatures: window.innerWidth < 768 ? undefined : getIIFrame(),
    derivationOrigin: undefined,
  });
  // const iiProvider = new InternetIdentity();
  const nfidProvider = new NFID();
  const stoicProvider = new StoicWallet();
  const metamaskProvider = new MetamaskAuthIC();

  const globalProviderConfig = {
    appName: "Dsocial",
    dev: false,
    autoConnect: true,
    host: undefined,
    customDomain: undefined,
  };

  return create({
    providers: [
      astroXProvider as any,
      infinityProvider,
      iiProvider,
      nfidProvider,
      stoicProvider,
      metamaskProvider,
    ],
    globalProviderConfig,
  });
};

export const checkConnected = (
  last: ConnectedIdentity | undefined,
  {
    isConnected,
    principal,
    provider,
  }: {
    isConnected: boolean;
    principal: string | undefined;
    provider: IConnector | undefined;
  },
  callback: () => void, // 只要有效就执行
  handleIdentity: (identity: ConnectedIdentity) => Promise<void>, // 新的身份要处理
  err?: () => void
) => {
  const failed = () => err && err();
  if (!isConnected) return failed();
  if (!principal || !isPrincipalText(principal)) return failed();
  if (!provider) return failed();
  // console.warn('🚀 ~ file: connect.ts:74 ~ provider:', provider);
  let connectType = provider.meta.id;
  if (["astrox", "icx"].includes(connectType)) connectType = "me";
  if (
    !["ii", "plug", "me", "infinity", "nfid", "stoic"].includes(connectType)
  ) {
    console.error(`what a provider id: ${connectType}`);
    return failed();
  }
  if (last?.principal === principal && last?.connectType === connectType) {
    // 防止重复加载导致的不断更新状态,相同的登录方式就不继续了
    callback();
    return;
  }
  const next = {
    connectType: connectType as ConnectType,
    principal,
    creator: getActorCreatorByActiveProvider(provider),
  };
  // console.warn('handle identity', last, next);
  handleIdentity(next).finally(callback);
};
