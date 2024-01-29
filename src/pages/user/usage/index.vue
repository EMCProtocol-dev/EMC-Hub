<template>
	<div class="usage-container">
        <div class="usage-header">
            <span>usage</span>
            <n-date-picker class="usage-time" v-model:value="timestamp" type="monthrange" clearable />
        </div>
        <div class="usage-content">
            <p class="usage-spend">Monthly Spend <span>＄0.00</span></p>
            <div class="usage-chart" id="chart"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NDatePicker } from 'naive-ui';
import { EChartsOption, init } from 'echarts'

const timestamp = ref<[number, number]>([Date.now(), Date.now()])

const initEcharts = () => {
    const chartEle: HTMLElement = document.getElementById('chart') as HTMLElement
    const chart = init(chartEle)
    const option: EChartsOption = {
        // legend: {
        //     left: 'center',
        //     top: 'top',
        //     orient: 'horizontal',
        //     textStyle: {
        //         color: '#fff',
        //         fontSize: 12
        //     }
        // },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            name: '',
            nameGap: 15,
            position: 'bottom',
            inverse: false,
            nameTextStyle: {
                color: '#ccc',
                fontSize: 12
            },
            axisLabel: {
                show: true,
                color: '#B9B8CE',
                fontSize: 12,
                rotate: 0
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: '#B9B8CE',
                    width: 1
                }
            },
            axisTick: {
                show: true,
                length: 5
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: "#DADADA",
                    width: 1,
                    type: "solid"
                }
            },
        },
        yAxis: {
            type: 'value',
            name: 'Y轴',
            nameGap: 15,
            position: 'left',
            inverse: false,
            nameTextStyle: {
                color: '#ccc',
                fontSize: 12
            },
            axisLabel: {
                show: true,
                color: '#B9B8CE',
                fontSize: 12,
                rotate: 0
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: '#B9B8CE',
                    width: 1
                }
            },
            axisTick: {
                show: true,
                length: 5
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#DADADA",
                    width: 1,
                    type: "solid"
                }
            }
        },
        grid: {
            top: '10px',
            right: '0',
            left: '0',
            bottom: '0',
            containLabel: true
        },
        series: [
            {
                name: 'name',
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'bar'
            },
            {
                name: 'value',
                data: [15, 20, 24, 18, 35, 47, 60],
                type: 'bar'
            }
        ]
    }
    option && chart.setOption(option, true)
}

onMounted(() => {
    initEcharts()
})
</script>

<style lang="less" scoped>
.usage-container {
    width: 100%;
    padding: 24px 0;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;

    .usage-header {
        width: 100%;
        padding: 0 24px 12px;
        border-bottom: 1px solid #F5F5F5;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        :deep(.usage-time) {
            width: 330px;
        }

        span {
            color: #333;
            font-size: 20px;
            line-height: 20px;
        }
    }

    .usage-content {
        width: 100%;
        padding: 24px 24px 0;

        .usage-spend {
            margin-bottom: 20px;
            color: #333;
            font-size: 18px;
            font-weight: 500;
            line-height: 18px;

            span {
                color: #666;
            }
        }

        .usage-chart {
            width: 700px;
            height: 300px;
        }
    }
}
</style>
