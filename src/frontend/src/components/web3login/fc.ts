import { Actor, HttpAgent } from "@dfinity/agent";

export const handleIdentityAgent = (identity) => {
  return new HttpAgent({ identity, host: "https://icp0.io" });
};

export const createActor = (
  canisterId,
  idlFactory,
  agent = new HttpAgent({ host: "https://icp0.io/" })
) => {
  if (!agent) {
    agent = new HttpAgent({ host: "https://icp0.io/" });
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

// plug登录
export const handlePlugAgent = async (whitelist, type) => {
  let agent;
  try {
    if (type === "auto") {
      agent = window.ic.plug.sessionManager.sessionData.agent;
    }

    if (type === "manual") {
      if (window.ic?.plug === undefined) {
        window.open("https://plugwallet.ooo/");
        throw new Error("INSTALL_PLUG_TIP");
      }
      await window.ic.plug.requestConnect({
        whitelist,
      });
      agent = window.ic.plug.agent;
    }
  } catch (err) {
    return false;
  }
  return agent;
};
