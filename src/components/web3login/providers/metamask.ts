import {
  ConnectError,
  CreateActorError,
  DisconnectError,
} from "@connect2ic/core";
import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import sha3 from "js-sha3";
import { err, ok } from "neverthrow";

class MetamaskAuthIC {
  public meta = {
    features: ["wallet"],

    id: "metamask",
    name: "MetamaskAuth IC",
  };

  #config: {
    whitelist: Array<string>;
    host: string;
    dev: boolean;
    clientId: string;
    onConnectionUpdate: () => void;
  };
  #identity?: any;
  #principal?: string;

  get identity() {
    return this.#identity;
  }

  get principal() {
    return this.#principal;
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: true,
      clientId: "",
      onConnectionUpdate: () => {},
      ...userConfig,
    };
  }

  set config(config) {
    this.#config = { ...this.#config, ...config };
  }

  get config() {
    return this.#config;
  }

  async init() {
    const metamaskHex = localStorage.getItem("metamaskHex");
    if (metamaskHex) {
      const array_32 = Uint8Array.from(Buffer.from(metamaskHex, "hex"));
      const identity = Ed25519KeyIdentity.generate(array_32);

      if (identity) {
        this.#identity = identity;
        this.#principal = this.#identity?.getPrincipal().toString();
        return ok({ isConnected: true });
      } else {
        return err({ kind: ConnectError.ConnectFailed });
      }
    } else {
      return err({ isConnected: false });
    }
  }

  async isConnected() {
    const metamaskHex = localStorage.getItem("metamaskHex");
    if (metamaskHex) {
      return true;
    } else {
      return false;
    }
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ) {
    try {
      const agent = new HttpAgent({
        ...this.#config,
        identity: this.#identity,
      });
      if (this.#config.dev) {
        const res = await agent
          .fetchRootKey()
          .then(() => ok(true))
          .catch(() => err({ kind: CreateActorError.FetchRootKeyFailed }));
        if (res.isErr()) {
          return res;
        }
      }
      const actor = Actor.createActor<Service>(idlFactory, {
        agent,
        canisterId,
      });
      return ok(actor);
    } catch (e) {
      return err({ kind: CreateActorError.CreateActorFailed });
    }
  }

  // 链接
  async connect() {
    if (!(window as any).ethereum) {
      return err({ kind: ConnectError.ConnectFailed });
    }

    const loginMessage =
      "SIGN THIS MESSAGE TO LOGIN TO MORA ON THE INTERNET COMPUTER.\n\n" +
      `HASH SECRET:\n
  0x${sha3.sha3_512("Password")}`;
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    let signature;
    try {
      signature = await (window as any).ethereum.request({
        method: "personal_sign",
        params: [loginMessage, accounts[0]],
      });
    } catch (err) {
      return false;
    }

    const hashed = sha3.keccak_256(
      Uint8Array.from(Buffer.from(signature.replace("0x", ""), "hex"))
    );
    const array_32 = Uint8Array.from(Buffer.from(hashed, "hex"));
    const identity = Ed25519KeyIdentity.generate(array_32);

    if (identity) {
      this.#identity = identity;
      this.#principal = this.#identity?.getPrincipal().toString();
      return ok(true);
    } else {
      return err({ kind: ConnectError.ConnectFailed });
    }
  }

  // window.ethereum
  async disconnect() {
    try {
      // store.dispatch(metamaskHex(''));
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }
}

export { MetamaskAuthIC };
