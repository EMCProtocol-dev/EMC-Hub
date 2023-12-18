import { Api } from './api';
import ABI from '@/web3/abi/consumption';

export class ConsumptionApi extends Api {
  _rwaToken: string | undefined;
  _fundToken: string | undefined;
  _rewardToken: string | undefined;

  getAbi() {
    return ABI;
  }

  /**
   * Burn emc token
   */
  async burn({ amount, remark }: { amount: bigint; remark: string }): Promise<Resp> {
    console.info(amount, remark);
    return await super.call({ method: 'burn', data: [amount, remark] });
  }
}
