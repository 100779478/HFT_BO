<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
}

.page-bottom {
  float: right;
  margin-top: 20px;
}

.table-content {

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
            v-model="searchParams.instrumentId"
            class="mr3"
            style="float: right; width: 145px; border-radius: 20px"
            placeholder="合约代码"
        >
        </Input>
        <Input
            v-model="searchParams.combiNo"
            class="mr3"
            style="float: right; width: 145px; border-radius: 20px"
            placeholder="持仓账号"
        >
        </Input>
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
          ></DatePicker>
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
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        :loading="loading"
        border
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
  getHedgeType,
} from "@/common/common";

export default {
  data() {
    let columns1 = [
      {
        title: "合约代码",
        key: "instrumentId",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "持仓账号",
        key: "combiNo",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "成交编号",
        key: "tradeId",
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
        title: "持仓方向",
        key: "positionDirection",
        minWidth: 150,
        resizable: true,
        width: null,
        render: (h, {row}) => {
          const result = getPositionDirection(row.positionDirection);
          const color = {
            2: "#ff0000",
            3: "#19be6b",
          };
          return h(
              "span",
              {style: {color: color[result.code], fontWeight: "bold"}},
              result.description
          );
        },
      },
      {
        title: "投机套保标志",
        key: "hedgeFlag",
        minWidth: 150,
        resizable: true,
        width: null,
        render: (h, {row}) => {
          const result = getHedgeType(row.hedgeFlag);
          return h("span", result.description);
        },
      },
      {
        title: "持仓量",
        key: "position",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "昨持仓",
        key: "ydPosition",
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
      instrumentId: "",
      combiNo: "",
      startDate: "",
      endDate: "",
    };
    let dateRange = [moment().format("YYYYMMDD"), moment().format("YYYYMMDD")];
    return {
      loading: true,
      tableHeight: 0,
      tableData: [],
      columns1,
      pagination,
      isNew: true,
      searchParams,
      dateRange,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getPositionData();
  },
  methods: {
    // 获取订单列表
    getPositionData() {
      this.searchParams.startDate = moment(this.dateRange[0]).isValid()
          ? moment(this.dateRange[0]).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange[1]).isValid()
          ? moment(this.dateRange[1]).format("YYYYMMDD")
          : null;
      const payload = {
        ...this.pagination,
        ...this.searchParams,
      };
      http.post(URL.position, payload, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList;
      });
    },

    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getPositionData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getPositionData();
    },
    // 查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getPositionData();
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
      };
      this.getPositionData();
    },
    // 导出列表
    handleExportOrders() {
      this.searchParams.startDate = moment(this.dateRange[0]).isValid()
          ? moment(this.dateRange[0]).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange[1]).isValid()
          ? moment(this.dateRange[1]).format("YYYYMMDD")
          : null;
      http.postBlob(URL.positionExport, this.searchParams, (res) => {
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
      });
    },
  },
};
</script>
