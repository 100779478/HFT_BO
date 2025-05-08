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
    <Row style="margin: -5px 5px 5px 0" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Select
              v-model="type"
              class="mr3"
              style="width: 120px"
              placeholder="监控类型"
              :clearable="true"
              @on-change="getMarketDataList"
          >
            <Option
                v-for="item in getMarketMonitorType()"
                :value="item.code"
                :key="item.code"
            >{{ item.description }}
            </Option
            >
          </Select>
        </form>
      </Col>
      <Col span="" class="mr3" style="flex-shrink: 0">
        <Button type="primary" @click="getMarketDataList" class="mr3">
          <Icon type="md-search"/>
          查询
        </Button>
        <!--        <Button type="success" @click="()=>handleExport(URL.marketProcessExport, this.pagination, '进程监控列表')"-->
        <!--                class="mr3">-->
        <!--          <Icon type="md-download"/>-->
        <!--          导出-->
        <!--        </Button>-->
      </Col>
    </Row>
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
import {getMarketMonitorType} from "@/common/common";

export default {
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "监控类型",
        key: "marketMonitorType",
        resizable: true,
        width: null,
        minWidth: 120,
        render: (h, {row}) => {
          const result = getMarketMonitorType(row.marketMonitorType);
          return h("span", result.description);
        },
      },
      {
        title: "程序名称",
        key: "appName",
        minWidth: 220,
        resizable: true,
        width: null,
      },
      {
        title: "程序部署IP地址",
        key: "localIP",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "程序端口",
        key: "output",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "监控指标",
        key: "key",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "监控值",
        key: "val",
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "更新时间",
        key: "updateTime",
        resizable: true,
        width: null,
        minWidth: 180,
      },
    ];
    return {
      columns1,
      type: ""
    };
  },
  mounted() {
    this.getMarketDataList();
  },
  methods: {
    getMarketMonitorType,
    calculateTableHeight() {
      return window.innerHeight * 0.43;
    },
    // 获取行情监控数据列表
    getMarketDataList() {
      this.loading = true;
      if (this.type === undefined) {
        this.type = ""
      }
      http.get(`${URL.marketData}?type=${this.type}`, (res) => {
        this.tableData = res.data || []
        this.loading = false
      });
    },
  },
}
;
</script>
