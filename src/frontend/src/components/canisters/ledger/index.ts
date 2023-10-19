import { Actor, Agent, HttpAgent, HttpAgentOptions } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from './ledger.did';
import { LedgerService } from './ledger.int';

export const createEthLoginActor = (
    canisterId: string | Principal,
    options?: {
        agentOptions?: HttpAgentOptions;
        actorOptions?: { agent: Agent };
    },
): LedgerService => {
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        ...options?.agentOptions,
    });

    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};
