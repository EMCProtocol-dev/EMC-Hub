import { Actor, Agent, HttpAgent, HttpAgentOptions } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "./cycle.did";
import { _SERVICE } from "./cycle.did.d";

export const createCyclesActor = (
  canisterId: string | Principal,
  options?: {
    agentOptions?: HttpAgentOptions;
    actorOptions?: { agent: Agent };
  }
): _SERVICE => {
  const agent = new HttpAgent({
    host: "https://boundary.ic0.app/", // 默认调用线上的接口
    ...options?.agentOptions,
  });

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};
