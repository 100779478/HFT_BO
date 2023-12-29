<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
}
.page-bottom {
  float: right;
  margin-top: 20px;
}
.table-content {
  border: 1px solid #e8eaec;
  .table-operate {
    font-size: 14px;
    color: rgb(2, 175, 241);
    margin-right: 6px;
    cursor: pointer;
  }
}
.ivu-tooltip {
  .ivu-tooltip-ref {
    text-overflow: "ellipsis";
    overflow: hidden;
    width: 200px;
    white-space: "nowrap";
    color: red !important;
  }
}
.mr3 {
  margin-right: 3px;
}
</style>
<template>
  <div>
    <Row style="margin: 10px" justify="space-between" align="top">
      <!-- <Col span="" class="mr3">
        <Button type="success" @click="refresh()"
          ><Icon type="md-refresh" /> 刷新</Button
        >
      </Col> -->
      <!-- <Col span="" offset="21">
        <Button type="primary" @click="refresh()"
          ><Icon type="md-search" /> 查询</Button
        >
      </Col> -->
      <Col
        span="19"
        style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <Input
          v-model="searchParams.orderSysId"
          class="mr3"
          style="float: right; width: 145px; border-radius: 20px"
          placeholder="报单编号"
        >
        </Input>
        <Input
          class="mr3"
          v-model="searchParams.tradeId"
          style="float: right; width: 145px; border-radius: 20px"
          placeholder="成交编号"
        >
        </Input>
        <Input
          v-model="searchParams.ruleId"
          class="mr3"
          style="float: right; width: 145px; border-radius: 20px"
          placeholder="策略编号"
        >
        </Input>
        <Input
          v-model="searchParams.instrumentId"
          class="mr3"
          style="float: right; width: 145px; border-radius: 20px"
          placeholder="合约编号"
        >
        </Input>
        <DatePicker
          class="mr3"
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          style="width: 225px"
          format="yyyy-MM-dd"
          v-model="dateRange"
        ></DatePicker>
        <TimePicker
          class="mr3"
          type="timerange"
          placement="bottom-end"
          placeholder="选择时间"
          style="width: 168px"
          v-model="timeRange"
        ></TimePicker>
      </Col>
      <Col span="" class="mr3" style="flex-shrink: 0">
        <Button type="info" @click="refresh()" class="mr3"
          ><Icon type="md-search" /> 查询</Button
        >
        <Button type="success" @click="handleExportOrders()" class="mr3"
          ><Icon type="md-download" /> 导出</Button
        >
      </Col>
    </Row>
    <Table
      :columns="columns1"
      :data="tableData"
      class="table-content"
      :height="tableHeight"
      ref="table"
      :loading="loading"
    >
    </Table>
    <template>
      <div class="page-bottom">
        <Page
          :total="pagination.total"
          :current="pagination.pageNumber"
          :page-size="pagination.pageSize"
          :page-size-opts="[20, 50, 100, 200]"
          show-sizer
          show-total
          @on-page-size-change="handleChangeSize"
          @on-change="handleChangePage"
        />
      </div>
    </template>
  </div>
</template>
<script>
import moment from "moment";
import { http } from "@/utils/request";
import { URL } from "@/api/serverApi";
import {
  time,
  getDirection,
  getOffsetType,
  getHedgeType,
} from "@/common/common";
export default {
  data() {
    let columns1 = [
      {
        title: "交易日",
        key: "tradingDay",
        minWidth: 110,
      },
      {
        title: "交易账号",
        key: "accountId",
        minWidth: 150,
      },
      {
        title: "用户编号",
        key: "customerId",
        width: 100,
      },
      {
        title: "资金账号",
        key: "assetNo",
        minWidth: 150,
      },
      {
        title: "组合账号",
        key: "combiNo",
        minWidth: 150,
      },
      {
        title: "成交编号",
        key: "tradeId",
        minWidth: 150,
      },
      {
        title: "订单编号",
        key: "orderSysId",
        minWidth: 150,
      },
      {
        title: "交易所代码",
        key: "exchangeId",
        minWidth: 150,
      },
      {
        title: "合约代码",
        key: "instrumentId",
        minWidth: 150,
      },
      {
        title: "买卖",
        key: "direction",
        minWidth: 150,
        render: (h, { row }) => {
          const result = getDirection(row.direction);
          const color = {
            0: "#ff0000",
            1: "#19be6b",
          };
          return h(
            "span",
            { style: { color: color[result.code], fontWeight: "bold" } },
            result.description
          );
        },
      },
      {
        title: "开平",
        key: "offsetFlag",
        minWidth: 150,
        render: (h, { row }) => {
          const result = getOffsetType(row.offsetFlag);
          return h("span", result.description);
        },
      },
      {
        title: "投机套保标志",
        key: "hedgeFlag",
        minWidth: 150,
        render: (h, { row }) => {
          const result = getHedgeType(row.hedgeFlag);
          return h("span", result.description);
        },
      },
      {
        title: "成交价格",
        key: "tradePrice",
        minWidth: 150,
      },
      {
        title: "成交量",
        key: "volumeTraded",
        minWidth: 150,
      },
      {
        title: "成交日期",
        key: "tradeDate",
        minWidth: 150,
      },
      {
        title: "成交时间",
        key: "tradeTime",
        minWidth: 150,
      },
      {
        title: "策略编号",
        key: "ruleId",
        minWidth: 150,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
    };
    let searchParams = {
      orderSysId: "",
      ruleId: "",
      tradeId: "",
      instrumentId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    };
    let dateRange = [moment().format("YYYYMMDD"), moment().format("YYYYMMDD")];
    let timeRange = [];
    return {
      loading: true,
      tableHeight: 0,
      tableData: [],
      columns1,
      pagination,
      isNew: true,
      searchParams,
      dateRange,
      timeRange,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getDealData();
  },
  methods: {
    // 获取订单列表
    getDealData() {
      this.searchParams.startDate = moment(this.dateRange[0]).isValid()
        ? moment(this.dateRange[0]).format("YYYYMMDD")
        : null;
      this.searchParams.endDate = moment(this.dateRange[1]).isValid()
        ? moment(this.dateRange[1]).format("YYYYMMDD")
        : null;
      this.searchParams.startTime = this.timeRange[0];
      this.searchParams.endTime = this.timeRange[1];
      const payload = {
        ...this.pagination,
        ...this.searchParams,
      };
      http.post(URL.deals, payload, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.tableData = res.data.dataList;
      });
    },

    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getDealData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getDealData();
    },
    // 查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getDealData();
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
      };
      this.getDealData();
    },
    // 导出列表
    handleExportOrders() {
      this.searchParams.startDate = moment(this.dateRange[0]).isValid()
        ? moment(this.dateRange[0]).format("YYYYMMDD")
        : null;
      this.searchParams.endDate = moment(this.dateRange[1]).isValid()
        ? moment(this.dateRange[1]).format("YYYYMMDD")
        : null;
      this.searchParams.startTime = this.timeRange[0];
      this.searchParams.endTime = this.timeRange[1];
      http.postBlob(
        URL.dealsExport,
        this.searchParams,
        (res) => {
          // 创建blob
          // const blob = new Blob([res.data], {
          //   type: "application/vnd.ems-excel;charset=UTF-8",
          // });
          const blob = res;
          // 创建link标签
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          // 设置链接元素的下载属性，指定文件名
          const dateObj = time.dateToLocaleObject(new Date());
          link.download = `成交单_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
          // 将链接元素添加到文档中
          document.body.appendChild(link);
          // 触发点击事件以开始下载
          link.click();
          // 移除链接元素
          document.body.removeChild(link);
        }
      );
    },
  },
};
</script>
