<template>
  <!-- 外层容器可横向滚动，内部是节点布局 -->
  <div
      style="overflow: scroll;width: 85vw;height:90vh;position: relative;background: #1c3077; will-change: transform; transform: translateZ(0)">
    <!-- 后端返回的 container 数据，用于绘制布局背景框 -->
    <div v-for="item in container" :key="item.title"
         :style="{background: item.background,width: item.width+'px',height: item.height+'px',left: item.left+'px',top: item.top+'px'}"
         style="position: absolute;border-radius: 3px;text-align: center;color: #FFFFFF">
      {{ item.title }}
    </div>
    <div style="position: relative; height: 800px">
      <!-- X6 图容器，用于渲染流程图 -->
      <div ref="container" style="width: 1900px; height: 800px;overflow: scroll;">
      </div>
      <div class="dashboard-box">
        <div class="usage-section">
          <!-- 内存占用比率 -->
          <div class="usage-block">
            <div class="title">内存占用比率</div>
            <div class="item">
              <BatteryIcon :cpu-usage="20"/>
              <span>&lt;70%</span></div>
            <div class="item">
              <BatteryIcon :cpu-usage="75"/>
              <span>70%~80%</span></div>
            <div class="item">
              <BatteryIcon :cpu-usage="81"/>
              <span>&gt;80%</span></div>
          </div>

          <!-- CPU占用比率 -->
          <div class="usage-block">
            <div class="title">CPU占用比率</div>
            <div class="item">
              <MiniSystemUsage :data="[11,14,44,56,32,20,14]" :color="'#FFFFFF'"/>
              <span>&lt;70%</span>
            </div>
            <div class="item">
              <MiniSystemUsage :data="[11,14,44,56,32,20,74]" :color="'#F7910B'"/>
              <span>70%~80%</span>
            </div>
            <div class="item">
              <MiniSystemUsage :data="[11,14,44,56,32,20,81]" :color="'#FF0000'"/>
              <span>&gt;80%</span>
            </div>
          </div>
        </div>

        <div class="legend-section">
          <div class="legend-item">
            <span class="legend-line gray"></span>
            <span>非本系统可控线路</span>
          </div>
          <div class="legend-item">
            <span class="legend-line green"></span>
            <span>正常线路</span>
          </div>
          <div class="legend-item">
            <span class="legend-line red"></span>
            <span>异常线路</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Graph} from '@antv/x6'
import '@antv/x6-vue-shape'
import {register} from "@antv/x6-vue-shape";
import CustomNode from "@/components/nodes/CustomNode.vue";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import MiniSystemUsage from "@/components/nodes/CustomNode-complex/MiniSystemUsage.vue";
import BatteryIcon from "@/components/nodes/CustomNode-complex/BatteryIcon.vue";

export default {
  name: 'GraphComponent',
  components: {BatteryIcon, MiniSystemUsage},
  data() {
    return {
      graph: null,           // x6 图实例
      timer: null,           // 动画计时器
      pollTimer: null,       // 轮询定时器
      edgeOffsets: [],       // 存储边的偏移与速度
      container: [],         // 容器区域数据
      nodes: [], // 节点数据
    }
  },
  mounted() {
    // 注册 Vue 组件用于渲染自定义节点
    register({
      shape: 'custom-vue-node',
      width: 100,
      height: 40,
      component: CustomNode
    })

    // 加载数据后初始化图或刷新
    http.get(URL.dashboard, (res) => {
      this.container = res.data?.container ?? []
      this.nodes = res.data?.nodes ?? []
      if (!this.graph) {
        this.$nextTick(() => {
          // this.nodes = []
          this.initGraph()
        })
      } else {
        this.refreshGraphGracefully()
      }
    })

    this.startPolling() // 启动轮询
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.dispose()
      this.graph = null
    }
    // 清除定时器，防止内存泄漏
    this.stopAnimation()
    this.stopPolling()
  },
  methods: {
    /**
     * 初始化图表并渲染节点、边、动画等
     */
    initGraph() {
      const containerRef = this.$refs.container
      // if (!containerRef || !Array.isArray(this.nodes)) return
      const graph = new Graph({
        container: containerRef,
        grid: {size: 10, visible: false}, // 默认隐藏，但实际有 grid 信息
        // grid: {visible: false},
        connecting: {
          router: {
            name: 'manhattan',   // 路由算法，支持自动拐弯
            args: {
              startDirections: ['bottom'],
              endDirections: ['top'],
            },
          },
          connector: {name: 'rounded', args: {radius: 1}}, // 曲线连接
          anchor: 'center',             // 起终点锚定中心
          connectionPoint: 'boundary',  // 边界连接点
        },
        panning: false,
        mousewheel: {
          enabled: false,
          modifiers: ['ctrl', 'meta'],
        },
        interacting: {
          edgeLabelMovable: false,
          nodeMovable: false,
          edgeMovable: false,
        }
      })
      this.graph = graph

      /**
       * 创建带流动效果的边
       * @param source 起始节点
       * @param target 目标节点
       * @param color 颜色
       * @param flowSpeed 动画速度（越大越快）
       * @param showArrow 是否显示起点箭头
       * @param router 连接器路由配置
       * @param offset 起止锚点偏移
       * @param strokeDash 虚线样式密度
       */
      const createFlowEdge = (source, target, color, flowSpeed = 1, showArrow = false, router, offset = {}, strokeDash = 5) => {
        const edge = graph.addEdge({
          source: {
            cell: source,
            anchor: {
              name: router.args.startDirections,
              args: {
                dx: offset?.sx ?? 0,
                dy: offset?.sy ?? 0,
              },
            },
            connectionPoint: 'anchor',
          },
          target: {
            cell: target,
            anchor: {
              name: router.args.endDirections,
              args: {
                dx: offset?.tx ?? 0,
                dy: offset?.ty ?? 0,
              },
            },
            connectionPoint: 'anchor',
          },
          router,
          attrs: {
            line: {
              stroke: color || '#797979',
              strokeWidth: 2,
              sourceMarker: showArrow ? {name: 'classic', size: 10} : null,
              targetMarker: {name: 'classic', size: 10},
              strokeDasharray: strokeDash,
              strokeDashoffset: 0,
            },
          },
        })
        this.edgeOffsets.push({edge, speed: flowSpeed})
        return edge
      }
      if (this.graph) {
        this.graph.clearCells()
        this.edgeOffsets = []
      }
      // 渲染节点
      const nodesMap = {}
      this.nodes.forEach(node => {
        if (!node?.node) return
        const x = containerRef?.clientWidth * (node.x ?? 0.1) // 设置节点横坐标
        // 设置节点纵坐标
        const y = node.y != null
            ? 790 * node.y
            : (node.level != null ? node.level * 110 - 50 : 100)
        // 新增节点
        nodesMap[node.node] = graph.addNode({
          shape: 'custom-vue-node',
          x,
          y,
          width: node.width ?? 120,
          height: node.height ?? 50,
          label: node.label ?? '',
          node: node.node,
          data: node
        })
      })

      // 渲染边
      this.nodes.forEach(node => {
        if (!node?.to || !Array.isArray(node.to)) return
        node.to.forEach(targetNode => {
          const source = nodesMap[node.node]
          const target = nodesMap[targetNode?.target]
          if (source && target) {
            const route = {
              name: 'manhattan',
              args: {
                startDirections: Array.isArray(targetNode.route) ? targetNode.route[0] : 'bottom',
                endDirections: Array.isArray(targetNode.route) ? targetNode.route[1] : 'top',
              },
            }
            if (node.status === 0) {
              node.color = '#4A9D0B'
            } else if (node.status === 1) {
              node.color = '#D9001B'
            } else if (node.label === '') {
              node.color = '#4A9D0B'
            } else {
              node.color = '#797979'
            }
            createFlowEdge(
                source,
                target,
                node.color,
                node.speed,
                node.arrow,
                route,
                targetNode.offset,
                targetNode.strokeDash
            )
          }
        })
      })

      // 启动边流动动画
      // this.startAnimation()
    },
    /**
     * 增量更新图表，保持已有布局，更新内容样式
     */
    refreshGraphGracefully() {
      if (!this.graph || !Array.isArray(this.nodes)) return

      const allNodes = this.graph.getNodes()
      const allEdges = this.graph.getEdges()

      // 节点映射
      const nodesMap = {}
      allNodes.forEach(node => {
        const nodeId = node.getProp('node')
        if (nodeId) nodesMap[nodeId] = node
      })

      // const containerRef = this.$refs.container
      // const containerW = containerRef?.clientWidth || 1900
      // const containerH = containerRef?.clientHeight || 800
      // 更新节点文本和绑定数据
      this.nodes.forEach(newNode => {
        if (!newNode?.node) return
        const node = nodesMap[newNode.node]
        if (node) {
          // 根据最新 status 更新颜色
          if (node.status === 0) {
            node.color = '#4A9D0B'
          } else if (node.status === 1) {
            node.color = '#D9001B'
          } else if (node.label === '') {
            node.color = '#4A9D0B'
          } else {
            node.color = '#797979'
          }
          node.setAttrByPath('label/text', newNode.label ?? '')
          // const pos = node.getPosition()
          // const nextX = newNode.x ? newNode.x * containerW : pos.x
          // const nextY = newNode.y ? newNode.y * containerH : pos.y
          // node.position(nextX, nextY)
          node.setData(newNode)
        }
      })

      // 更新边颜色（不重绘边）
      const edgeMap = {}
      allEdges.forEach(edge => {
        const source = edge.getSourceCellId()
        const target = edge.getTargetCellId()
        if (source && target) {
          edgeMap[`${source}->${target}`] = edge
        }
      })

      this.edgeOffsets.forEach(item => {
        const {edge} = item
        const sourceId = edge.getSourceCellId()
        const sourceNode = this.nodes.find(n => n && nodesMap[n.node]?.id === sourceId)
        if (sourceNode && typeof sourceNode.color === 'string') {
          edge.setAttrByPath('line/stroke', sourceNode.color)
        }
      })
    },
    startAnimation() {
      this.stopAnimation() // 避免重复开启
      this.timer = setInterval(() => {
        for (let i = 0; i < this.edgeOffsets.length; i++) {
          const {edge, speed} = this.edgeOffsets[i]
          const prevOffset = edge.attr('line/strokeDashoffset') || 0
          edge.attr('line/strokeDashoffset', prevOffset - speed)
        }
      }, 300)
    },
    stopAnimation() {
      if (this.timer) {
        cancelAnimationFrame(this.timer)
        this.timer = null
      }
    },
    startPolling() {
      this.stopPolling() // 避免重复开启
      this.pollTimer = setInterval(() => {
        http.get(URL.dashboard, (res) => {
          this.container = res.data?.container ?? []
          this.nodes = res.data?.nodes ?? []
          this.refreshGraphGracefully()
        })
      }, 10000) // 每 10 秒刷新一次
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    }
  }
}
</script>

<style scoped>
.dashboard-box {
  position: absolute;
  bottom: 0;
  left: 5px;
  font-size: 12px;
  width: 360px;
  padding: 5px;
  border: 1px solid #797979;
  color: white;
  display: flex;
  flex-direction: column;
}

.usage-section {
  display: flex;
  justify-content: space-around;
}

.usage-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-weight: bold;
  margin-bottom: 4px;
}

.item {
  display: flex;
  align-items: center;
  margin-left: -5px;
  gap: 8px;
}

.legend-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-line {
  width: 100px;
  height: 0;
  border-top: 2px dashed;
}

.legend-line.gray {
  border-color: #797979;
}

.legend-line.green {
  border-color: #63A103;
}

.legend-line.red {
  border-color: #D9001B;
}
</style>