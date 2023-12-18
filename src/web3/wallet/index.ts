import { Metamask } from './metamask';

export function getWallet(type?: string): typeof Metamask | null {
  switch (type) {
    case 'metamask':
      return Metamask;
    default:
      return null;
  }
}
