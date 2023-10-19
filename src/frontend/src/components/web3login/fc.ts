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

// export const restoreMetamaskAgent = async (hex) => {
//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const array_32 = fromHexString(hex);
//   const identity = Ed25519KeyIdentity.generate(array_32);
//   const agent = new HttpAgent({ identity, host: "https://icp0.io" });
//   store.commit("SET_CURRENT_IDENTITY", identity);
//   //校验密码或绑定
//   const actor = createActor("3scra-gyaaa-aaaah-abqxq-cai", eth_ic_did, agent);
//   const binded = await actor.getPrincipalByEthAddress(accounts[0]);
//   if (binded.length === 0) {
//     actor.bindPrincipalWithEthAddress(accounts[0]);
//     return agent;
//   } else if (binded[0].toString() !== identity.getPrincipal().toString()) {
//     store.dispatch(`${IDENTITY}/${SET_LOADING}`, false);
//     return false;
//   } else {
//     return agent;
//   }
// };

// export const handleMetamaskAgent = async (secret) => {
//   store.dispatch(`${IDENTITY}/${SET_LOADING}`, true);
//   const message =
//     "SIGN THIS MESSAGE TO LOGIN TO MORA ON THE INTERNET COMPUTER.\n\n" +
//     `HASH SECRET:\n
//   0x${sha3.sha3_512(secret)}`;
//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   let signature;
//   try {
//     signature = await window.ethereum.request({
//       method: "personal_sign",
//       params: [message, accounts[0]],
//     });
//   } catch (err) {
//     store.dispatch(`${IDENTITY}/${SET_LOADING}`, false);
//     return false;
//   }
//   const hashed = sha3.keccak_256(
//     Uint8Array.from(Buffer.from(signature.replace("0x", ""), "hex"))
//   );
//   const array_32 = Uint8Array.from(Buffer.from(hashed, "hex"));
//   const identity = Ed25519KeyIdentity.generate(array_32);
//   store.commit("SET_CURRENT_IDENTITY", identity);
//   const loginMessageHash = ethersUtils.hashMessage(message);

//   const agent = new HttpAgent({ identity, host: "https://icp0.io" });
//   const ethLogin = await createActor(
//     CONFIG.ethLoginCanister,
//     ethLoginFactory,
//     agent
//   );
//   try {
//     const binded = await ethLogin.getPrincipalByEth(accounts[0]);
//     if (!binded.length) {
//       const res = await ethLogin.linkAddress(loginMessageHash, signature);
//       if (res) {
//         localStorage.setItem("metamaskAgent", uint8Array(array_32));
//         store.commit("SET_METAMASK_AGENT_HEX", uint8Array(array_32));
//         store.dispatch(`${IDENTITY}/${SET_LOADING}`, false);
//         return agent;
//       } else {
//         return false;
//       }
//       // 如果不空，验证密码，
//     } else if (binded[0].toString() !== identity.getPrincipal().toString()) {
//       store.dispatch(`${IDENTITY}/${SET_LOADING}`, false);
//       return false;
//     } else {
//       localStorage.setItem("metamaskAgent", uint8Array(array_32));
//       store.commit("SET_METAMASK_AGENT_HEX", uint8Array(array_32));
//       store.dispatch(`${IDENTITY}/${SET_LOADING}`, false);
//       return agent;
//     }
//   } catch {
//     store.dispatch(`${IDENTITY}/${SET_LOADING}`, false);
//     return false;
//   }
// };
