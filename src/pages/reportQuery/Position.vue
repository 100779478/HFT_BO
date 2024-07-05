<style lang="less" scoped>
@import url("@/style/manage.less");

.input-form {
  float: right;
  width: 145px;
  border-radius: 20px
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
        <form autocomplete="off">
          <Input
              v-model="searchParams.instrumentId"
              class="mr3 input-form"
              placeholder="合约代码"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.combiNo"
              class="mr3 input-form"
              placeholder="持仓账号"
          >
          </Input>
        </form>
        <form autocomplete="off">
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
        <Button type="info" @click="refresh()" class="mr3"
        >
          <Icon type="md-search"/>
          查询
        </Button
        >
        <Button type="success" @click="handleExportPosition()" class="mr3"
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
        @on-sort-change="e=>handleSort(e,this.getPositionData)"
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
import {getHedgeType, getPositionDirection, handleSort, handleExport} from "@/common/common";

export default {
  data() {
    let columns1 = [
      {
        title: "交易日",
        key: "tradingDay",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "合约代码",
        key: "instrumentId",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "持仓账号",
        key: "combiNo",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "交易所代码",
        key: "exchangeId",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "持仓方向",
        key: "positionDirection",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
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
        sortable: 'custom',
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
        sortable: 'custom',
        width: null,
      },
      {
        title: "昨持仓",
        key: "ydPosition",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      sort: 'asc',
      sortField: ''
    };
    let searchParams = {
      instrumentId: "",
      combiNo: "",
      startDate: "",
      endDate: "",
    };
    let dateRange = {startDate: moment().format("YYYYMMDD"), endDate: moment().format("YYYYMMDD")};
    return {
      loading: true,
      tableHeight: window.innerHeight - 220,
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
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getPositionData();
  },
  unMounted() {
    window.removeEventListener('resize', () => {
    })
  },
  methods: {
    handleSort,
    // 获取持仓列表
    getPositionData() {
      this.searchParams.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
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
      // this.pagination = {
      //   total: 0,
      //   pageSize: 20,
      //   pageNumber: 1,
      // };
      this.getPositionData();
    },
    // 导出列表
    handleExportPosition() {
      this.searchParams.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
          : null;
      handleExport(URL.positionExport, this.searchParams, '持仓')
    },
  },
};
</script>
