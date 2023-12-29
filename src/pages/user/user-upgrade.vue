<template>
  <NSpace class="page" vertical :size="[0, 24]">
    <div class="header">
      <img class="header-background" src="@/assets/upgrade-background.png" />
      <img class="header-rocket" src="@/assets/img-upgrade-rocket.png" />
      <div class="header-content">
        <span class="header-title">Upgrade your creations</span>
        <img class="header-star" src="@/assets/img-upgrade-star.png" alt="" />
      </div>
    </div>
    <NSpace class="section" vertical :wrap-item="false">
      <NH2>Your posts</NH2>
      <NSpace style="width: 100%" :wrap-item="false" justify="end">
        <div class="record-button">
          <div class="record-button-mask">Upgrade record</div>
        </div>
      </NSpace>
      <NSpace>
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

      <div class="footer">
        <strong>🔒 Secure Payments</strong>
        <p>Choose the subscription plan that's right for you</p>
      </div>
    </NSpace>
  </NSpace>

  <PayPoint v-model:visible="showPay" :payInfo="payInfo" />
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import {
  NButton,
  NH2,
  NSpace,
  NCard,
  NUpload,
  NAvatar,
  NText,
  NForm,
  NFormItem,
  NInput,
  NGrid,
  NGridItem,
  NIcon,
  NUl,
  NLi,
  UploadCustomRequestOptions,
  useMessage,
  NModal,
} from 'naive-ui';
import PayPoint from '@/components/pay-credits/index.vue';
import { Http } from '@/tools/http';

type Item = {
  id: number;
  name: string;
  price: number;
  original: number;
  credits: number;
  hot: boolean;
};

export default defineComponent({
  name: 'user-upgrade',
  components: {
    NButton,
    NH2,
    NSpace,
    NCard,
    NModal,
    NGrid,
    NText,
    NGridItem,
    NAvatar,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NIcon,
    NUl,
    NLi,
    PayPoint,
  },
  setup(props, context) {
    const list = ref<Item[]>([]);
    const http = Http.getInstance();
    const showPay = ref(false);
    const payInfo = ref();

    const onPay = (item: Item) => {
      showPay.value = true;
      payInfo.value = item;
    };

    const closePay = () => {
      showPay.value = false;
      payInfo.value = undefined;
    };

    onMounted(async () => {
      const resp = await http.get({
        url: '/emchub/api/client/chargeConfig/queryList',
      });
      list.value = [];
      (resp.data || []).forEach((item: any, index: number) => {
        list.value.push({ id: item.id, name: item.name, price: item.fee, original: item.originalFee, credits: item.point, hot: index === 1 });
      });
    });

    return {
      list,
      showPay,
      payInfo,
      onPay,
      closePay,
    };
  },
});
</script>
<style scoped>
.page {
  width: 100%;
}

.header {
  width: 100%;
  height: 120px;
  position: relative;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.header-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding-left: 196px;
  line-height: 120px;
  box-sizing: border-box;
  z-index: 2;
}

.header-title {
  font-size: 28px;
  color: #fff;
}

.header-star {
  width: 24px;
  height: 20px;
  margin: 0 0 4px 12px;
}

.header-rocket {
  position: absolute;
  top: -58px;
  left: 0px;
  width: 196px;
  height: 196px;
  z-index: 2;
}

.section {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}

.record-button {
  background: linear-gradient(91.87deg, #8921c4 -0.05%, #5653f1 98.54%);
  width: 120px;
  height: 38px;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 1px;
}

.record-button-mask {
  width: 100%;
  height: 100%;
  line-height: 36px;
  background-color: #fff;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

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
  margin-top: 70px;
}

.record-item:hover {
  border: 2px solid #fe60ee;
  background: linear-gradient(270deg, #f8e8ff 0%, #ebedff 100%);
  transition: 0.3s;
  top: -26px;
}

.record-item .hot {
  position: absolute;
  left: -9px;
  top: -18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.record-item .hot p {
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

.record-item .name {
  color: #8e33d6;
  font-family: Montserrat;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  margin: 0;
}

.record-item span {
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

.record-item .price {
  color: #6c2cfd;
  font-family: Roboto;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 40px;
  margin: 0;
}

.record-item .original {
  margin: 0 0 0 8px;
  color: #d41c1c;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  text-decoration: line-through;
}

.record-item .credits {
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

.record-item .btn {
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
}

.record-item .btn:hover {
  background: linear-gradient(90deg, #8550fc 0%, #c160fd 100%);
  border-color: transparent;
  color: #fff;
  transition: 0.3s;
}

.footer {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 58px;
  margin-bottom: 60px;
}

.footer strong {
  color: #252b30;
  text-align: center;
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
}

.footer p {
  margin: 0;
  color: #6c7176;
  text-align: center;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
</style>
