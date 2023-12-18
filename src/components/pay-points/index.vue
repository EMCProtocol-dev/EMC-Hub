<template>
  <NModal :show="visible" :mask-closable="false" :block-scroll="true" :close-on-esc="false">
    <NCard :bordered="false" :title="title" style="width: 600px">
      <template #header-extra>
        <NButton strong secondary circle @click="onPressCancel">
          <template #icon>
            <NIcon><IconClose /></NIcon>
          </template>
        </NButton>
      </template>
      <div class="pay-content" v-show="step === -1">
        <NSpace align="center" justify="center" :wrap-item="false" :size="[0, 0]" style="height: 200px">
          <img src="@/assets/icon_loading.svg" style="width: 40px; height: 40px" />
        </NSpace>
      </div>
      <template v-if="step === 1">
        <NSpace vertical :wrap-item="false" :size="[0, 16]">
          <NSpace align="center" justify="center" :wrap-item="false" :size="[0, 0]">
            <NText style="font-size: 32px">＄{{ payInfo.price || 0 }}</NText>
          </NSpace>
          <NSpace align="center" justify="center" :wrap-item="false" :size="[0, 0]">
            <NText>You will pay </NText>
            <NText style="font-size: 22px; margin: 0 8px">{{ emc }}</NText>
            <img src="@/assets/icon_emc.svg" style="width: 16px; height: 16px" />
            <NText>EMC</NText>
          </NSpace>
          <NButton type="primary" strong size="large" :loading="payLoading" style="width: 100%" @click="onPressPay">Pay on metamask</NButton>
        </NSpace>
      </template>
      <div class="pay-content" v-show="step === 2">
        <div class="pay-res">
          <div class="icon-pay-success">
            <img src="@/assets/icon_pay_success.svg" />
          </div>
          <p class="pay-title-success">Well done</p>
          <p class="pay-tip">You've just paid ＄{{ payInfo ? payInfo.price : 0 }}</p>
          <div class="pay-success-btn" @click="onPressCancel">continue</div>
          <img class="pay-res-bg" src="@/assets/icon_pay_success_bg.svg" />
        </div>
      </div>
      <div class="pay-content" v-show="step === 3">
        <div class="pay-res">
          <div class="icon-pay-error">
            <img src="@/assets/icon_pay_error.svg" />
          </div>
          <p class="pay-title-error">Ooops</p>
          <p class="pay-tip">Something went wrong,let's tryone more again</p>
          <div @click="step = 1" class="pay-error-btn">TRY again</div>
          <img class="pay-res-bg" src="@/assets/icon_pay_error_bg.svg" />
        </div>
      </div>
    </NCard>
  </NModal>
</template>

<script lang="ts">
function wait(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

import { defineComponent, ref, computed, watch } from 'vue';
import { NModal, NCard, NSpace, NButton, NText, NIcon, useMessage } from 'naive-ui';
import { CloseSharp as IconClose } from '@vicons/ionicons5';
import { ethers } from 'ethers';
import { Http } from '@/tools/http';
import { useWeb3UserStore } from '@/stores/web3-user';
import { ApiManager } from '@/web3/api';
import { ConsumptionApi } from '@/web3/api/consumption';
import { ERC20Api } from '@/web3/api/erc20';
export default defineComponent({
  name: 'pay-point',
  components: {
    NModal,
    NCard,
    NSpace,
    NButton,
    NText,
    NIcon,
    IconClose,
  },
  props: {
    visible: { type: Boolean },
    payInfo: { type: Object, default: () => ({}) }, //id,price
  },
  emits: ['update:visible', 'cancel'],
  setup(props, ctx) {
    const message = useMessage();
    const web3User = useWeb3UserStore();
    const http = Http.getInstance();
    const apiManager = ApiManager.getInstance();
    const consumptionContract = '0x1111daFd889956e63912D48aAa6430f913aF7337';
    const erc20Api = apiManager.create(ERC20Api, { address: '0x20Dcf8106bdC2cCCcf84DD62dc486A7123A41d13' });
    const consumptionApi = apiManager.create(ConsumptionApi, { address: consumptionContract });
    // 0:empty 1:pay 2:complete 3:error
    const titles = ['', 'Pay', 'Complete', 'Error'];
    const step = ref<-1 | 1 | 2 | 3>(-1);
    const emc = ref(0);
    const payLoading = ref<boolean>(false);

    const init = async () => {
      step.value = -1;
      const resp = await http.get({
        url: '/emchub/api/client/wallet/queryActualPay',
        data: { money: props.payInfo.price },
      });
      emc.value = resp.data || '?';
      step.value = 1;
    };

    const cancel = () => {
      if (payLoading.value) {
        message.error('Please wait for payment...');
        return false;
      }
      ctx.emit('update:visible', false);
    };

    const handlePay = async () => {
      if (!web3User.account0) {
        const resp = await web3User.signIn({ type: 'metamask' });
        if (resp._result !== 0) {
          return { _result: 1, _desc: resp._desc || 'Unknow sign in error' };
        }
      }
      const resp = await http.post({
        url: '/emchub/api/client/wallet/charge',
        data: { payType: 1, chargeId: props.payInfo.id },
      });
      if (resp._result !== 0) {
        return { _result: 1, _desc: resp._desc || 'Unknow pre-charge error' };
      }
      const { chargeSn, actualPay: emc, amount } = resp.data || {};

      const emc256 = ethers.parseUnits(String(emc), 18);
      const resp2 = await erc20Api.approve({ amount: emc256, spender: consumptionContract });
      if (resp2._result !== 0) {
        return { _result: 1, _desc: resp2._desc || 'Unknow approve error' };
      }
      console.info('approve success');
      const remark = JSON.stringify({ sn: chargeSn, fee: emc, credit: amount });
      const resp3 = await consumptionApi.burn({ amount: emc256, remark });
      if (resp3._result !== 0) {
        return { _result: 1, _desc: resp3._desc || 'Unknow consumption error' };
      }
      return { _result: 0, _desc: 'Success', txData: resp3 };
    };

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          init();
        }
      }
    );

    return {
      step,
      title: computed(() => titles[step.value]),
      emc,
      payLoading,
      onPressCancel() {
        cancel();
      },
      async onPressPay() {
        payLoading.value = true;
        const resp = await handlePay();
        payLoading.value = false;
        if (resp._result !== 0) {
          step.value = 3;
        } else {
          step.value = 2;
        }
      },
    };
  },
});
</script>

<style scoped>
.pay-box {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.24);
  box-shadow: 0px 8px 20px 0px rgba(121, 97, 155, 0.88);
  backdrop-filter: blur(8px);
}

.pay-box:deep(.n-card__content) {
  background: #fff;
  padding: 0;
  margin: 16px;
}

.pay-content {
  padding: 36px;
  position: relative;
}

.pay-content .icon-close {
  width: 36px;
  height: 36px;
  cursor: pointer;
}

.pay-title {
  color: #333;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 16px;
}

.pay-price {
  color: #545454;
  font-family: Roboto;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 40px;
  margin-bottom: 32px;
  text-align: center;
}

.pay-select:deep(.n-base-selection-input__content) {
  display: flex;
  align-items: center;
}

.pay-select:deep(.n-base-select-option__content) {
  display: flex;
  align-items: center;
}

.close {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.pay-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  z-index: 9;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 20px;
  font-weight: 600;
}

.pay-loading img {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}

.pay-res {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 80px 0;
  position: relative;
}

.icon-pay-success {
  width: 86px;
  height: 86px;
  background: rgba(205, 181, 255, 0.1);
  border-radius: 50%;
}

.icon-pay-success img {
  width: 100%;
  height: 100%;
}

.icon-pay-error {
  width: 86px;
  height: 86px;
  background: rgba(255, 251, 251, 1);
  border-radius: 50%;
}

.pay-title-error {
  color: #fc4844;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 0;
  margin-top: 25px;
}

.pay-title-success {
  color: #8851fd;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 0;
  margin-top: 25px;
}

.pay-tip {
  color: #999;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  margin-bottom: 0;
  margin-top: 25px;
}

.pay-success-btn {
  width: 178px;
  height: 48px;
  border-radius: 30px;
  background: linear-gradient(39deg, #8550fc 22.39%, #c160fd 80.25%);
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
  cursor: pointer;
  position: relative;
  z-index: 9;
}

.pay-error-btn {
  width: 178px;
  height: 48px;
  border-radius: 30px;
  background: linear-gradient(0deg, #fc4844 0%, #f59695 100%);
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
  cursor: pointer;
  position: relative;
  z-index: 9;
}

.pay-res-bg {
  position: absolute;
  bottom: -36px;
  left: -36px;
  width: calc(100% + 72px);
}

.pay-method {
  display: flex;
  justify-content: center;
}

.pay-method-item {
  display: flex;
  flex-direction: column;
  width: 112px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #e5e4e9;
  margin-right: 35px;
  cursor: pointer;
  overflow: hidden;
  /* padding: 8px; */
}

.pay-method-item:last-child {
  margin-right: 0;
}

.pay-method-item img {
  width: 24px;
  height: 24px;
  padding-left: 8px;
  padding-top: 8px;
}

.pay-method-title {
  margin-top: 6px;
  margin-bottom: 0;
  color: #545454;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  padding-left: 8px;
}

.pay-method-price {
  padding-top: 8px;
  padding-bottom: 8px;
  color: #999;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  margin: 8px 0 0 0;
  padding-left: 8px;
}

.pay-method-item.current {
  border: 1px solid #6c2cfd;
}

.pay-method-item.current .pay-method-price {
  background: #6c2cfd;
  color: #fff;
}
</style>
