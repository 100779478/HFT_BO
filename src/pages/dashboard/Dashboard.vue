<template>
  <!-- 外层容器可横向滚动，内部是节点布局 -->
  <div style="overflow: scroll;width: 100vw;position: relative;">
    <!-- 后端返回的 container 数据，用于绘制布局背景框 -->
    <div v-for="item in container" :key="item.title"
         :style="{background: item.background,width: item.width+'px',height: item.height+'px',left: item.left+'px',top: item.top+'px'}"
         style="position: absolute;border-radius: 10px;text-align: center;border: 3px dashed #ccc;">
      {{ item.title }}
    </div>
    <!-- X6 图容器，用于渲染流程图 -->
    <div ref="container" style="width: 1900px; height: 88vh;overflow: scroll">
    </div>
  </div>
</template>

<script>
import {Graph} from '@antv/x6'
import '@antv/x6-vue-shape'
import {register} from "@antv/x6-vue-shape";
import MyNode from "@/components/nodes/MyNode.vue";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export default {
  name: 'GraphComponent',
  data() {
    return {
      graph: null,           // x6 图实例
      timer: null,           // 动画计时器
      edgeOffsets: [],       // 存储边的偏移与速度
      container: [],         // 容器区域数据
      nodes: []              // 节点数据
    }
  },
  mounted() {
    // 注册 Vue 组件用于渲染自定义节点
    register({
      shape: 'custom-vue-node',
      width: 100,
      height: 40,
      component: MyNode
    })

    // 加载数据后初始化图或刷新
    http.get(URL.dashboard, (res) => {
      this.container = res.data?.container ?? []
      this.nodes = res.data?.nodes ?? []
      if (!this.graph) {
        this.initGraph()
      } else {
        this.refreshGraphGracefully()
      }
    })

  },
  beforeDestroy() {
    // 清除定时器，防止内存泄漏
    if (this.timer) {
      clearInterval(this.timer)
    }
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
        grid: {visible: false},
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
              stroke: color || '#1890ff',
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

      // 渲染节点
      const nodesMap = {}
      this.nodes.forEach(node => {
        if (!node?.node) return
        const x = containerRef.clientWidth * (node.x ?? 0.1)
        const y = node.y != null
            ? containerRef.clientHeight * node.y
            : (node.level != null ? node.level * 110 - 50 : 100)

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
      this.timer = setInterval(() => {
        this.edgeOffsets.forEach(item => {
          const {edge, speed} = item
          let currentOffset = edge.attr('line/strokeDashoffset') || 0
          currentOffset -= speed
          edge.attr('line/strokeDashoffset', currentOffset)
        })
      }, 30)
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

      // 更新节点文本和绑定数据
      this.nodes.forEach(newNode => {
        if (!newNode?.node) return
        const node = nodesMap[newNode.node]
        if (node) {
          node.setAttrByPath('label/text', newNode.label ?? '')
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
    }
  }
}
</script>

<style scoped>
</style>
