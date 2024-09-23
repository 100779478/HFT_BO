<template>
  <div id="chart" style="width: 100%; height: 600px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('chart');
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          show: true,
          formatter: function (params) {
            return `时间: ${params[0].name}<br/>交易量: ${params[0].value[1]}<br/>其他数据: ${params[0].value[2]}`;
          }
        },
        xAxis: {
          type: 'category',
          data: ['10:20', '10:25', '10:30', '10:35'] // X轴时间数据
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100 // 设定默认显示比例
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100 // 设定默认显示比例
          }
        ],
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              const xValue = api.value(0); // 获取X轴值
              const yValue1 = api.value(1); // 获取第一列的Y轴值
              const yValue2 = api.value(2); // 获取第二列的Y轴值
              const coord = api.coord([xValue, yValue1]); // 转换成坐标点
              // 定义线段高度
              const upperShadowHeight = 20; // 上影线高度
              const volumeHeight = 30; // 交易量线高度
              const lowerShadowHeight = 20; // 下影线高度

              // 计算总高度
              const totalHeight = upperShadowHeight + volumeHeight + lowerShadowHeight;

              return {
                type: 'group',
                children: [
                  {
                    type: 'rect', // 表格背景
                    shape: {
                      x: coord[0] - 50,
                      y: coord[1] - totalHeight / 2, // 矩形的Y轴起点
                      width: 100,
                      height: totalHeight // 背景高度等于线段总高度
                    },
                    style: {
                      fill: '#fff', // 背景颜色
                      stroke: '#7c7a7a', // 边框颜色
                      lineWidth: 2
                    }
                  },
                  {
                    type: 'line', // 上影线
                    shape: {
                      x1: coord[0],
                      y1: coord[1] - upperShadowHeight - volumeHeight / 2, // 上影线起点
                      x2: coord[0],
                      y2: coord[1] - volumeHeight / 2 // 上影线终点
                    },
                    style: {
                      stroke: '#000', // 线条颜色：黑色
                      lineWidth: 1 // 线条宽度：细线
                    }
                  },
                  {
                    type: 'line', // 交易量
                    shape: {
                      x1: coord[0],
                      y1: coord[1] - volumeHeight / 2,
                      x2: coord[0],
                      y2: coord[1] + volumeHeight / 2
                    },
                    style: {
                      stroke: '#f30202', // 线条颜色：红色
                      lineWidth: 4 // 线条宽度：粗线
                    }
                  },
                  {
                    type: 'line', // 下影线
                    shape: {
                      x1: coord[0],
                      y1: coord[1] + volumeHeight / 2, // 下影线起点
                      x2: coord[0],
                      y2: coord[1] + volumeHeight / 2 + lowerShadowHeight // 下影线终点
                    },
                    style: {
                      stroke: '#000', // 线条颜色：黑色
                      lineWidth: 1 // 线条宽度：细线
                    }
                  },
                  {
                    type: 'text', // 第一行显示列标题
                    style: {
                      text: `6    :    1`,
                      x: coord[0],
                      y: coord[1] - totalHeight / 2 - 10, // 文字的位置根据矩形调整
                      textAlign: 'center',
                      textVerticalAlign: 'top',
                      fill: '#000', // 文字颜色
                      font: '12px Arial'
                    }
                  },
                  {
                    type: 'text', // 显示第一行数据
                    style: {
                      text: `${yValue1}       ${yValue2}`,
                      x: coord[0],
                      y: coord[1] - 10,
                      textAlign: 'center',
                      textVerticalAlign: 'top',
                      fill: '#000', // 文字颜色
                      font: '12px Arial'
                    }
                  }
                ]
              };
            },
            data: [
              [0, 61, 80],  // x轴位置, 第一列数据, 第二列数据
              [1, 62, 20],
              [2, 63, 30],
              [3, 65, 50]
            ]
          }
        ]
      };

      myChart.setOption(option);

      // 使图表支持拖动和缩放
      myChart.on('dataZoom', function (params) {
        // 如果需要在数据缩放时执行一些操作，可以在这里处理
        console.log('Data zoomed:', params);
      });
    }
  }
};
</script>

<style scoped>
#chart {
  width: 100%;
  height: 600px;
}
</style>
