<template>
    <NSpace class="page" vertical :size="[0, 24]">
        <div class="section">
            <NH2>API KEYS</NH2>
            <NDivider />
            <div class="desc-container">
                <p>Your secret APl keys are listed below. Please note that we do not display your secret APl keys againafter you generate them.</p>
                <p>Do not share your APl key with others, or expose it in the browser or other client-side code. In order to protect the security of your account, EMC Hub may also automatically disable any APl key that we've found has leaked publicly.</p>
                <p>Enable tracking to see usage per API key on the <span>Usage page</span>.</p>
            </div>
            <div class="data-container">
                <n-data-table
                    :bordered="false"
                    :columns="columns"
                    :data="data"
                    :loading="loading"
                    :pagination="pagination.itemCount > 0 ? pagination : false"
                />
            </div>
            <div class="opt-container">
                <NButton
                    color="#F5F5F5"
                    style="--n-text-color: #333; --n-text-color-hover: #333; --n-color-focus: #333; --n-text-color-focus: #333; --n-text-color-pressed: #333; --n-color-focus: #F5F5F5"
                    @click="addapi"
                >
                    <template #icon>
                        <n-icon>
                            <AddSharp />
                        </n-icon>
                    </template>
                    Create new secret key
                </NButton>
            </div>
        </div>
        <KeyCreate ref="keyCreateRef" @ok="handleSearch" />
    </NSpace>
</template>

<script lang="ts" setup>
import { reactive, ref, h, onMounted } from 'vue';
import { NButton, NDivider, NH2, NSpace, DataTableColumns, useMessage, NDataTable, NIcon } from 'naive-ui';
import { AddSharp } from '@vicons/ionicons5'
import { Http } from '@/tools/http';
import deletePng from '@/assets/apikey/delete.png'
import editPng from '@/assets/apikey/edit.png'
// import viewPng from '@/assets/apikey/view.png'
// import copyPng from '@/assets/apikey/copy.png'
// import { Utils } from '@/tools/utils'
// import iconClose from '@/assets/icon_close.svg'
import { KeyCreate, TableBtn } from './components'
import { RowType } from './type'

const http = Http.getInstance();
const message = useMessage()

const keyCreateRef = ref<InstanceType<typeof KeyCreate>>()
const addapi = () => {
    keyCreateRef.value?.handleShow()
}

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
const columns: DataTableColumns<RowType> = [
    {
        title: 'NAME',
        key: 'appName'
    },
    {
        title: 'ID',
        key: 'appId'
    },
    // {
    //     title: 'APIKEY',
    //     key: 'apiKey',
    //     render(row) {
    //         return [
    //             h(
    //                 'span',
    //                 {
    //                     style: { 'display': 'inline-block', 'minWidth': '80px' }
    //                 },
    //                 row.fullApiKey
    //                     ? row.apiKey
    //                     : row.apiKey.substring(0, 3) + '...' + row.apiKey.substring(row.apiKey.length - 3)
    //             ),
    //             // h(
    //             //     'img',
    //             //     {
    //             //         src: copyPng,
    //             //         style: { 'cursor': 'pointer' },
    //             //         onClick: () => copyKey(row.apiKey, "APIKEY")
    //             //     }
    //             // ),
    //             // h(
    //             //     keyPop,
    //             //     { name: row.apiKey }
    //             // )
    //             h(
    //                 TableBtn,
    //                 { name: row.apiKey, key: 'APIKEY' }
    //             )
    //         ]
    //     },
    //     width: 200
    // },
    {
        title: 'SECRETKEY',
        key: 'secretKey',
        render(row) {
            return [
                h(
                    'span',
                    { style: { 'display': 'inline-block', 'minWidth': '80px' } },
                    row.secretKey.substring(0, 3) + '...' + row.secretKey.substring(row.secretKey.length - 3)
                ),
                // h(
                //     'img',
                //     {
                //         src: copyPng,
                //         style: { 'cursor': 'pointer' },
                //         onClick: () => copyKey(row.secretKey, 'SECRETKEY')
                //     },
                //     { default: () => 'Play' }
                // ),
                // // h(
                // //     'img',
                // //     {
                // //         src: viewPng,
                // //         style: { 'marginLeft': '5px', 'cursor': 'pointer' },
                // //         onMouseover: () => viewFull(row, true, 2),
                // //         onMouseout: () => viewFull(row, false, 2),
                // //     },
                // //     { default: () => 'Play' }
                // // )
                // h(
                //     keyPop,
                //     { name: row.apiKey }
                // )
                h(
                    TableBtn,
                    { name: row.secretKey, key: 'SECRETKEY' }
                )
            ]
        }
    },
    // {
    //     title: 'CREATE TIME',
    //     key: 'createTime'
    // },
    {
        title: '',
        key: 'actions',
        render(row) {
            return [h(
                'img',
                {
                    src: deletePng,
                    style: { 'cursor': 'pointer' },
                    onClick: () => deleteApiKey(row)
                }
            )]
        }
    }
]
const loading = ref(false)
const data = ref<RowType[]>([])
const getTableData = async () => {
    loading.value = true
    const res = await http.get({
        url: '/emchub/api/client/userAppInfo/queryList',
        data: { pageNo: pagination.page, pageSize: pagination.pageSize }
    })
    loading.value = false
    if (res._result !== 0) return;
    data.value = res.pageInfo?.list
    pagination.itemCount = res.pageInfo?.total
    message.success('success');
}
const handleSearch = () => {
    pagination.pageSize = 10;
    pagination.page = 1;
    getTableData();
}
onMounted(() => {
    getTableData()
})

const deleteApiKey = async (rowData: RowType) => {
    loading.value = true
    const res = await http.post({
        url: '/emchub/api/client/userAppInfo/deleteOne',
        data: { appId: rowData.appId }
    })
    loading.value = false
    if (res._result !== 0) return;
    handleSearch()
}

// const viewFull = (rowData: RowType, showOrHide: boolean, type: number) => {
//     data.value = data.value.map(item => {
//         if (item.id === rowData.id) {
//             type == 1 ? item.fullApiKey = showOrHide : item.fullSecretKey = showOrHide
//         }
//         return item
//     })
// }

// const copyKey = async (key: string, title: string) => {
//     await Utils.handleCopy(key)
//     message.info(`COPY ${title} SUCCESSFUL !`)
// }
</script>

<style lang="less" scoped>
.page {
    width: 100%;
}

.section {
    width: 100%;
    height: 100%;
    padding: 24px;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;

    .desc-container {
        p {
            color: #333;
            font-size: 14px;
            line-height: 20px;

            span {
                color: #A45EFF;
                font-size: 14px;
                line-height: 20px;
                cursor: pointer;
            }
        }
    }

    .data-container {
        margin-top: 32px;
    }

    .opt-container {
        margin-top: 24px;
    }
}
</style>
