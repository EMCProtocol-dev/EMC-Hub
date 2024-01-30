<template>
    <NSpace class="page" vertical :size="[0, 24]">
        <div class="section">
            <NH2>API KEYS</NH2>
            <NDivider />
            <div class="desc-container">
                <p>Your secret APl keys are listed below. Please note that we do not display your secret APl keys againafter
                    you
                    generate them.</p>
                <p>Do not share your APl key with others, or expose it in the browser or other client-side code. In order to
                    protect
                    the security of your account, EMC Hub may also automatically disable any APl key that we've
                    found has leaked publicly.</p>
                <p>
                    Enable tracking to see usage per API key on the <span>Usage page</span>.</p>
            </div>
            <div class="data-container">
                <n-data-table :bordered="false" :columns="columns" :data="data" />
            </div>
            <div class="opt-container">
                <NButton
                    color="#F5F5F5"
                    style="--n-text-color: #333; --n-text-color-hover: #333; --n-color-focus: #333; --n-text-color-focus: #333; --n-text-color-pressed: #333; --n-color-focus: #F5F5F5"
                    @click="addapi"
                >
                    Create new secret key
                    <template #icon>
                        <n-icon>
                            <AddSharp />
                        </n-icon>
                    </template>
                </NButton>
            </div>
        </div>
        <!-- <add :active="active"></add> -->
        <KeyCreate ref="keyCreateRef" />
    </NSpace>
</template>

<script lang="ts" setup>
// import { CashOutline as CashIcon, EyeOutline } from '@vicons/ionicons5'
import { ref, h } from 'vue';
import deletePng from '@/assets/apikey/delete.png'
import editPng from '@/assets/apikey/edit.png'
// import viewPng from '@/assets/apikey/view.png'
// import copyPng from '@/assets/apikey/copy.png'
// import { Utils } from '@/tools/utils'
import { AddSharp } from '@vicons/ionicons5'
import add from './add.vue'
// import iconClose from '@/assets/icon_close.svg'
// import keyPop from './keyPop.vue'
// import tableBtn from './components/table-btn.vue'
import { KeyCreate, TableBtn } from './components'

import {
    NButton,
    NDivider,
    NH2,
    NSpace,
    DataTableColumns,
    useMessage,
    NDataTable,
    NIcon,
    NPopover
} from 'naive-ui';

const message = useMessage()
let active = ref(false)
type RowType = {
    name: string
    id: number
    apiKey: string
    secretKey: string
    createTime: string,
    fullApiKey: boolean,
    fullSecretKey: boolean
}

// <KeyCreate ref="keyCreateRef" />
const keyCreateRef = ref<InstanceType<typeof KeyCreate>>()
const addapi = () => {
    // active.value = true
    keyCreateRef.value?.handleShow()
}
const data = ref<RowType[]>([{
    name: 'test1',
    id: 1,
    apiKey: "wewewfewfwfef-fwefwef",
    fullApiKey: false,
    secretKey: "fewfwef0898fewfw",
    fullSecretKey: false,
    createTime: "Feb 11, 2023"
}, {
    name: 'test2',
    id: 2,
    apiKey: "fwftrh-213123",
    fullApiKey: false,
    secretKey: "cdrjgirehfuhi",
    fullSecretKey: false,
    createTime: "Feb 12, 2023"
}])

const columns: DataTableColumns<RowType> =
    [
        {
            title: 'NAME',
            key: 'name'
        },
        {
            title: 'ID',
            key: 'id'
        },
        {
            title: 'APIKEY',
            key: 'apiKey',
            render(row) {
                return [
                    h(
                        'span',
                        {
                            style: { 'display': 'inline-block', 'minWidth': '80px' }
                        },
                        row.fullApiKey
                            ? row.apiKey
                            : row.apiKey.substring(0, 3) + '...' + row.apiKey.substring(row.apiKey.length - 3)
                    ),
                    // h(
                    //     'img',
                    //     {
                    //         src: copyPng,
                    //         style: { 'cursor': 'pointer' },
                    //         onClick: () => copyKey(row.apiKey, "APIKEY")
                    //     }
                    // ),
                    // h(
                    //     keyPop,
                    //     { name: row.apiKey }
                    // )
                    h(
                        TableBtn,
                        { name: row.apiKey, key: 'APIKEY' }
                    )
                ]
            },
            width: 200
        },
        {
            title: 'SECRETKEY',
            key: 'secretKey',
            render(row) {
                return [
                    h(
                        'span',
                        { style: { 'display': 'inline-block', 'minWidth': '80px' } },
                        row.fullSecretKey
                            ? row.secretKey
                            : row.secretKey.substring(0, 3) + '...' + row.secretKey.substring(row.secretKey.length - 3)
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
        {
            title: 'CREATE TIME',
            key: 'createTime'
        },
        {
            title: 'Action',
            key: 'actions',
            render(row) {
                return [h(
                    'img',
                    {
                        src: editPng,
                        onClick: () => editApiKey(row)
                    }
                ), h(
                    'img',
                    {
                        src: deletePng,
                        style: { 'marginLeft': '20px', 'cursor': 'pointer' },
                        onClick: () => deleteApiKey(row)
                    }
                )]
            }
        }
    ]

const deleteApiKey = (rowData: RowType) => {

}

const editApiKey = (rowData: RowType) => {

}

const viewFull = (rowData: RowType, showOrHide: boolean, type: number) => {
    data.value = data.value.map(item => {
        if (item.id === rowData.id) {
            type == 1 ? item.fullApiKey = showOrHide : item.fullSecretKey = showOrHide
        }
        return item
    })
}

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
