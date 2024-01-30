<template>
    <NSpace vertical :size="[0, 24]">
        <div class="balance-content">
            <NH2>Balance</NH2>
            <div class="credits">
                <NSpace class="credits-content" vertical align="end" :wrap-item="false">
                    <img class="section-background" src="@/assets/balance-background.png" />
                    <NSpin :rotate="loading" :size="20">
                        <template #icon>
                            <img src="@/assets/icon_refresh.png" style="width: 20px; height: 20px"
                                @click="onPressRefresh" />
                        </template>
                    </NSpin>
                    <div style="color: #fff; width: 100%; text-align: center">
                        <span style="font-size: 40px">{{ balance }}&nbsp;</span>
                        <span style="font-size: 26px">credits</span>
                    </div>
                </NSpace>
                <div class="credits-tips">
                    * Credits can be used to pay for AI applications
                    <br />
                    on the EMC HUB.
                    <br />
                    <span>1 Credit = 0.01 USD.</span>
                </div>
            </div>
        </div>

        <div class="upgrade-content">
            <div class="upgrade-header">
                <img class="header-background" src="@/assets/upgrade-background.png" />
                <img class="header-rocket" src="@/assets/img-upgrade-rocket.png" />
                <div class="header-content">
                    <span class="header-title">Upgrade your creations</span>
                    <img class="header-star" src="@/assets/img-upgrade-star.png" alt="" />
                </div>
            </div>
            <div class="upgrade-title">
                <NH2>Top-up</NH2>
                <n-spin :show="trxLoading">
                    <div class="upgrade-btn" @click="handleTransaction">Top-up record</div>
                </n-spin>
            </div>
            <NSpin :show="loading" style="min-height: 376px">
                <NSpace class="upgrade-section" :wrap-item="false">
                    <template v-for="item in list">
                        <div class="record-item">
                            <div class="hot" v-if="item.hot">
                                <img src="@/assets/icon_hot.svg" alt="" />
                                <p>MOST POPULAR</p>
                            </div>
                            <p class="name">{{ item.name }}</p>
                            <span>
                                ＄
                                <p class="price">{{ item.price }}</p>
                                <p class="original">{{ item.original }}</p>
                            </span>
                            <p class="credits">{{ item.credits }} credits</p>
                            <p class="btn" @click="onPay(item)">Pay now!</p>
                        </div>
                    </template>
                </NSpace>
            </NSpin>
            <div class="upgrade-layer">
                <p>🔒 Secure Payments</p>
                <p>Choose the subscription plan that's right for you</p>
            </div>
        </div>
        <PayPoint v-model:visible="showPay" :payInfo="payInfo" />
        <Transaction ref="transactionRef" v-model:loading="trxLoading" />
    </NSpace>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { NH2, NSpace, NSpin } from 'naive-ui';
// import moment from 'moment';
import { Http } from '@/tools/http';
import PayPoint from '@/components/pay-credits/index.vue';
import Transaction from '@/pages/user/transaction/index.vue';

const http = Http.getInstance();

const loading = ref(false);
// const list = ref<any[]>([]);
// const total = ref(0);
const balance = ref(0);
// const pageNo = ref(1);
// const pageSize = ref(10);

onMounted(() => {
    init();
    initList();
});

const init = async () => {
    loading.value = true;
    const resp = await http.get({
        url: '/emchub/api/client/wallet/info',
    });
    if (resp._result !== 0) return;
    balance.value = resp.data?.balance;
    loading.value = false;
};

// const initList = async () => {
//     const resp = await http.get({
//         url: '/emchub/api/client/wallet/log_list',
//         data: { page: pageNo.value, size: pageSize.value },
//     });
//     if (resp._result !== 0) return;

//     total.value = resp.pageInfo?.total;

//     const newList = resp.pageInfo?.list;
//     const listType = [
//         {
//             value: '+',
//             type: 'Manual balance adjustment',
//         },
//         {
//             value: '-',
//             type: 'Manual balance adjustment',
//         },
//         {
//             value: '+',
//             type: 'Recharge',
//         },
//         {
//             value: '-',
//             type: 'Consume',
//         },
//     ];
//     list.value = newList?.map((item: any) => ({
//         how: listType[item.type].type,
//         credits: listType[item.type].value + item.amount,
//         createTime: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
//     }));
// };
// console.log(list.value);

// watch(
//     () => pageNo.value,
//     () => {
//         initList();
//     }
// );

const onPressRefresh = () => {
    init();
    // initList();
};

type Item = {
    id: number;
    name: string;
    price: number;
    original: number;
    credits: number;
    hot: boolean;
};
const listLoading = ref(false);
const list = ref<Item[]>([]);
const initList = async () => {
    listLoading.value = true;
    const resp = await http.get({
        url: '/emchub/api/client/chargeConfig/queryList',
    });
    listLoading.value = false;
    const newList: any[] = [];
    (resp.data || []).forEach((item: any, index: number) => {
        newList.push({ id: item.id, name: item.name, price: item.fee, original: item.originalFee, credits: item.point, hot: index === 1 });
    });
    list.value = newList;
}
const showPay = ref(false);
const payInfo = ref();
const onPay = (item: Item) => {
    showPay.value = true;
    payInfo.value = item;
};

const transactionRef = ref<InstanceType<typeof Transaction>>();
const trxLoading = ref(false)
const handleTransaction = () => {
    transactionRef.value?.handleShow()
}
</script>

<style lang="less" scoped>
.balance-content {
    width: 100%;
    height: 100%;
    padding: 24px;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
}

.credits {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .credits-content {
        width: 540px;
        height: 184px;
        padding: 24px;
        border-radius: 16px;
        background: linear-gradient(270deg, #9664ff -2.02%, #c67dff 100%);
        box-sizing: border-box;
        position: relative;

        .section-background {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
    }

    .credits-tips {
        line-height: 24px;
        padding: 24px;
        color: #333;
        font-family: Roboto;
        font-size: 16px;

        span {
            color: #A45EFF;
        }
    }
}

.upgrade-content {
    width: 100%;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;

    .upgrade-header {
        height: 84px;
        position: relative;

        .header-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            border-radius: 20px 20px 0px 0px;
        }

        .header-rocket {
            width: 120px;
            height: 120px;
            position: absolute;
            bottom: 0px;
            left: 0px;
            z-index: 2;
        }

        .header-content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            padding-left: 142px;
            line-height: 84px;
            box-sizing: border-box;
            z-index: 2;

            .header-title {
                font-size: 28px;
                color: #fff;
            }

            .header-star {
                width: 24px;
                height: 20px;
                margin: 0 0 4px 12px;
            }
        }
    }

    .upgrade-title {
        padding: 24px 24px 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .upgrade-btn {
            line-height: 14px;
            padding: 12px;
            color: #333;
            font-size: 14px;
            border-radius: 6px;
            border: 1px solid #8921C3;
            cursor: pointer;

            &:hover {
                background-color: #F5F5F5;
                border-color: #CAC0F0;
            }
        }
    }

    .upgrade-section {
        width: 100%;
        padding: 0 24px 50px;
        background-color: #fff;
        box-sizing: border-box;

        .record-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 298px;
            width: 264px;
            background: #f5f5f5;
            border-radius: 16px;
            border: 2px solid transparent;
            transition: 0.3s;
            position: relative;
            top: 0;
            margin-top: 24px;

            &:hover {
                border: 2px solid #fe60ee;
                background: linear-gradient(270deg, #f8e8ff 0%, #ebedff 100%);
                transition: 0.3s;
                top: -26px;
            }

            .hot {
                position: absolute;
                left: -9px;
                top: -18px;
                display: flex;
                justify-content: center;
                align-items: center;

                p {
                    margin: 0;
                    color: #fff;
                    font-family: Montserrat;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 24px;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    right: 0;
                    top: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .name {
                color: #8e33d6;
                font-family: Montserrat;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px;
                margin: 0;
            }

            span {
                display: flex;
                font-family: Roboto;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: 14px;
                color: #6c2cfd;
                align-items: flex-end;
                margin-top: 32px;
            }

            .price {
                color: #6c2cfd;
                font-family: Roboto;
                font-size: 40px;
                font-style: normal;
                font-weight: 600;
                line-height: 40px;
                margin: 0;
            }

            .original {
                margin: 0 0 0 8px;
                color: #d41c1c;
                font-family: Roboto;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 14px;
                text-decoration: line-through;
            }

            .credits {
                margin: 0;
                color: #f415c3;
                font-family: Roboto;
                font-size: 20px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;
                margin-bottom: 0;
                margin-top: 28px;
            }

            .btn {
                width: 148px;
                height: 40px;
                flex-shrink: 0;
                border-radius: 30px;
                border: 1px solid #8851fd;
                background: #fff;
                font-family: Roboto;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                color: #8951fd;
                transition: 0.3s;
                margin-bottom: 0;
                margin-top: 28px;

                &:hover {
                    background: linear-gradient(90deg, #8550fc 0%, #c160fd 100%);
                    border-color: transparent;
                    color: #fff;
                    transition: 0.3s;
                }
            }

        }
    }

    .upgrade-layer {
        padding: 0 24px 24px;
        border-radius: 0px 0px 20px 20px;
        p {
            line-height: 24px;
            margin: 0;
            padding: 0;
            text-align: center;
            color: #6C7176;
            font-size: 16px;

            &:first-child {
                line-height: 28px;
                margin-bottom: 12px;
                color: #252B30;
                font-size: 18px;
                font-weight: 700;
            }
        }
    }
}
</style>
