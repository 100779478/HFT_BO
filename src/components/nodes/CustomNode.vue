<template>
  <Badge :count="nodeData.badge" :offset="[0, nodeData.width ?? 120]" v-if="!nodeData.hidden">
    <div
        class="my-node"
        :style="{
        borderRadius: nodeData.shape === 'elliptical' ? '50%' : '3px',
        borderColor: this.borderColor,
        background: this.backgroundColor,
        width: nodeData.width !== undefined ? nodeData.width + 'px' : '120px',
        height: nodeData.height !== undefined ? nodeData.height + 'px' : '50px'
      }"
        @click="toggleDetail"
    >
      <div class="node-icons" v-if="nodeData.shape !== 'elliptical' && nodeData.monitor">
        <BatteryIcon :cpuUse="nodeData?.monitor?.memory||0"/>
        <MiniSystemUsage
            v-if="nodeData.monitor.cpu && nodeData.monitor.cpu.length"
            :data="nodeData.monitor.cpu"
            :color="getCpuIconClass()"
        />
      </div>
      <div class="node-label">{{ nodeData.label }}</div>
    </div>
    <Modal
        v-model="showDetail"
        width="1000"
        footer-hide
        @on-visible-change="handleVisibleChange"
    >
      <div class="system-monitor-popup" @click.stop>
        <div class="popup-content">
          <div>
            <h2>{{ nodeData.label }} {{ nodeData.node }}</h2>
          </div>
          <div class="charts-column">
            <SystemMonitor :title="'内存占用率'" :data="memory"/>
            <SystemMonitor :title="'CPU 占用率'" :data="cpu"/>
          </div>
          <div class="table-column">
            <div class="table-column-header">
              <div class="log-path-line" v-show="logPath">
                日志路径：{{ logPath }}
              </div>
              <div class="table-column-actions">
                <Button type="primary" size="small" @click="refresh" style="margin-right: 5px;">刷新</Button>
                <Button type="success" size="small" @click="handleRead">已读</Button>
              </div>
            </div>
            <Table
                ref="scrollTable"
                :columns="columns1"
                :data="data1"
                :loading="tableLoading"
                :tooltip-max-width="500"
                size="small"
                :border="true"
                :max-height="300"
            />
            <div class="page-info">
              <div class="page-info-content">
                第 <span>{{ pagination.pageNumber }}</span> /
                <span>{{ Math.ceil(pagination.total / pagination.pageSize) || 1 }}</span> 页，
                共 <span>{{ pagination.total }}</span> 条
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </Badge>
</template>

<script>
import MiniSystemUsage from '@/components/nodes/CustomNode-complex/MiniSystemUsage.vue';
import {http} from '@/utils/request';
import {URL} from '@/api/serverApi';
import BatteryIcon from "@/components/nodes/CustomNode-complex/BatteryIcon.vue";

export default {
  name: 'CustomNode',
  components: {
    BatteryIcon,
    MiniSystemUsage,
    SystemMonitor: () => import('@/components/nodes/CustomNode-complex/SystemMonitor.vue'),
  },
  inject: ['getNode'],
  data() {
    return {
      logPath: '',
      nodeData: {},
      showDetail: false,
      tableLoading: true,
      finished: false,
      firstOpen: true,
      pagination: {
        total: 0,
        pageSize: 100,
        pageNumber: 1
      },
      currentNumber: 1,
      cpu: [],
      memory: [],
      columns1: [
        {title: '创建时间', width: 160, key: 'createTime'},
        {
          title: '状态',
          key: 'read',
          width: 120,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.read ? 'green' : 'red'
              }
            }, params.row.read ? '已读' : '未读');
          }
        },
        {title: '日志信息', key: 'logMessage', ellipsis: true, tooltip: true},
      ],
      data1: [],
    };
  },
  computed: {
    borderColor() {
      const status = this.nodeData.status;
      const memory = this.nodeData.monitor?.memory ?? 0;
      const cpuArr = this.nodeData.monitor?.cpu ?? [];
      const cpu = cpuArr[cpuArr.length - 1] ?? 0;
      if (status === 0) return '#D9001B';
      if (status === 1 && cpu <= 50 && memory <= 50) return '#4A9D0B';
      if (status === 1 && (cpu > 50 || memory > 50)) return '#D9001B';
      return '#276ED9';
    },
    backgroundColor() {
      const status = this.nodeData.status;
      if (status === 0) return '#D9001B';
      if (status === 1) return '#4A9D0B';
      return '#276ED9';
    },
  },
  mounted() {
    const node = this.getNode();
    if (node) {
      this.nodeData = node.data || {};
      node.on('change:data', ({current}) => {
        this.nodeData = {...current};
      });
    }
    this.$nextTick(() => {
      const body = this.$refs.scrollTable?.$el?.querySelector('.ivu-table-body');
      if (body) {
        body.addEventListener('scroll', this.handleScroll);
      }
    });
  },
  beforeDestroy() {
    const body = this.$refs.scrollTable?.$el?.querySelector('.ivu-table-body');
    if (body) {
      body.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    toggleDetail() {
      // 👇 重新打开弹窗
      if (this.nodeData.status !== undefined && this.nodeData.status !== null) {
        this.showDetail = true;
      }
    },
    // 监听弹窗状态，关闭时销毁节点
    handleVisibleChange(val) {
      if (val) {
        // 👈 弹窗打开时加载
        this.firstOpen = true;
        this.tableLoading = true;
        this.getList();
        this.getErrorLogList();
      } else {
        // 👈 弹窗关闭时清空
        this.pagination = {
          total: 0,
          pageSize: 100,
          pageNumber: 1
        }
        this.data1 = [];
        this.cpu = [];
        this.memory = [];
        this.finished = false;
        this.firstOpen = true;
      }
    },
    // 虚拟滚动table，优化大数据时的卡顿问题
    handleScroll(e) {
      const el = e.target

      // 防止正在加载时重复触发 or 数据已经加载完了
      if (this.tableLoading || this.finished) return;

      if (el.scrollTop + el.clientHeight > el.scrollHeight - 500) {
        this.pagination.pageNumber++
        this.getErrorLogList()
      }
    },
    // 强制重置 scrollTop
    resetScrollTop() {
      this.$nextTick(() => {
        setTimeout(() => {
          const body = this.$refs.scrollTable?.$el?.querySelector('.ivu-table-body');
          if (body) {
            body.scrollTop = 0;
          }
        }, 100); // ⏱ 延迟执行，确保 DOM 渲染完成
      });
    },
    // 获取数据列表
    getList() {
      http.get(URL.dashboardNode + `?node=${this.nodeData?.node}`, (res) => {
        this.cpu = res.data?.cpu;
        this.memory = res.data?.memory;
        this.tableLoading = false;
      });
    },
    // 获取错误日志列表
    getErrorLogList() {
      this.tableLoading = true;
      http.post(URL.dashboardNodeLogs, {...this.pagination, node: this.nodeData?.node}, (res) => {
        const newData = res.data?.dataList || [];
        this.logPath = newData[0]?.logPath || ''
        if (this.firstOpen) {
          this.resetScrollTop()
          this.firstOpen = false;
        }
        if (this.pagination.pageNumber === 1) {
          this.data1 = newData;
        } else {
          this.data1 = [...this.data1, ...newData];
        }

        this.pagination.total = res.data?.total;

        // 判断是否加载完全部数据
        if (this.data1.length >= this.pagination.total) {
          this.finished = true;
        }

        this.tableLoading = false;
      });
    },
    getCpuIconClass() {
      const cpuArray = this.nodeData.monitor.cpu || [];
      const cpuUsage = cpuArray.length ? cpuArray[cpuArray.length - 1] : 0;
      if (cpuUsage < 30) return '#FFFFFF';
      if (cpuUsage <= 50) return '#F7910B';
      return '#FF0000';
    },
    // 已读操作
    handleRead() {
      const dashboardIds = this.data1.map(item => {
        if (!item.read) {
          return item.id
        }
      });
      http.post(URL.readErrLog, dashboardIds, (res) => {
        if (res?.code === '0') {
          this.$Message.success('操作成功');
          this.resetScrollTop();
          this.pagination.pageNumber = 1
          this.getErrorLogList()
        }
      });
    },
    refresh() {
      this.resetScrollTop();
      this.pagination.pageNumber = 1
      this.getErrorLogList()
    }
  }
};
</script>

<style scoped>
h2 {
  color: #63A103;
}

.my-node {
  transform: translateZ(0); /* 预防 scale 模糊 */
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  width: 120px;
  height: 50px;
  transition: all 0.3s ease-in-out;
  will-change: transform, box-shadow, border-color;
}

.my-node:hover {
  border-color: #409eff; /* 或任何你想要的高亮色 */
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}


.node-label {
  font-size: 14px;
  padding-bottom: 5px;
  color: #ffffff;
}

.node-icons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  width: 80%;
  gap: 4px;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
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
}

.table-column-header {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center;
  height: 30px;
}

.log-path-line {
  font-weight: bold;
  color: #333;
  flex-shrink: 0;
}

.table-column-actions {
  display: flex;
  margin-left: auto;
  gap: 5px;
}

.page-info {
  float: right;
  font-weight: 500;
  margin-top: 10px;
  color: #06a0f3;
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-info-content {
  display: flex;
  align-items: center;
  gap: 5px;
}

::v-deep .ivu-table-small td {
  height: 27px;
}
</style>
