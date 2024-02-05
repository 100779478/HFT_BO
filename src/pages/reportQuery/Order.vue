<style lang="less" scoped>
@import url("@/style/manage.less");
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
        <form autocomplete="off">
          <Input
              class="mr3"
              v-model="searchParams.orderInnerId"
              style="float: right; width: 145px; border-radius: 20px"
              placeholder="报单内部编号"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.orderSysId"
              class="mr3"
              style="float: right; width: 145px; border-radius: 20px"
              placeholder="报单编号"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.ruleId"
              class="mr3"
              style="float: right; width: 145px; border-radius: 20px"
              placeholder="策略编号"
              type="text"
              @on-keyup="()=>this.searchParams.ruleId=this.searchParams.ruleId.replace(/[^\d]/g,'')"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.instrumentId"
              class="mr3"
              style="float: right; width: 145px; border-radius: 20px"
              placeholder="合约代码"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.customerId"
              class="mr3"
              style="float: right; width: 145px; border-radius: 20px"
              placeholder="用户编号"
          >
          </Input>
        </form>
        <Select
            v-model="searchParams.orderStatus"
            class="mr3"
            style="width: 200px"
            placeholder="报单状态"
            :clearable="true"
            :max-tag-count="1"
            multiple
        >
          <Option
              v-for="item in this.$store.state.dictionaryList.OrderStatus"
              :value="item.code"
              :key="item.code"
          >{{ item.description }}
          </Option
          >
        </Select>
        <form autocomplete="off">
          <DatePicker
              class="mr3"
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 225px"
              format="yyyy-MM-dd"
              v-model="dateRange"
              :transfer="true"
              autocomplete="false"
          ></DatePicker>
          <TimePicker
              class="mr3"
              type="timerange"
              placement="bottom-end"
              placeholder="选择时间"
              style="width: 168px"
              v-model="timeRange"
              :transfer="true"
          ></TimePicker>
        </form>
      </Col>
      <Col span="" class="mr3" style="flex-shrink: 0">
        <Button type="info" @click="refresh()" class="mr3"
        >
          <Icon type="md-search"/>
          查询
        </Button
        >
        <Button type="success" @click="handleExportOrders()" class="mr3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
      </Col>
    </Row>
    <Table
        :columns="columns1"
        size="small"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        :loading="loading"
        border
        @on-sort-change="handleSort"
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
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {
  time,
  getOrderStatus,
  getDirection,
  getOffsetType,
} from "@/common/common";

export default {
  data() {
    let columns1 = [
      {
        title: "交易日",
        key: "tradingDay",
        minWidth: 120,
        resizable: true,
        width: null,
        sortable: 'custom'
      },
      {
        title: "交易账号",
        key: "accountId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "用户编号",
        key: "customerId",
        minWidth: 100,
        resizable: true,
        width: null,
      },
      {
        title: "资金账号",
        key: "assetNo",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "组合账号",
        key: "combiNo",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "报单内部编号",
        key: "orderInnerId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "报单编号",
        key: "orderSysId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "交易所代码",
        key: "exchangeId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "合约代码",
        key: "instrumentId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "买卖",
        key: "direction",
        minWidth: 100,
        resizable: true,
        width: null,
        render: (h, {row}) => {
          const result = getDirection(row.direction);
          const color = {
            0: "#ff0000",
            1: "#19be6b",
          };
          return h(
              "span",
              {style: {color: color[result.code], fontWeight: "bold"}},
              result.description
          );
        },
      },
      {
        title: "开平",
        key: "offsetFlag",
        minWidth: 100,
        resizable: true,
        width: null,
        render: (h, {row}) => {
          const result = getOffsetType(row.offsetFlag);
          return h("span", result.description);
        },
      },
      {
        title: "报单状态",
        key: "orderStatus",
        minWidth: 150,
        resizable: true,
        width: null,
        render: (h, {row}) => {
          const result = getOrderStatus(row.orderStatus);
          return h("span", result.description);
        },
      },
      {
        title: "报单价格",
        key: "price",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "报单量",
        key: "volumeTraded",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "未成交量",
        key: "volumeTotal",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "成交量",
        key: "volumeTraded",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "详细状态",
        key: "statusMsg",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "报单日期",
        key: "tradeDate",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "报单时间",
        key: "tradeTime",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "策略编号",
        key: "ruleId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "撤单时间",
        key: "cancelTime",
        minWidth: 150,
        resizable: true,
        width: null,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
    };
    let searchParams = {
      orderStatus: [],
      orderInnerId: "",
      orderSysId: "",
      ruleId: "",
      instrumentId: "",
      customerId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    };
    let dateRange = [moment().format("YYYYMMDD"), moment().format("YYYYMMDD")];
    let timeRange = [];
    return {
      loading: true,
      tableHeight: window.innerHeight - 220,
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
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getOrderData();
  },
  unMounted() {
    window.removeEventListener('resize', () => {
    })
  },
  methods: {
    // 获取订单列表
    getOrderData() {
      this.searchParams.startDate = moment(this.dateRange[0]).isValid()
          ? moment(this.dateRange[0]).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange[1]).isValid()
          ? moment(this.dateRange[1]).format("YYYYMMDD")
          : null;
      this.searchParams.startTime = this.timeRange[0];
      this.searchParams.endTime = this.timeRange[1];
      // 校验策略编号必须为数字类型
      if (this.searchParams.ruleId) {
        this.searchParams.ruleId = Number(this.searchParams.ruleId)
      }
      const payload = {
        ...this.pagination,
        ...this.searchParams,
      };
      http.post(URL.orders, payload, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList;
      });
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getOrderData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getOrderData();
    },
    // 查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getOrderData();
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
      };
      this.getOrderData();
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
      // 校验策略编号必须为数字类型
      if (this.searchParams.ruleId) {
        this.searchParams.ruleId = Number(this.searchParams.ruleId)
      }
      http.postBlob(URL.ordersExport, this.searchParams, (res) => {
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
        link.download = `订单_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
        // 将链接元素添加到文档中
        document.body.appendChild(link);
        // 触发点击事件以开始下载
        link.click();
        // 移除链接元素
        document.body.removeChild(link);
      });
    },
    // 表头排序
    handleSort(a, b, c) {
      console.log(a, b, c, 2222)
    }
  },
};
</script>
