import { Principal } from "@dfinity/principal";
import { ceil } from "lodash";

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
