<template>
  <Badge :count="nodeData.badge" :offset="[0, nodeData.width ?? 120]" v-if="!nodeData.hidden">
    <div class="my-node"
         :style="{
           borderRadius: nodeData.shape === 'elliptical' ? '50%' : '8px',
           borderColor: nodeData.color,
           width: nodeData.width!==undefined ? nodeData.width + 'px' : '120px',
           height: nodeData.height!==undefined ? nodeData.height + 'px' : '50px'
         }" @click="toggleDetail">
      <div class="node-icons" v-if="nodeData.monitor">
        <div class="battery-icon" :class="getBatteryClass()"></div>
        <MiniSystemUsage v-if="nodeData.monitor.memory && nodeData.monitor.memory.length"
                         :data="nodeData.monitor.memory"
                         :color="getMemoryIconClass()"
        />
      </div>
      <div class="node-label">{{ nodeData.label }}</div>
    </div>

    <Teleport to="#navtopTab">
      <!-- 弹窗 -->
      <transition name="fade">
        <div v-if="showDetail" class="overlay">
          <div class="system-monitor-popup" @click.stop>
            <Icon type="md-close-circle" class="close-btn" @click="toggleDetail"/>
            <div class="popup-content">
              <div>
                <h2>{{ nodeData.label }} {{ nodeData.node }}</h2>
              </div>
              <div class="charts-column">
                <SystemMonitor :title="'CPU 占用率'" :data="this.cpu"/>
                <SystemMonitor :title="'内存占用率'" :data="this.memory"/>
              </div>
              <div class="table-column">
                <div class="table-column-header">
                  <Icon type="md-alert"/>
                  每5秒刷新一次
                  <Button type="primary" size="small" @click="getErrorLogList">刷新</Button>
                </div>
                <Table :columns="columns1" :data="data1" size="small" :border="true" :max-height="300"
                       style="margin-top: 30px"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </Badge>
</template>

<script>
import SystemMonitor from "@/components/nodes/SystemMonitor.vue";
import Teleport from "@/components/Teleport.vue";
import MiniSystemUsage from "@/components/nodes/MiniSystemUsage.vue";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export default {
  name: 'MyNode',
  components: {MiniSystemUsage, SystemMonitor, Teleport},
  inject: ['getNode'],
  data() {
    return {
      nodeData: {},
      showDetail: false,
      cpu: [],
      memory: [],
      columns1: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '错误日志',
          key: 'errorLog'
        },
        {
          title: '错误日志上下文',
          key: 'errorLogCtx'
        },
        {
          title: '日志路径',
          key: 'logPath'
        },
      ],
      data1: [
        {
          errorLog: 'TypeError: Cannot read property \'map\' of undefined\n' +
              '    at renderList (http://localhost:8080/js/chunk-vendors.js:455:23)\n',
          status: '未读',
          time: '2025/4/5-13:21:00',
          errorLogCtx: 'dddddddddddd',
          logPath: 'C:/test/demo'
        },
        {
          errorLog: 'TypeError: Cannot read property \'map\' of undefined\n' +
              '    at renderList (http://localhost:8080/js/chunk-vendors.js:455:23)\n',
          status: '未读',
          time: '2025/4/5-13:21:00',
          errorLogCtx: 'dddddddddddd',
          logPath: 'C:/test/demo'
        },
        {
          errorLog: 'TypeError: Cannot read property \'map\' of undefined\n' +
              '    at renderList (http://localhost:8080/js/chunk-vendors.js:455:23)\n',
          status: '未读',
          time: '2025/4/5-13:21:00',
          errorLogCtx: 'dddddddddddd',
          logPath: 'C:/test/demo'
        },
        {
          errorLog: 'TypeError: Cannot read property \'map\' of undefined\n' +
              '    at renderList (http://localhost:8080/js/chunk-vendors.js:455:23)\n',
          status: '未读',
          time: '2025/4/5-13:21:00',
          errorLogCtx: 'dddddddddddd',
          logPath: 'C:/test/demo'
        },
      ]
    };
  },
  mounted() {
    const node = this.getNode();
    if (node) {
      this.nodeData = node.data || {};
      node.on('change:data', ({current}) => {
        this.nodeData = {...current};
      });
    }
  },
  methods: {
    toggleDetail() {
      this.showDetail = !this.showDetail;
      if (this.showDetail) {
        http.get(URL.dashboard + '/node?node=hft-bo-strategy-monitor', (res) => {
          this.cpu = res.data.cpu
          this.memory = res.data.memory
          console.log(res, 111)
        })
      }
    },
    getErrorLogList() {
      console.log("获取错误日志列表")
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
      const memoryArray = this.nodeData.monitor.memory || [];
      const memoryUsage = memoryArray.length ? memoryArray[memoryArray.length - 1] : 0;

      if (memoryUsage < 70) {
        return '#156F9F';  // 蓝色
      } else if (memoryUsage >= 70 && memoryUsage <= 80) {
        return 'orange';   // 黄色
      } else if (memoryUsage > 80) {
        return 'red';      // 红色
      }
      return ''; // 默认灰色
    }
  }
};
</script>

<style scoped>
h2 {
  color: #63A103;
}

.my-node {
  font-size: 16px;
  border: 2px solid rgb(91, 143, 249);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.node-icons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  width: 70%;
  margin-bottom: 4px;
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

/* 动画扩散效果的样式 */
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInOverlay 0.3s ease-out forwards;
}

.system-monitor-popup {
  width: 1000px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(0);
  animation: popupAnimation 0.5s ease-in forwards;
}

@keyframes popupAnimation {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 关闭时的动画效果 */
@keyframes fadeOutOverlay {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.close-btn {
  position: absolute;
  z-index: 999;
  top: 0;
  right: 0;
  padding: 5px 10px;
  font-size: 26px;
  color: #ff4d4f;
  border: none;
  cursor: pointer;
}

.close-btn:hover {
  opacity: 0.8;
}

/* 使用过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0;
  transform: scale(0);
}

.popup-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  gap: 24px;
}

.charts-column {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.table-column {
  flex: 1;
  overflow: auto;
  position: relative;

  .table-column-header {
    height: 30px;
    position: absolute;
    right: 20px;
  }
}

</style>
