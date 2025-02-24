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

::v-deep .ivu-table td,
::v-deep .ivu-table th {
  padding-top: 5px !important; /* 调整上边距 */
  padding-bottom: 5px !important; /* 调整下边距 */
  line-height: normal; /* 确保文本的行高正常 */
  height: 12px !important;
}

.top {
  margin: -10px 5px 5px 5px
}
</style>
<template>
  <div>
    <Row style="margin: -5px 5px 5px 0px" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Input
              v-model="pagination.serviceName"
              style="width: 120px; border-radius: 20px"
              class="mr3"
              placeholder="进程名称"
              @on-change="handleSearch"
          />
          <DatePicker
              split-panels
              class="mr3"
              type="date"
              placement="bottom-end"
              placeholder="选择起始日期"
              style="width: 125px"
              format="yyyy-MM-dd"
              v-model="dateRange.startDate"
              :transfer="true"
              autocomplete="false"
          ></DatePicker>
          <DatePicker
              split-panels
              class="mr3"
              type="date"
              placement="bottom-end"
              placeholder="选择结束日期"
              style="width: 125px"
              format="yyyy-MM-dd"
              v-model="dateRange.endDate"
              :transfer="true"
              autocomplete="false"
          ></DatePicker>
        </form>
      </Col>
      <Col span="" class="mr3" style="flex-shrink: 0">
        <Button type="primary" @click="handleSearch" class="mr3">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="success" @click="()=>handleExport(URL.marketProcessExport, this.pagination, '进程监控列表')"
                class="mr3">
          <Icon type="md-download"/>
          导出
        </Button>
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
        @on-sort-change="e=>handleSort(e,this.getMarketProcessList)"
    />
    <template>
      <div class="page-bottom">
        <Page
            :total="pagination.total"
            :current="pagination.pageNumber"
            :page-size="pagination.pageSize"
            :page-size-opts="[20, 50, 100, 200]"
            show-sizer
            show-total
            @on-page-size-change="e=>handleChangePage('pageSize', e, getMarketProcessList)"
            @on-change="e=>handleChangePage('pageNumber',e,getMarketProcessList)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {tableMixin} from "@/mixins/tableMixin";
import {handleExport, handleSort} from "@/common/common";
import moment from "moment";

export default {
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "主键ID",
        key: "id",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "环境ID",
        key: "envId",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "创建时间",
        key: "createTime",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "进程名",
        key: "serviceName",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "进程ID",
        key: "pid",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "程序启动状态",
        key: "serviceStatus",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 130,
        render: (h, params) => {
          if (params.row.serviceStatus === 1) {
            return h('div', '停止')
          } else if (params.row.serviceStatus === 0) {
            return h('div', '运行')
          } else
            return h('div', '')
        }
      },
      {
        title: "程序启动时间",
        key: "startTime",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 130,
      },
      {
        title: "程序CPU资源消耗百分比",
        key: "cpuUse",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 190,
      },
      {
        title: "程序版本",
        key: "serviceVersion",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "程序CPU资源消耗百分比",
        key: "cpuUse",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 190,
      },
      {
        title: "程序md5码",
        key: "serviceMd5",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "启用的端口号",
        key: "listenPort",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 130,
      },
      {
        title: "端口说明",
        key: "portDescribe",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "告警状态",
        key: "alerterStatus",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
        render: (h, params) => {
          if (params.row.alerterStatus === 1) {
            return h('div', '忽略')
          } else if (params.row.alerterStatus === 0) {
            return h('div', '已告警')
          } else
            return h('div', '')
        }
      },
    ];
    let pagination = {
      serviceName: "",
      startDate: "",
      endDate: "",
    };
    let dateRange = {startDate: moment().format("YYYYMMDD"), endDate: moment().format("YYYYMMDD")};
    return {
      columns1,
      dateRange,
      pagination,
      loading: false,
    };
  },
  mounted() {
    this.getMarketProcessList()
  },
  methods: {
    handleExport,
    handleSort,
    calculateTableHeight() {
      return window.innerHeight * 0.43;
    },
    // 获取策略实例列表
    getMarketProcessList() {
      this.loading = true;
      this.pagination.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.pagination.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
          : null;
      http.post(URL.marketProcess, this.pagination, res => {
        this.loading = false
        this.tableData = res.data.dataList
        this.pagination.total = res.data.total
      });
    },
    // 策略实例模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getMarketProcessList();
    }
  }
}
;
</script>
