function getCrypto() {
  try {
    return window.crypto;
  } catch {
    return undefined;
  }
}
/**
 * Sign Open Api Parameters
 *
 * Example:
 * params:
 * {   appid: 'cat_shark',
 *     action: 'walletCreate',
 *     nonce: '1226202735',
 *     requestBody:'{"phone":"13900001111","wallet_type":0}',
 * }
 * Out:
 * 376e0de35aade4117fc00c69a2c5b25421a8e083
 *
 * @param params
 * @param secret
 * @returns
 */

export async function sign(params: any, secret: string) {
  const signArray: string[] = [];
  Object.entries(params).forEach(([k, v]) => {
    signArray.push(`${k}=${v}`);
  });
  signArray.push(`secret=${secret}`);
  const signStr = signArray.join('&');
  const crypto = getCrypto();
  if (!crypto) {
    return '';
  }
  // import crypto, { Encoding } from 'crypto';
  // return crypto.createHash('sha1').update(signStr).digest('hex');
  const bytes = await crypto.subtle.digest('SHA-1', Buffer.from(signStr, 'utf-8'));
  const arrayHash = Array.from(new Uint8Array(bytes));
  const hexHash = arrayHash.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}
