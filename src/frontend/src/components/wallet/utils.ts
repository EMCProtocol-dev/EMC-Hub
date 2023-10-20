import { Principal } from "@dfinity/principal";
import { ceil } from "lodash";
import { sha224 } from "@dfinity/principal/lib/cjs/utils/sha224";
import { getCrc32 } from "@dfinity/principal/lib/cjs/utils/getCrc";

export const string2principal = (p: string): Principal => Principal.fromText(p);

export const isPrincipalText = (text: string | undefined): boolean => {
  if (!text) return false;
  try {
    string2principal(text);
    return true;
  } catch (e) {
    return false;
  }
};

// 校验pid
export const isValidPrincipal = (text: string): boolean => {
  return Principal.fromText(text).toText() === text;
};

// 校验pid
export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/;
export const validatePrincipalId = (text: string): boolean => {
  try {
    return Boolean(PRINCIPAL_REGEX.test(text) && isValidPrincipal(text));
  } catch (e) {
    return false;
  }
};

// 校验账户id
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
export const validateAccountId = (text): boolean => {
  return text.length === 64 && ALPHANUM_REGEX.test(text);
};

// 获取金额
export const getAmount = (num: number, interception: number = 4) => {
  return ceil(Number(num / 10 ** 8), interception);
};

// 获取icp bigint
export const getAmount2Bigint = (num: number) => {
  return Math.trunc(num * 10 ** 8);
};

// 获取 account id
export const to32bits = (num: number) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const get_sub_account_array = (index) => {
  return new Uint8Array(Array(28).fill(0).concat(to32bits(index)));
};
export const addCrc32 = (buf) => {
  const crc32Buf = Buffer.alloc(4);
  crc32Buf.writeUInt32BE(getCrc32(buf), 0);
  return Buffer.concat([crc32Buf, buf]);
};
export const get_account_id = (principal: string, id: number = 0): string => {
  const subaccount = Buffer.from(get_sub_account_array(id));
  const acc_buf = Buffer.from("\x0Aaccount-id");
  const pri_buf = Buffer.from(Principal.fromText(principal).toUint8Array());

  const buff = Buffer.concat([acc_buf, pri_buf, subaccount]);

  const sha = sha224(buff);
  const aId = Buffer.from(sha);

  return addCrc32(aId).toString("hex");
};
