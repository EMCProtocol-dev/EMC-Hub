import ABI_EMC from '@/web3/abi/emc';
import { Api } from './api';

export class EMCApi extends Api {
  getAbi() {
    return ABI_EMC;
  }

  async getTokenAddress() {
    return super.call({ method: 'token' });
  }

  async getLockedAmount({ account }: any) {
    return super.call({ method: 'getLockedAmount', data: [account] });
  }

  async getReleasableAmount({ account }: any) {
    return super.call({ method: 'getReleasableAmount', data: [account] });
  }

  async token() {
    return super.call({ method: 'token' });
  }

  async createVestingSchedule({
    account,
    start,
    cycles,
    cycleUnit,
    amount,
  }: {
    account: string;
    start: number;
    cycles: number;
    cycleUnit: 0 | 1 | 2 | 3;
    amount: bigint;
  }) {
    return super.call({ method: 'createVestingSchedule', data: [account, start, cycles, cycleUnit, amount] });
  }
}
