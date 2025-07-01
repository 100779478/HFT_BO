<style lang="less" scoped>
@import url("@/style/manage.less");

.bck {
  height: 100%;
  padding: 10px;
  position: relative;
  background-color: var(--background-color);
  overflow: auto;
  width: 100%;
}

.input-form {
  float: right;
  width: 145px;
  border-radius: 20px;
}

.check-box {
  margin: auto 5px;
  color: var(--text-color);
}

</style>
<template>
  <div class="bck">
    <Row style="margin: 10px" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Input
              v-model="searchParams.securityId"
              class="mr-3 input-form"
              placeholder="债券代码"
          >
          </Input>
        </form>
        <Checkbox v-model="searchParams.newBond" class="mr-3 check-box">新发关键期限国债</Checkbox>
        <Checkbox v-model="searchParams.makeTimeValid" class="mr-3 check-box">累计有效时间不足4小时</Checkbox>
        <Checkbox v-model="searchParams.blankTimeValid" class="mr-3 check-box">空白时间超过30分钟</Checkbox>
        <form autocomplete="off">
          <DatePicker
              split-panels
              class="mr-3"
              type="date"
              placement="bottom-end"
              placeholder="选择起始日期"
              style="width: 125px"
              format="yyyy-MM-dd"
              v-model="dateRange.startDate"
              autocomplete="false"
          ></DatePicker>
          <DatePicker
              split-panels
              class="mr-3"
              type="date"
              placement="bottom-end"
              placeholder="选择结束日期"
              style="width: 125px"
              format="yyyy-MM-dd"
              v-model="dateRange.endDate"
              autocomplete="false"
          ></DatePicker>
        </form>
      </Col>
      <Col class="mr-3" style="flex-shrink: 0">
        <Button type="primary" @click="refresh()" class="mr-3"
        >
          <Icon type="md-search"/>
          查询
        </Button
        >
        <Button type="success" @click="handleExportOrders()" class="mr-3"
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
        border
        @on-sort-change="e=>handleSort(e,this.getOrderData)"
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getOrderData)"
            @on-change="e=>handleChangePage('pageNumber',e,getOrderData)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import moment from "moment";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {handleExport, handleSort} from "@/common/common";
import {tableMixin} from "@/mixins/tableMixin";

export default {
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "债券代码",
        key: "securityId",
        minWidth: 120,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "债券简称",
        key: "securityName",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "债券类型名称",
        key: "securityDesc",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "当天有效做市时间",
        key: "makeTime",
        minWidth: 160,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "待偿期",
        key: "termToMaturityString",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "发行日",
        key: "issueDate",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "债券期限",
        key: "securityTerm",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "最大空白时间",
        key: "maxBlankTime",
        minWidth: 150,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "做市日期",
        key: "lastUpdDate",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "做市券种",
        key: "securitySuperType",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "是否有效时长不足4小时",
        key: "makeTimeValid",
        minWidth: 190,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "是否空白时长大于30分钟",
        key: "blankTimeValid",
        minWidth: 190,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
    ];
    let searchParams = {
      securityId: "",
      newBond: false,
      makeTimeValid: false,
      blankTimeValid: false,
      startDate: "",
      endDate: "",
      envId: sessionStorage.getItem('envid'),
    };
    let dateRange = {startDate: moment().format("YYYYMMDD"), endDate: moment().format("YYYYMMDD")};
    return {
      columns1,
      searchParams,
      dateRange,
      tableHeight: sessionStorage.getItem('isClientPage') ? window.innerHeight - 115 : window.innerHeight - 210,
      URL
    };
  },
  mounted() {
    this.getOrderData();
  },
  computed: {
    isClientPage() {
      return sessionStorage.getItem('isClientPage')
    },
  },
  methods: {
    handleSort,
    // 监听窗口
    calculateTableHeight() {
      return this.isClientPage ? window.innerHeight - 115 : window.innerHeight - 210;
    },
    // 获取订单列表
    getOrderData() {
      this.searchParams.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
          : null;
      if (this.searchParams.envId === 'undefined') {
        delete this.searchParams.envId
      }
      const payload = {
        ...this.pagination,
        ...this.searchParams,
      };
      const url = this.isClientPage ? URL.makeMarketListEnv : URL.makeMarketList;
      http.post(url, payload, (res) => {
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList;
      });
    },
    // 查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getOrderData();
    },
    // 刷新
    refresh() {
      this.getOrderData();
    },
    // 导出列表
    handleExportOrders() {
      this.searchParams.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.searchParams.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
          : null;
      if (this.searchParams.envId === 'undefined') {
        delete this.searchParams.envId
      }
      const url = this.isClientPage ? URL.makeMarketListExportEnv : URL.makeMarketListExport;
      handleExport(url, this.searchParams, '做市义务数据列表')
    },
  },
};
</script>
