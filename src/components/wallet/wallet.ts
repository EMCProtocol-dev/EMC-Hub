import { Actor, Agent, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { getCrc32 } from '@dfinity/principal/lib/cjs/utils/getCrc';
import { sha224 } from '@dfinity/principal/lib/cjs/utils/sha224';
import _ from 'lodash';
import { isPrincipalText } from './utils';
import { validateAccountId, validatePrincipalId } from './utils';
// 交易 罐
import { idlFactory as ledgerFactory } from '../canisters/ledger/ledger.did';
import { NotifyCanisterArgs, SendArgs } from '../canisters/ledger/ledger.int';
import RosettaApi from './rosetta';

const ledgerCanister = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

export const createActor = (
  canisterId: string,
  idlFactory: any,
  agent: Agent = new HttpAgent({ host: 'https://boundary.ic0.app/' })
) => {
  if (!agent) {
    agent = new HttpAgent({ host: 'https://boundary.ic0.app/' });
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

// 获取钱包余额 转账记录 - 中心化服务
const rosettaApi = new RosettaApi();
export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/;
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
let _balance: number = 0.0;

export const to32bits = (num: number) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const get_sub_account_array = (index: number) => {
  return new Uint8Array(Array(28).fill(0).concat(to32bits(index)));
};

export const fromHexString = (hexString: string | null): Uint8Array | null => {
  if (hexString === null) {
    return null;
  }

  const bytes = hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [];
  return new Uint8Array(bytes);
};

export const addCrc32 = (buf: Buffer) => {
  const crc32Buf = Buffer.alloc(4);
  crc32Buf.writeUInt32BE(getCrc32(buf), 0);
  return Buffer.concat([crc32Buf, buf]);
};

export const get_account_id = (principal: string, id: number = 0): string => {
  const subaccount = Buffer.from(get_sub_account_array(id));
  const acc_buf = Buffer.from('\x0Aaccount-id');
  const pri_buf = Buffer.from(Principal.fromText(principal).toUint8Array());

  const buff = Buffer.concat([acc_buf, pri_buf, subaccount]);

  const sha = sha224(buff);
  const aId = Buffer.from(sha);

  return addCrc32(aId).toString('hex');
};

export const toHexString = (bytes: number[]): string => {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
};

export type WalletType = { address: string; balance: number };

// 初始化钱包
export const InitWallet = async (principal: string): Promise<WalletType> => {
  return await LoadBalance(principal);
};

// 创建钱包实例
export const LoadBalance = async (principal: string): Promise<WalletType> => {
  const address = get_account_id(principal);
  const balance = await rosettaApi.getAccountBalance(address);
  _balance = Number(balance);

  return {
    address: address,
    balance: _balance ? _balance : 0,
  };
};

// 加载交易记录
export const LoadTransaction = async (address: string) => {
  if (!address) {
    return;
  }
  let paramet;
  if (isPrincipalText(address)) {
    paramet = get_account_id(address);
  } else {
    paramet = address;
  }
  try {
    const transactions: any = await rosettaApi.getTransactionsByAccount(paramet);

    if (transactions instanceof Array) {
      transactions.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
      return transactions;
    } else {
      console.log('transactions error', transactions);
      return [];
    }
  } catch (err) {
    Promise.reject(err);
  }
};

// 通过pid获取地址
export const GetAddress = (pid: string): string => {
  if (!pid) {
    return '';
  }
  return get_account_id(pid);
};

export interface SendOpts {
  fee?: bigint;
  memo?: bigint;
  from_subaccount?: number;
}

export const GetBalance = (): number => {
  return _balance;
};

// 转账
export const transferICP = async (
  addr: string,
  amount: bigint,
  opts: SendOpts,
  agent: Agent
): Promise<bigint | false> => {
  const defaultArgs = {
    fee: BigInt(10_000),
    memo: BigInt(0),
  };
  const ledgerActor = await createActor(ledgerCanister, ledgerFactory, agent);
  if (ledgerActor == null) {
    throw new Error('ledgerActor is null');
  }
  if (!validatePrincipalId(addr)) {
    if (!validateAccountId(addr)) {
      throw new Error('Invalid principal id or address id');
    }
  } else {
    addr = get_account_id(addr);
  }
  const args: SendArgs = {
    to: addr,
    amount: { e8s: amount },
    fee: { e8s: opts?.fee || defaultArgs.fee },
    memo: opts?.memo ? opts.memo : defaultArgs.memo,
    from_subaccount: [],
    created_at_time: [],
  };

  const height: any = await ledgerActor.send_dfx(args);
  try {
    const res = BigInt(height);
    return res;
  } catch (err) {
    return false;
  }
};

// 获取地址钱包余额
export const getBalance = async (address: string, agent: Agent): Promise<number> => {
  const ledgerActor = await createActor(ledgerCanister, ledgerFactory, agent);
  const _balance: any = await ledgerActor.account_balance({
    account: fromHexString(address),
  });
  const num = Number(_balance.e8s);
  return num;
};
