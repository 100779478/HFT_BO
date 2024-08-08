<style lang="less" scoped>
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col
          span="19"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Input
              class="mr3"
              v-model="pagination.customerName"
              style="float: right; width: 160px; border-radius: 20px"
              placeholder="客户名称"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              class="mr3"
              v-model="pagination.transactionName"
              style="float: right; width: 160px; border-radius: 20px"
              placeholder="操作业务"
          >
          </Input>
        </form>
        <Select
            v-model="pagination.operatingLogType"
            class="mr3"
            style="width: 100px"
            placeholder="操作系统"
            :clearable="true"
        >
          <Option
              v-for="item in this.$store.state.dictionary.dictionaryList.OperatingLogType"
              :value="item.code"
              :key="item.code"
          >{{ item.description }}
          </Option
          >
        </Select>
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
      <Col style="position:absolute;right: 25px">
        <Button type="primary" @click="refresh()"
                style="margin-right: 5px"
        >
          <Icon type="md-search"/>
          查询
        </Button
        >
        <Button type="success" @click="handleExportLog()" class="mr3"
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
        size="small"
        class="table-content"
        :height="tableHeight"
        ref="table"
        :loading="loading"
        border
        @on-sort-change="e=>handleSort(e,this.getOperatingLog)"
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getOperatingLog)"
            @on-change="e=>handleChangePage('pageNumber',e,getOperatingLog)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {handleSort, handleExport} from "@/common/common";
import moment from "moment/moment";
import {tableMixin} from "@/mixins/tableMixin";

export default {
  mixins:[tableMixin],
  data() {
    let columns1 = [
      {
        title: "操作序号",
        key: "sequenceNo",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom'
      },
      {
        title: "客户编号",
        key: "customerId",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "客户名称",
        key: "customerName",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "操作日期",
        key: "transactionDate",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "操作时间",
        key: "transactionTime",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "业务编号",
        key: "tid",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "操作业务",
        key: "transactionName",
        minWidth: 200,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "具体信息",
        key: "operateMessage",
        minWidth: 400,
        resizable: true,
        width: null,
      },
      {
        title: "网卡地址",
        key: "macAddress",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "IP地址",
        key: "ipAddress",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "登录机器名",
        key: "hostName",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
    ];
    let pagination = {
      customerName: '',
      transactionName: '',
      operatingLogType: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    };
    let dateRange = {startDate: moment().format("YYYYMMDD"), endDate: moment().format("YYYYMMDD")};
    let timeRange = [];
    return {
      dateRange,
      timeRange,
      columns1,
      pagination,
    };
  },
  mounted() {
    this.getOperatingLog();
  },
  methods: {
    handleSort,
    // 获取操作日志列表
    getOperatingLog() {
      this.loading = true;
      this.pagination.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.pagination.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
          : null;
      this.pagination.startTime = this.timeRange[0];
      this.pagination.endTime = this.timeRange[1];
      http.post(`${URL.logList}`, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
      });
    },
    // 刷新
    refresh() {
      this.getOperatingLog();
    },
    // 导出列表
    handleExportLog() {
      this.pagination.startDate = moment(this.dateRange.startDate).isValid()
          ? moment(this.dateRange.startDate).format("YYYYMMDD")
          : null;
      this.pagination.endDate = moment(this.dateRange.endDate).isValid()
          ? moment(this.dateRange.endDate).format("YYYYMMDD")
          : null;
      this.pagination.startTime = this.timeRange[0];
      this.pagination.endTime = this.timeRange[1];
      handleExport(URL.logExport, this.pagination, '操作日志')
    },
  },
};
</script>
