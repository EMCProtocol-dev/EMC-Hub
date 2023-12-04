// 登录方式
export type ConnectType = 'ii' | 'me' | 'infinity' | 'nfid' | 'stoic' | 'metamask' | 'web3auth';

// 登录后获取的凭证
export type ActorCreator = <T>(
    idlFactory: IDL.InterfaceFactory,
    canisterId: string,
) => Promise<ActorSubclass<T>>;

export type ConnectedIdentity = {
    connectType: ConnectType;
    principal: string;
    creator: ActorCreator;
};
