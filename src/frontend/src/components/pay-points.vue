<template>
    <n-modal class="pay-box" v-model:show="isVisible" :mask-closable='false' :block-scroll="false" :on-close="cancel"
        :on-mask-click="cancel" :onEsc="cancel">
        <n-card style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <div class="pay-content" v-show="step === 1">
                <img class="icon-close" src="@/assets/icon_close.svg" @click="cancel" />
                <div class="pay-title">Order:</div>
                <div class="pay-price">＄{{ payInfo ? payInfo.price : 0 }}</div>
                <!-- <div class="pay-title">Switch chain</div>
                <n-select :disabled="payLoading" size="large" :to="false" class="pay-select" v-model:value="paymentMethod"
                    key="value" :options="paymentMethodList" :render-label="renderLabel" /> -->
                <div class="pay-method">
                    <div class="pay-method-item">
                        <img src="@/assets/icon_emc.svg" />
                        <p class="pay-method-title">EMC</p>
                        <p class="pay-method-price">640EMC</p>
                    </div>
                    <div class="pay-method-item">
                        <img src="@/assets/icon_usdt.svg" />
                        <p class="pay-method-title">USDT</p>
                        <p class="pay-method-price">7.99USDT</p>
                    </div>
                    <div class="pay-method-item" :class="paymentMethod === 'icp' ? 'current' : ''">
                        <img src="@/assets/icon_ic.svg" />
                        <p class="pay-method-title">ICP</p>
                        <p class="pay-method-price">640ICP</p>
                    </div>
                </div>
                <div class="pay-loading" v-if="payLoading">
                    <img src="@/assets/icon_loading.svg" alt="">
                    loading...
                </div>
                <component :is="paymentMethod" @onSuccess="onSuccess" />
            </div>
            <div class="pay-content" v-show="step === 2">
                <img class="icon-close" src="@/assets/icon_close.svg" @click="cancel" />
                <div class="pay-res">
                    <div class="icon-pay-success">
                        <img src="@/assets/icon_pay_success.svg" />
                    </div>
                    <p class="pay-title-success">Well done</p>
                    <p class="pay-tip">You've just paid ＄{{ payInfo ? payInfo.price : 0 }}</p>
                    <div @click="cancel" class="pay-success-btn">continue</div>
                    <img class="pay-res-bg" src="@/assets/icon_pay_success_bg.svg" />
                </div>
            </div>
            <div class="pay-content" v-show="step === 3">
                <img class="icon-close" src="@/assets/icon_close.svg" @click="cancel" />
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
        </n-card>
    </n-modal>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed, VNodeChild, h } from 'vue';
import { NCard, NModal, NSpace, NSelect, NIcon } from 'naive-ui';
import Icp from './web3login/icp.vue'
import Ar from './web3login/ar.vue'
import { Agent } from '@dfinity/agent';
import { InitWallet, transferICP, LoadTransaction } from "./wallet/wallet"
import { getAmount, getAmount2Bigint, get_account_id } from './wallet/utils'
import { getWalletBalance, transfer } from './canisters/cycle/apis'

type PaymentMethodListLabelType = 'Arbitrum' | 'ICP'
type PaymentMethodListValueType = 'ar' | 'icp'
type PaymentMethodListType = {
    label: PaymentMethodListLabelType,
    value: PaymentMethodListValueType,
    icon: string,
}

export default defineComponent({
    name: 'icp-pay',
    components: {
        NCard,
        NModal,
        NSpace,
        NSelect,
        NIcon,
        Icp,
        Ar
    },
    emits: ['cancel'],
    props: {
        showPay: { type: Boolean, default: false },
        payInfo: { type: Object }
    },
    setup(props, context) {
        const isVisible = ref<boolean>(props.showPay);
        // 1-登录 2-付款
        const step = ref<1 | 2 | 3>(1)
        // 支付中
        const payLoading = ref<boolean>(false);
        // 收款Account id
        const collection_accountId = '6a0d6a60de13978f691c38f3ddec3e992e5f05bdd74b866214774550d60df3a3'
        // 支付方式
        const paymentMethod = ref<PaymentMethodListValueType>('icp')
        const paymentMethodList = ref<PaymentMethodListType[]>([
            {
                label: "Arbitrum",
                value: 'ar',
                icon: require('@/assets/icon_ar.svg'),
            },
            {
                label: 'ICP',
                value: 'icp',
                icon: require('@/assets/icon_ic.svg'),
            },
        ])

        const cancel = () => {
            if (payLoading.value) {
                window.$message.error('Please wait for payment...')
                return false
            }
            context.emit('cancel');
        }

        const renderLabel = (option: PaymentMethodListType): VNodeChild => {
            return [
                h(
                    'img',
                    {
                        src: option.icon,
                        style: {
                            width: '25px',
                            height: '25px',
                            marginRight: '5px'
                        }
                    },

                ),
                option.label as string
            ]
        }

        // 登录成功
        const onSuccess = async (agent: Agent) => {
            if (agent) {
                payLoading.value = true
                // 开始支付
                console.log('agent', agent)
                const principal = (await agent.getPrincipal()).toString();
                console.log('pid', principal)
                const accountId = get_account_id(principal)
                console.log('用户account id', accountId)
                let res = await InitWallet(principal)
                let _balance = getAmount(res.balance)
                let _address = res.address
                console.log('当前钱包', _balance, _address)
                const price = props.payInfo?.price
                console.log('转账金额', price)
                const amountInMicroICP = getAmount2Bigint(price)

                let cyclesBalance = await getWalletBalance(agent, await agent.getPrincipal())
                console.log('cycles 余额', cyclesBalance)

                transferICP(collection_accountId, BigInt(amountInMicroICP), {}, agent)
                    .then((res) => {
                        console.log('区块高度', res)
                        step.value = 2

                        // 加载交易记录
                        LoadTransaction(accountId).then(res => {
                            console.log(res)
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        step.value = 3
                    }).finally(() => {
                        payLoading.value = false
                    })

            }
        }

        watch(
            () => props.showPay,
            (n) => {
                isVisible.value = n;
                step.value = 1
            },
            { deep: true }
        );

        return {
            isVisible,
            context,
            paymentMethod,
            paymentMethodList,
            step,
            payLoading,
            onSuccess,
            renderLabel,
            cancel
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

.pay-box /deep/ .n-card__content {
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
    position: absolute;
    right: 12px;
    top: 15px;
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

.pay-select /deep/ .n-base-selection-input__content {
    display: flex;
    align-items: center;
}

.pay-select /deep/ .n-base-select-option__content {
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
    background: rgba(255, 255, 255, .8);
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
    background: rgba(205, 181, 255, .1);
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
    color: #FC4844;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    margin-bottom: 0;
    margin-top: 25px;
}

.pay-title-success {
    color: #8851FD;
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
    background: linear-gradient(39deg, #8550FC 22.39%, #C160FD 80.25%);
    color: #FFF;
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
    background: linear-gradient(0deg, #FC4844 0%, #F59695 100%);
    color: #FFF;
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
    border: 1px solid #E5E4E9;
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
    border: 1px solid #6C2CFD;
}

.pay-method-item.current .pay-method-price {
    background: #6C2CFD;
    color: #FFF;
}
</style>
