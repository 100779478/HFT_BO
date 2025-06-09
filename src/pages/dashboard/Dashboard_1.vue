<template>
  <div style="overflow: scroll;width: 100vw;position: relative;">
    <div v-for="item in container" :key="item.title"
         :style="{background: item.background,width: item.width+'px',height: item.height+'px',left: item.left+'px',top: item.top+'px'}"
         style="position: absolute;border-radius: 10px;text-align: center;border: 3px dashed #ccc;">
      {{ item.title }}
    </div>
    <div ref="container" style="width: 1900px; height: 88vh;overflow: scroll">
    </div>
  </div>
</template>

<script>
import {Graph} from '@antv/x6'
import '@antv/x6-vue-shape'
import {register} from "@antv/x6-vue-shape";
import CustomNode from "@/components/nodes/CustomNode.vue";

export default {
  name: 'GraphComponent',
  data() {
    return {
      graph: null,
      timer: null,
      edgeOffsets: [], // 存每条线的 offset
      container: [
        {
          width: 150,
          height: 120,
          left: 70,
          top: 20,
          title: '国债期货',
          background: 'rgba(80,135,255,0.25)'
        },
        {
          width: 460,
          height: 120,
          left: 370,
          top: 20,
          title: '交易所',
          background: 'rgba(255,127,80,0.25)'
        },
        {
          width: 750,
          height: 120,
          left: 850,
          top: 20,
          title: 'CFETS',
          background: 'rgba(202,29,95,0.25)'
        },
      ],
      nodes: [
        // 第一层
        {
          label: '中金所',
          node: 'femas',
          to: [{target: 'pegasusCounter', strokeDash: 0}],
          level: 1,
          x: 0.0445,
          speed: 0,
          monitor: false
          // arrow: true,
          // background: 'rgb(253,37,37)'
        },
        {
          label: '上交所固收平台',
          node: 'fixSh',
          to: [{target: 'zjOms', strokeDash: 0, offset: {sx: -20}}, {target: 'termFixMdReader'}],
          level: 1,
          x: 0.22,
        },
        {
          label: '上交所新债平台',
          node: 'debtSh',
          to: [{target: 'zjOms', strokeDash: 0, offset: {sx: -20}}, {target: 'termMdReader'}],
          level: 1,
          x: 0.29,
        },
        {
          label: '深交所平台',
          node: 'exchangeSe',
          to: [{target: 'zjOms', strokeDash: 0, offset: {sx: -20}}, {target: 'termSZSEmd'}],
          level: 1,
          x: 0.36,
        },
        {
          label: '报价',
          node: 'economic',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.46,
        },
        {
          label: 'CMDM',
          node: 'cmdm',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.54,
        },
        {
          label: '双边',
          node: 'bond',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.62,
        },
        {
          label: 'XBOND',
          node: 'xbond',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.7,
        },
        {
          label: 'XSWAP',
          node: 'xswap',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.78,
        },

        // 第二层
        {
          label: '飞马柜台',
          node: 'pegasusCounter',
          to: [
            {target: 'termTrade', strokeDash: 0, offset: {sx: -65}},
            {target: 'termFemas', offset: {sx: 67}},
          ],
          level: 2,
          x: 0.01,
          width: 250,
        },
        {
          label: '中金OMS',
          node: 'zjOms',
          to: [{target: 'termOMS', strokeDash: 0}],
          level: 2,
          x: 0.15,
          arrow: true,
        },
        {
          label: '恒泰',
          node: 'gateWay',
          to: [{target: 'termCMDM', route: ['left', 'top']}, {
            target: 'termXQUANT',
            offset: {sx: 20, tx: 20}
          }, {target: 'termXQUANT', offset: {sx: -20, tx: -20}}],
          level: 2,
          x: 0.62,
          badge: 0
        },
        {
          label: 'RDI信息',
          node: 'rdi',
          to: [{target: 'tinit'}],
          level: 2,
          x: 0.71,
          shape: 'elliptical',
        },
        {
          label: '中金北斗',
          node: 'zjbd',
          to: [{target: 'tinit'}],
          level: 2,
          x: 0.8,
          monitor: false,
          // speed: 0,
          shape: 'elliptical',
        },

        // 第三层
        {
          label: '期货交易',
          node: 'termTrade',
          to: [{target: 'ignore', strokeDash: 0}],
          level: 3,
          x: 0.01,
          monitor: {
            cpu: 20,
            memory: 10,
          },
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '期货行情',
          node: 'termFemas',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.08,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '交易所交易',
          node: 'termOMS',
          to: [{target: 'ignore', strokeDash: 0}],
          level: 3,
          speed: 1,
          x: 0.15,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '上交所固收行情',
          node: 'termFixMdReader',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.22,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '上交所新债行情',
          node: 'termMdReader',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.29, badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '深交所行情',
          node: 'termSZSEmd',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.36,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: 'CMDM行情',
          node: 'termCMDM',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.5,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '恒泰行情及交易',
          node: 'termXQUANT',
          color: '#0fcc0f',
          // arrow: true,
          to: [{target: 'ignore', offset: {sx: 20}}, {
            target: 'gateWay',
            route: ['top', 'bottom'],
            offset: {sx: -20, tx: -20},
            strokeDash: 0
          }],
          level: 3,
          x: 0.62,
          badge: Math.ceil(Math.random() * 10)
        },

        // 隐藏点
        {
          label: '',
          node: 'ignore',
          to: [{
            target: 'TKernel',
            offset: {sx: 19, tx: 2}
          }, {
            target: 'TKernel',
            strokeDash: 0,
            offset: {tx: -22}
          }, {target: 'termXQUANT', route: ['right', 'bottom'], strokeDash: 0, offset: {tx: -20}}],
          level: 3,
          x: 0.38,
          y: 0.5,
          width: 0,
          height: 0,
          hidden: true
        },

        // 第四层
        {
          label: '初始化',
          node: 'tinit',
          to: [{target: 'TKernel', route: ['left', 'top'], offset: {tx: 20}}],
          color: 'red',
          level: 4,
          x: 0.59,
          y: 0.6,
          badge: Math.ceil(Math.random() * 10)
        },

        // 第五层
        {
          label: 'MYSQL',
          node: 'mysql',
          to: [{target: 'tinit', route: ['top', 'right']}, {target: 'bo', route: ['right', 'left']}],
          arrow: true,
          level: 5,
          shape: 'elliptical',
          x: 0.68,
        },
        {label: 'BO', node: 'bo', to: [], level: 5, x: 0.78},

        // 第六层
        {
          label: '风控',
          node: 'risk',
          to: [{target: 'TKernel', route: ['right', 'left']}],
          arrow: true,
          level: 6,
          x: 0.24
        },
        {
          label: '交易核心',
          node: 'TKernel',
          x: 0.36,
          to: [{target: 'client'}, {
            target: 'm2db',
            route: ['right', 'left']
          }],
          level: 6,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '数据持久化',
          node: 'm2db',
          to: [{target: 'mysql', route: ['right', 'bottom']}],
          x: 0.59,
          level: 6,
          badge: Math.ceil(Math.random() * 10)
        },

        // 第七层
        {label: '客户端', node: 'client', x: 0.36, to: [], level: 7, badge: Math.ceil(Math.random() * 10)},
      ]
    }
  },
  mounted() {
    //  注册 Vue 组件给 X6
    register({
      shape: 'custom-vue-node',  // 自定义节点名
      width: 100,
      height: 40,
      component: CustomNode
    })
    this.initGraph()  // 确保 DOM 渲染完成后再初始化图表

    // setInterval(() => {
    //   this.nodes.forEach(node => {
    //     // node.speed = Math.random()
    //     if (node.level === 3) {
    //       node.badge = Math.ceil(Math.random() * 10)
    //       console.log(node.level)
    //     }
    //     this.refreshGraphGracefully()
    //   })
    // }, 1000)
  }
  ,
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
  ,
  methods: {
    initGraph() {
      const graph = new Graph({
        container: this.$refs.container,
        grid: {
          visible: false, // 隐藏网格线
        },
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              startDirections: ['bottom'],
              endDirections: ['top'],
            },

          },
          connector: {name: 'rounded', args: {radius: 1}},
          anchor: 'center',
          connectionPoint: 'boundary',
        },
        panning: false,  // 禁止平移
        mousewheel: false,  // 禁止鼠标滚轮缩放
        interacting: {
          edgeLabelMovable: false,
          nodeMovable: false,
          edgeMovable: false,
          mousewheel: false, // 禁用鼠标滚轮缩放
        }
      })
      this.graph = graph
      /**
       * 创建节点的连线
       * @param source 起始节点
       * @param target 目标节点
       * @param color 颜色
       * @param flowSpeed 线的流速
       * @param showArrow 是否展示双向箭头
       * @param router 连接点的位置
       * @param offset 连接点的偏移量
       * @param strokeDash 线的密度，实 or 虚
       * @returns {edge}
       */
      const createFlowEdge = (source, target, color, flowSpeed = 1, showArrow = false, router, offset = {
        x: 0,
        y: 0
      }, strokeDash = 5) => {
        const edge = graph.addEdge({
          source: {
            cell: source,
            anchor: {
              name: router.args.startDirections,
              args: {
                dx: offset.sx,
                dy: offset.sy,
              },
            },
            connectionPoint: 'anchor',
          },
          target: {
            cell: target,
            anchor: {
              name: router.args.endDirections,
              args: {
                dx: offset.tx,
                dy: offset.ty,
              },
            },
            connectionPoint: 'anchor',
          },
          router: router, // 连接点位置
          attrs: {
            line: {
              stroke: color || '#1890ff',
              strokeWidth: 2,
              sourceMarker: showArrow ? {name: 'classic', size: 10} : null, // 是否展示起始点箭头
              targetMarker: {name: 'classic', size: 10},  // 终点箭头
              strokeDasharray: strokeDash,  // 连接线的虚实密度
              strokeDashoffset: 0,
            },
          },
        })
        this.edgeOffsets.push({
          edge,
          speed: flowSpeed,
        })
        return edge
      }
      // 创建现有的节点
      const nodesMap = {}
      this.nodes.forEach(node => {
        const name = node.node
        const x = this.$refs.container.clientWidth * (node.x || 0.1)
        const y = node.y ? this.$refs.container.clientHeight * node.y : (node.level * 110 - 50)
        nodesMap[name] = graph.addNode({
          shape: 'custom-vue-node', // 注册vue节点
          x,
          y,
          width: node.width ?? 120,
          height: node.height ?? 50,
          label: node.label,
          node: name,
          data: node
        })
      })

      // 创建边
      this.nodes.forEach(node => {
        node.to.forEach(targetNode => {
          if (nodesMap[node.node] && nodesMap[targetNode.target]) {
            const route = {
              name: 'manhattan',
              args: {
                startDirections: targetNode.route ? targetNode.route[0] : 'bottom',
                endDirections: targetNode.route ? targetNode.route[1] : 'top',
              },
            }
            createFlowEdge(nodesMap[node.node], nodesMap[targetNode.target], node.color, node.speed, node.arrow, route, targetNode.offset, targetNode.strokeDash)
          }
        })
      })

      // 动态流动效果
      this.timer = setInterval(() => {
        this.edgeOffsets.forEach(item => {
          const {edge, speed} = item
          let currentOffset = edge.attr('line/strokeDashoffset') || 0
          currentOffset -= speed
          edge.attr('line/strokeDashoffset', currentOffset)
        })
      }, 30)
    }
    ,
    refreshGraphGracefully() {
      if (!this.graph) return

      const allNodes = this.graph.getNodes()
      const allEdges = this.graph.getEdges()

      const nodesMap = {}
      allNodes.forEach(node => {
        const nodeId = node.getProp('node')  // 你initGraph时加进去的 node 属性
        nodesMap[nodeId] = node
      })

      // 1. 更新节点（只改文字、颜色，不改位置、大小）
      this.nodes.forEach(newNode => {
        const node = nodesMap[newNode.node]
        if (node) {
          // 更新 label
          node.setAttrByPath('label/text', newNode.label)

          // 更新 data
          node.setData(newNode)  // 这里很关键！同步 badge 变化

          // // 更新颜色
          // if (newNode.color) {
          //   node.setAttrByPath('body/stroke', newNode.status ? 'green' : 'red')
          // }
        }
      })

      // 2. 更新边（只改线的颜色、流速，不重新连线）
      const edgeMap = {}  // 用来快速找到边
      allEdges.forEach(edge => {
        const source = edge.getSourceCellId()
        const target = edge.getTargetCellId()
        edgeMap[`${source}->${target}`] = edge
      })

      this.edgeOffsets.forEach(item => {
        const {edge} = item
        const sourceId = edge.getSourceCellId()
        const targetId = edge.getTargetCellId()

        // 找到新的 source node
        const sourceNode = Object.values(this.nodes).find(n => nodesMap[n.node]?.id === sourceId)
        if (sourceNode) {
          const newColor = sourceNode.color || '#1890ff'
          edge.setAttrByPath('line/stroke', newColor)
          // item.speed = sourceNode.speed || 1
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
