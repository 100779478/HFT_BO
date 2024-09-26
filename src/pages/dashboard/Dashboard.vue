<template>
  <div id="chart" style="width: 90%; height: 90vh;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      multiRowData: [
        [[{value: 10, color: '#ff0000', shadow: 1}, {value: 60, shadow: 1}], [{
          value: 88,
          color: '#00ff00'
        }, {value: 76}]],
        // [[{value: 15}], [{value: 80}]],
        // [[{value: 20}, {
        //   value: 20,
        //   color: '#00ff00',
        // }, {value: 20}, {value: 20, color: '#ff0000', shadow: 1}], [{value: 70}, {
        //   value: 60,
        //   color: '#ff0000'
        // }, {value: 20}, {value: 20}]],
        // [[{value: 15}, {value: 80, color: '#00ff00'}, {
        //   value: 80,
        //   color: '#00ff00'
        // }], [{value: 80, color: '#ff0000'}, {value: 80}, {value: 80}]],
        // [[{value: 55}], [{value: 80}]],
        // [[{value: 35, color: '#00ff00'}, {value: 55}], [{value: 80}, {value: 55}]],
        // [[{value: 85, color: '#ff0000', shadow: 0}], [{value: 80}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 15}, {value: 80, color: '#00ff00'}, {
        //   value: 80,
        //   color: '#00ff00'
        // }], [{value: 80, color: '#ff0000'}, {value: 80}, {value: 80}]],
        // [[{value: 55}], [{value: 80}]],
        // [[{value: 35, color: '#00ff00'}, {value: 55}], [{value: 80}, {value: 55}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
        // [[{value: 15}, {value: 80, color: '#00ff00'}, {
        //   value: 80,
        //   color: '#00ff00'
        // }], [{value: 80, color: '#ff0000'}, {value: 80}, {value: 80}]],
        // [[{value: 55}], [{value: 80}]],
        // [[{value: 35, color: '#00ff00'}, {value: 55}], [{value: 80}, {value: 55}]],
        // [[{value: 85, color: '#ff0000'}], [{value: 80}]],
      ],
      processedData: [],
      showDetails: false,
    };
  },
  mounted() {
    this.processedData = this.multiRowData.map((row, index) => {
      const avgY1 = this.calculateAverage(row[0]); // 计算第一列的平均值
      const avgY2 = this.calculateAverage(row[1]); // 计算第二列的平均值
      return [index, avgY1, avgY2]; // 将 xValue, avgY1, avgY2 返回
    })
    this.initChart();
  },
  methods: {
    // 计算平均值函数
    calculateAverage(values) {
      const sum = values.reduce((acc, obj) => acc + obj.value, 0);
      return sum / values.length;
    },
    initChart() {

      const chartDom = document.getElementById('chart');
      const myChart = echarts.init(chartDom);

      const option = {
        xAxis: {
          type: 'category',
          data: ['10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50',] // X轴时间数据
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            type: 'custom',
            renderItem: (params, api) => {
              const xValue = params.dataIndex; // 获取X轴值
              const yValues1 = this.multiRowData[params.dataIndex][0]; // 获取第一列的Y轴值（数组）
              const yValues2 = this.multiRowData[params.dataIndex][1]; // 获取第二列的Y轴值（数组）
              // 计算 Y 轴的平均值作为展示的 Y 坐标
              const avgYValue1 = yValues1.reduce((sum, item) => sum + item.value, 0) / yValues1.length;
              const avgYValue2 = yValues2.reduce((sum, item) => sum + item.value, 0) / yValues2.length;
              const coord = api.coord([xValue, avgYValue1]); // 转换为坐标点
              const upperShadowHeight = yValues1.length * 5;
              const volumeHeight = yValues1.length * 15;
              const lowerShadowHeight = yValues1.length * 5;
              const totalHeight = yValues1.length * 25;

              // 基础的children
              const baseChildren = [
                {
                  type: 'line',
                  shape: {
                    x1: coord[0],
                    y1: coord[1] - upperShadowHeight - volumeHeight / 2,
                    x2: coord[0],
                    y2: coord[1] - volumeHeight / 2
                  },
                  style: {
                    stroke: '#c4c1c1',
                    lineWidth: 2
                  },
                  z2: 100,
                },
                {
                  type: 'line',
                  shape: {
                    x1: coord[0],
                    y1: coord[1] - volumeHeight / 2,
                    x2: coord[0],
                    y2: coord[1] + volumeHeight / 2
                  },
                  style: {
                    // stroke: '#f30202',
                    stroke: Math.random() > 0.5 ? '#49d035' : '#f30202',
                    lineWidth: 4
                  },
                  z2: 100,
                },
                {
                  type: 'line',
                  shape: {
                    x1: coord[0],
                    y1: coord[1] + volumeHeight / 2,
                    x2: coord[0],
                    y2: coord[1] + volumeHeight / 2 + lowerShadowHeight
                  },
                  style: {
                    stroke: '#c4c1c1',
                    lineWidth: 2
                  },
                  z2: 100,
                },
              ];
              let dynamicTextChildren = []
              // 动态生成文本的 children
              if (!this.showDetails) {
                baseChildren.push(
                    {
                      type: 'rect',
                      shape: {
                        x: coord[0] - 50,
                        y: coord[1] - totalHeight / 2,
                        width: 100,
                        height: totalHeight
                      },
                      style: {
                        fill: '#fff',
                        stroke: '#c4c1c1',
                        lineWidth: 2
                      }
                    },
                    {
                      type: 'text',
                      style: {
                        text: `5    :    1`,
                        x: coord[0],
                        y: coord[1] - totalHeight / 2 - 20, // 动态调整Y坐标
                        textAlign: 'center',
                        fill: '#000',
                        font: 'bold 14px Arial',
                      }
                    },
                )
                let count = 0
                dynamicTextChildren = yValues1.map((item, index) => {
                  const firstText = {
                    type: 'text',
                    style: {
                      text: `${item.value}`, // 显示 item.value
                      x: coord[0] - 20, // 根据需要调整 X 轴位置，向左偏移
                      y: coord[1] + (index * 20) - totalHeight / 3, // 动态调整 Y 坐标
                      textAlign: 'right', // 右对齐
                      fill: item.color || 'black', // 为 item.value 设置颜色
                      font: 'bold 14px Arial',
                    }
                  };

                  const secondText = {
                    type: 'text',
                    style: {
                      text: `${yValues2[index].value}`, // 显示 yValues2[index].value
                      x: coord[0] + 20, // 根据需要调整 X 轴位置，向右偏移
                      y: coord[1] + (index * 20) - totalHeight / 3, // 动态调整 Y 坐标
                      textAlign: 'left', // 左对齐
                      fill: yValues2[index].color || 'black', // 为 yValues2[index].value 设置颜色
                      font: 'bold 14px Arial',
                    }
                  };
                  // 判断是否有 shadow 属性，如果有，添加阴影块
                  const thirdRect = item.shadow !== undefined ? {
                    type: 'rect',
                    shape: {
                      x: coord[0] - 50, // 从图表左侧开始
                      y: coord[1] - totalHeight / 2, // 从顶部开始，覆盖整个图表高度
                      width: api.getWidth(), // 延伸到图表最右侧
                      height: totalHeight // 覆盖图表的高度
                    },
                    style: {
                      fill: item.shadow === 1 ? 'rgba(80,220,99,0.26)' : 'rgba(220,80,80,0.27)', // 模拟阴影效果
                    },
                    z2: 200,
                  } : null; // 如果没有 shadow 属性，不添加 thirdRect
                  return thirdRect ? [firstText, secondText, thirdRect] : [firstText, secondText];
                }).flat(); // 使用 flat() 将嵌套数组展平成一个数组
              }
              // 合并基础 children 和动态生成的 text children
              return {
                type: 'group',
                children: baseChildren.concat(dynamicTextChildren) // 合并两个children数组
              };
            },
            data: this.processedData // 使用多行数据
          }
        ]
      };

      myChart.setOption(option);
      // 监听缩放事件
      myChart.on('dataZoom', (params) => {
        const zoomRange = params.batch[0].end - params.batch[0].start;
        this.showDetails = zoomRange <= 45;
      });

      // 支持图表的自适应
      window.addEventListener('resize', () => {
        myChart.resize();
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
