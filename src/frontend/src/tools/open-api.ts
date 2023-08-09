import crypto, { Encoding } from 'crypto';

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

export function sign(params: any, secret: string) {
  const signArray: string[] = [];
  Object.entries(params).forEach(([k, v]) => {
    signArray.push(`${k}=${v}`);
  });
  signArray.push(`secret=${secret}`);
  console.info(`open-api signed array`, signArray);
  const signStr = signArray.join('&');
  return crypto.createHash('sha1').update(signStr).digest('hex');
}
