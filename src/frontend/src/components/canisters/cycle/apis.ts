import { Agent, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createCyclesActor } from "./index";
import { TxReceipt } from "./cycle.did.d";

const canister = "aanaa-xaaaa-aaaah-aaeiq-cai";

const getActorByAgent = (agent: Agent) => {
  return createCyclesActor(canister, {
    actorOptions: { agent },
  });
};

// 获取cycles余额
export const getWalletBalance = async (
  agent: Agent,
  value: Principal
): Promise<bigint> => {
  const actor = getActorByAgent(agent);
  const r: bigint = await actor.balanceOf(value);
  return r;
};

// 转账
export const transfer = async (
  agent: Agent,
  pid: Principal,
  amount: bigint
): Promise<TxReceipt> => {
  const actor = getActorByAgent(agent);
  const r: TxReceipt = await actor.transfer(pid, amount);
  return r;
};
