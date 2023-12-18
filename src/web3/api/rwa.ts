import { Api } from './api';
import ABI_RWA from '@/web3/abi/rwa';

export class RWAApi extends Api {
  _rwaToken: string | undefined;
  _fundToken: string | undefined;
  _rewardToken: string | undefined;

  getAbi() {
    return ABI_RWA;
  }

  /**
   * Query RWA Token address
   */
  async rwaToken(): Promise<Resp> {
    if (!this._rwaToken) {
      const { data } = await super.call({ method: 'rwaToken' });
      this._rwaToken = data;
    }
    return { _result: 0, data: this._rwaToken };
  }

  /**
   * Query payment/earnings Token address
   */
  async fundToken(): Promise<Resp> {
    if (!this._fundToken) {
      const { data } = await super.call({ method: 'fundToken' });
      this._fundToken = data;
    }
    return { _result: 0, data: this._fundToken };
  }

  /**
   * Query reward Token address
   */
  async rewardToken(): Promise<Resp> {
    if (!this._rewardToken) {
      const { data } = await super.call({ method: 'rewardToken' });
      this._rewardToken = data;
    }
    return { _result: 0, data: this._rewardToken };
  }

  /**
   * Add profit (Manager method)
   * @param param0 { amount: bigint; remark: string }
   */
  addReward({ amount, remark }: { amount: bigint; remark: string }) {
    return super.call({ method: 'addReward', data: [amount, remark] });
  }

  /**
   * Withdraw RWA Token (Stakeholder method)
   * @param param0 { amount: bigint }
   */
  withdraw({ amount }: { amount: bigint }) {
    return super.call({ method: 'withdraw', data: [amount] });
  }

  /**
   * Deposit RWA Token (Stakeholder method)
   * @param param0 { amount: bigint }
   */
  deposit({ amount }: { amount: bigint }) {
    return super.call({ method: 'deposit', data: [amount] });
  }

  /**
   * Query address fund balance (manager)
   * @param param0 { address: string }
   */
  fundAccount({ address }: { address: string }) {
    return super.call({ method: 'fundAccount', data: [address] });
  }
  
  claimFund({ amount }: { amount: bigint }) {
    return super.call({ method: 'claimFund', data: [amount] });
  }
  /**
   * Claim reward (Stakeholder method)
   * @param param0 { amount: bigint }
   */
  claimReward({ amount }: { amount: bigint }) {
    return super.call({ method: 'claimReward', data: [amount] });
  }

  /**
   * Balance of holder
   * @param param0 { address: string }
   */
  balanceOf({ account }: { account: string }) {
    return super.call({ method: 'balanceOf', data: [account] });
  }

  /**
   * Profit balance of holder
   * @param param0 { address: string }
   */
  balanceOfProfit({ account }: { account: string }) {
    return super.call({ method: 'balanceOfProfit', data: [account] });
  }

  /**
   * Reward balance of holder
   * @param param0 { address: string }
   */
  balanceOfReward({ account }: { account: string }) {
    return super.call({ method: 'balanceOfReward', data: [account] });
  }

  claimedProfit({ account }: { account: string }) {
    return super.call({ method: 'claimedProfit', data: [account] });
  }

  claimedReward({ account }: { account: string }) {
    return super.call({ method: 'claimedReward', data: [account] });
  }
  /**
   * Claim USDT
   * @param param0 { amount: bigint }
   */
  claim({ amount }: { amount: bigint }) {
    return super.call({ method: 'claim', data: [amount] });
  }

  /**
   * Query profit record
   */
  profitInfoList() {
    return super.call({ method: 'profitInfoList' });
  }

  /**
   * Query total for profit of USDT
   */
  accumulatedProfit() {
    return super.call({ method: 'accumulatedProfit' });
  }

  /**
   * Query profit total in pool
   */
  profitInPool() {
    return super.call({ method: 'profitInPool' });
  }

  /**
   * Query the current quantity of RWA in the contract's collateral pool
   */
  rwaTokenInPool() {
    return super.call({ method: 'rwaTokenInPool' });
  }

  /**
   * Query target Token price
   */
  rwaTokenPrice() {
    return super.call({ method: 'rwaTokenPrice' });
  }
  /**
   * Buy tokens
   */
  buyTokens({ numberOfTokens }: { numberOfTokens: bigint }) {
    return super.call({ method: 'buyTokens', data: [numberOfTokens] });
  }

  manager() {
    return super.call({ method: 'manager' });
  }

  tokensOnSale() {
    return super.call({ method: 'tokensOnSale' });
  }

  /**
   * Total sold
   * @returns
   */
  rwaTokensSold() {
    return super.call({ method: 'rwaTokensSold' });
  }

  /**
   * Total mint
   * @returns
   */
  rwaTokenTotalSupply() {
    return super.call({ method: 'rwaTokenTotalSupply' });
  }

  /**
   * Total present reward
   * @returns
   */
  accumulatedReward() {
    return super.call({ method: 'accumulatedReward' });
  }
}
