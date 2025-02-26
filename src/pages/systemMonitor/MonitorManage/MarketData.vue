<style lang="less" scoped>
@import "@/style/manage.less";

.modal__content {
  display: flex;
}

.modal__content-left {
  flex-grow: 0.8; /* 占据60%的空间 */
  /* 其他样式，如宽度、背景等 */
}

.ivu-select-dropdown {
  z-index: 1000; /* 调整为合适的层叠顺序值 */
}

.modal__content-right {
  //flex-grow: 0.4; /* 占据40%的空间，但这不是必需的，因为默认就是剩余空间 */
  /* 其他样式，如宽度、背景等 */

  .btn {
    color: white;
    font-weight: bold;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

.top {
  margin: -10px 5px 5px 5px
}

.progress-content {
  display: flex;
  align-content: center;
}

::v-deep .ivu-table td,
::v-deep .ivu-table th {
  padding-top: 5px !important; /* 调整上边距 */
  padding-bottom: 5px !important; /* 调整下边距 */
  line-height: normal; /* 确保文本的行高正常 */
  height: 12px !important;
}

//::v-deep .ivu-table-row-highlight td {
//  background-color: #cdcecf !important; /* 自定义选中行的背景色 */
//  font-weight: bolder;
//}
</style>
<template>
  <div>
    <Table
        :columns="columns1" style="clear: both"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        size="small"
        ref="table"
        :loading="loading"
        border
    >
    </Table>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {tableMixin} from "@/mixins/tableMixin";

export default {
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "监控指标类型",
        key: "type",
        minWidth: 220,
        resizable: true,
        width: null,
      },
      {
        title: "监控指标速率",
        key: "speedRate",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "connected",
        key: "connected",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "key",
        key: "key",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "listen",
        key: "listen",
        resizable: true,
        width: null,
        minWidth: 150,
      },
      {
        title: "localIp",
        key: "localIp",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "outPut",
        key: "outPut",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "target",
        key: "target",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "time",
        key: "time",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "topic",
        key: "topic",
        resizable: true,
        width: null,
        minWidth: 160,
      },
      {
        title: "type",
        key: "type",
        resizable: true,
        width: null,
        minWidth: 180,
      },
      {
        title: "val",
        key: "val",
        resizable: true,
        width: null,
        minWidth: 120,
      },
    ];
    return {
      columns1,
    };
  },
  mounted() {
    this.getMarketDataList();
  },
  methods: {
    calculateTableHeight() {
      return window.innerHeight * 0.43;
    },
    // 获取行情监控数据列表
    getMarketDataList() {
      this.loading = true;
      http.get(URL.marketData, (res) => {
        this.tableData = res.data || []
        this.loading = false
      });
    },
  },
}
;
</script>
