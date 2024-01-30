<template>
	<NSpace class="page" vertical :size="[0, 24]">
		<div class="section" style="height: 280px">
			<NH2>Balance</NH2>
			<div class="credits">
				<img class="section-background" src="@/assets/balance-background.png" />
				<NSpace class="credits-content" vertical align="end" :wrap-item="false">
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
			</div>
		</div>
	</NSpace>
</template>

<script lang="ts" setup>
import { ref, defineComponent, onMounted, watch, nextTick, computed } from 'vue';
import {
	NButton,
	NH2,
	NSpace,
	NCard,
	NUpload,
	NModal,
	NAvatar,
	NForm,
	NFormItem,
	NInput,
	NGrid,
	NGridItem,
	NIcon,
	NUl,
	NLi,
	NTable,
	NSpin,
	NPagination,
	NSkeleton,
	useMessage,
} from 'naive-ui';
import moment from 'moment';
import { Http } from '@/tools/http';
const message = useMessage()
const http = Http.getInstance();

const loading = ref(false);
const list = ref<any[]>([]);
const total = ref(0);
const balance = ref(0);
const pageNo = ref(1);
const pageSize = ref(10);

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

const initList = async () => {
	const resp = await http.get({
		url: '/emchub/api/client/wallet/log_list',
		data: { page: pageNo.value, size: pageSize.value },
	});
	if (resp._result !== 0) return;

	total.value = resp.pageInfo?.total;

	const newList = resp.pageInfo?.list;
	const listType = [
		{
			value: '+',
			type: 'Manual balance adjustment',
		},
		{
			value: '-',
			type: 'Manual balance adjustment',
		},
		{
			value: '+',
			type: 'Recharge',
		},
		{
			value: '-',
			type: 'Consume',
		},
	];
	list.value = newList?.map((item: any) => ({
		how: listType[item.type].type,
		credits: listType[item.type].value + item.amount,
		createTime: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
	}));
};
console.log(list.value);

watch(
	() => pageNo.value,
	() => {
		initList();
	}
);

const onPressRefresh = () => {
	init();
	initList();
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
.credits {
  position: relative;
  width: 540px;
  height: 184px;
  border-radius: 16px;
  background: linear-gradient(270deg, #9664ff -2.02%, #c67dff 100%);
}

.section {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}
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
.credits-content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  box-sizing: border-box;
  z-index: 2;
}
.credits-button {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #fff;
  color: #fff;
  background: linear-gradient(180deg, #bc6cff 0%, #552fc0 100%), linear-gradient(0deg, #ffffff, #ffffff);
}
</style>
