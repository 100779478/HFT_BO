<template>
  <!--  <Badge :count="nodeData.badge" :offset="[0, nodeData.width ? nodeData.width : 120]">-->
  <Badge :count="nodeData.badge" :offset="[0, nodeData.width ?? 120]" v-if="!nodeData.hidden">
    <div class="my-node"
         :style="{
           borderRadius: nodeData.shape === 'elliptical' ? '50%' : '8px',
           borderColor: nodeData.color,
           width: nodeData.width!==undefined ? nodeData.width + 'px' : '120px',
           height: nodeData.height!==undefined ? nodeData.height + 'px' : '50px'
         }">
      <div class="node-icons" v-if="nodeData.monitor">
        <!--        <Icon type="ios-battery-dead" @click="handleClick"/>-->
        <div class="battery-icon" :class="getBatteryClass()"></div>
        <div style="display: flex" :class="getMemoryIconClass()">
          <span style="font-size: 12px;margin: auto 0;font-weight: bold"> {{ nodeData.monitor.memory }} </span>
          <i class="icon iconfont icon-tuxing"/>
        </div>
      </div>
      <div class="node-label">{{ nodeData.label }}</div>
    </div>
  </Badge>
</template>

<script>
export default {
  name: 'MyNode',
  inject: ['getNode'],
  data() {
    return {
      nodeData: {}, // 初始是空的
    }
  },
  mounted() {
    const node = this.getNode()
    if (node) {
      this.nodeData = node.data || {}
      node.on('change:data', ({current}) => {
        this.nodeData = {...current} // 替换成新的数据
      })
    }
  },
  methods: {
    handleClick() {
      this.$Message.info(`我是${this.nodeData.label},节点为：${this.nodeData.node}`)
    },
    getBatteryClass() {
      const cpuUsage = this.nodeData.monitor.cpu ?? 0;
      if (cpuUsage === 0) {
        return 'battery-empty';
      } else if (cpuUsage < 70) {
        return 'battery-low';
      } else if (cpuUsage >= 70 && cpuUsage <= 80) {
        return 'battery-medium';
      } else if (cpuUsage > 80) {
        return 'battery-high';
      }
    },
    getMemoryIconClass() {
      const memoryUsage = this.nodeData.monitor.memory ?? 0;
      if (memoryUsage < 70) {
        return 'icon-blue';
      } else if (memoryUsage >= 70 && memoryUsage <= 80) {
        return 'icon-yellow';
      } else if (memoryUsage > 80) {
        return 'icon-red';
      }
      return '';
    }
  }
}
</script>

<style scoped>
.my-node {
  font-size: 16px;
  border: 2px solid rgb(91, 143, 249);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.node-icons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  width: 70%;
  margin-bottom: 4px; /* 添加一些间距 */
}

.node-label {
  font-size: 12px;
  font-weight: bold;
}

.battery-icon {
  width: 20px;
  height: 12px;
  margin: auto 0;
  border-radius: 1px;
  border: 2px solid #989696;
  position: relative;
}

.battery-empty::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0;
}

.battery-low::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #34a046;
  width: 33%;
}

.battery-medium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: orange;
  width: 66%;
}

.battery-high::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: red;
  width: 80%;
}

.icon-blue {
  font-size: 20px !important;
  color: #156F9F;
}

.icon-yellow {
  font-size: 20px;
  color: orange;
}

.icon-red {
  font-size: 20px;
  color: red;
}

</style>
