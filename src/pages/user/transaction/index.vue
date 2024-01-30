<template>
    <n-modal v-model:show="showModal" :on-mask-click="handleClose">
        <n-card style="width: 1107px" title="Transactions" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                <n-icon size="24" color="#CCCCCC" class="cursor-pointer" @click="handleClose">
                    <IconClose />
                </n-icon>
            </template>
            <n-data-table
                :loading="loading"
                :columns="columns"
                :data="data"
                :pagination="pagination.itemCount > 0 ? pagination : false"
                :single-line="false"
            >
                <template #empty>
                    <div class="table-empty">
                        <img src="@/assets/table-empty.png" alt="" />
                        <p>No data</p>
                    </div>
                </template>
            </n-data-table>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { NCard, NDataTable, NIcon, NModal, DataTableColumns } from 'naive-ui';
import { CloseSharp as IconClose } from '@vicons/ionicons5';
import moment from 'moment';
import { Http } from '@/tools/http';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});

const http = Http.getInstance();

const showModal = ref(false)
// const loading = ref(false)
const columns: DataTableColumns = [
    {
        key: "how",
        title: "How",
        minWidth: 150,
        align: 'center'
    },
    {
        key: "credits",
        title: "Credits",
        minWidth: 150,
        align: 'center'
    },
    {
        key: "createTime",
        title: "Time",
        minWidth: 150,
        align: 'center'
    }
]
const data = ref<any[]>([])
const pagination = reactive({
    page: 1, //受控模式下的当前页
    pageSize: 10, //受控模式下的分页大小,每一页的数据大小
    showSizePicker: true, //是否显示每页条数
    pageSizes: [10, 20, 50], //每页条数,可自定义
    showQuickJumper: true,
    pageCount: 0,
    itemCount: 0, //总条数
    prefix: () => { //分页前缀
        return 'all ' + pagination.itemCount + ' total';
    },
    onChange: (page: number) => { //切换第几页时
        pagination.page = page;
        getTableData();
    },
    onPageSizeChange: (pageSize: number) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
        getTableData();
    },
})
const emits = defineEmits(['update:loading']);
const getTableData = async () => {
    emits('update:loading', true)
    const res = await http.get({
        url: '/emchub/api/client/wallet/log_list',
        data: { page: pagination.page, size: pagination.pageSize },
    });
    if (res._result !== 0) return;

    const newList = res.pageInfo?.list;
    pagination.itemCount = res.pageInfo?.total
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
    data.value = newList?.map((item: any) => ({
        how: listType[item.type].type,
        credits: listType[item.type].value + item.amount,
        createTime: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
    }));
    // data.value = [
    //     {
    //         how: '1',
    //         credits: '1',
    //         createTime: '1'
    //     }
    // ]
    // pagination.itemCount = 1
    emits('update:loading', false)
};

const handleClose = () => {
    data.value = []
    pagination.itemCount = 0
    showModal.value = false
}

/*
 * ==============================================
 * 组件间传参相关
 * ==============================================
 */
const handleShow = async () => {
    await getTableData()
    showModal.value = true
}
defineExpose({
    handleShow
})
/* ============================================== */
</script>

<style lang="less" scoped>
.cursor-pointer {
    cursor: pointer;
}

.table-empty {
    img {
        display: block;
    }

    p {
        line-height: 14px;
        margin: 14px 0 0 0;
        padding: 0;
        color: #DFCEE1;
        text-align: center;
        font-size: 14px;
    }
}
</style>
