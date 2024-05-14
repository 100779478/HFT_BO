<style lang="less" scoped>
@import url("@/style/manage.less");

.ivu-table-tip {
  font-size: 26px;
}

.page-bottom {
  float: right;
  margin-top: 20px;
}

.table-content {
  //border: 1px solid #e8eaec;

  .table-operate {
    font-size: 14px;
    color: rgb(2, 175, 241);
    margin-right: 6px;
    cursor: pointer;
  }
}

.top {
  margin: -10px 5px 5px 5px
}
</style>
<template>
  <div>
    <Modal
        v-model="showAddModal"
        draggable
        sticky
        mask
        :width="600"
        :mask-closable="false"
        title="计算"
        :loading="loading"
    >
      <Form
          ref="yearForm"
          :label-width="210"
          label-colon
          autocomplete="off"
      >
        <Col :span="18">
          <FormItem label="年份">
            <DatePicker type="year" placeholder="选择年份" style="width: 200px" v-model="year"></DatePicker>
          </FormItem>
        </Col>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok()">确定</Button>
      </div>
    </Modal>

    <form style="float: left" class="top" autocomplete="off">
      <Select
          v-model="pagination.exchangeCode"
          class="mr3"
          style="width: 100px"
          placeholder="交易所类型"
      >
        <Option
            v-for="item in this.$store.state.dictionaryList.TradeExchangeType"
            :value="item.code"
            :key="item.code"
        >{{ item.description }}
        </Option
        >
      </Select>
      <DatePicker
          split-panels
          class="mr3"
          type="date"
          placement="bottom-end"
          placeholder="选择起始日期"
          style="width: 125px"
          format="yyyy-MM-dd"
          v-model="pagination.startDate"
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
          v-model="pagination.endDate"
          :transfer="true"
          autocomplete="false"
      ></DatePicker>
    </form>
    <div style="float: right">
      <Button type="info" @click="modalUser()" class="top">
        计算
      </Button>
      <Button type="success" @click="getCalendarList()" class="top">
        <Icon type="md-search"/>
        查询
      </Button>
      <Button type="success" @click="()=>handleExport(URL.calendarExport,this.pagination,'交易日历')" class="top">
        <Icon type="md-download"/>
        导出
      </Button>
    </div>
    <Table
        style="clear: both"
        :columns="columns1"
        :data="tableData"
        size="small"
        class="table-content"
        :height="tableHeight"
        ref="table"
        border
        @on-sort-change="e=>handleSort(e,this.getCalendarList)"
    >
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteEnvironment(row)" class="table-operate">
            删除
          </div>
        </div>
      </template>
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
            @on-sort-change="e=>handleSort(e,this.getCalendarList)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {formatDate, getDayOfWeek, getTradeExchangeType, handleExport, handleSort} from "@/common/common";
import moment from "moment";
import {renderDateCell} from "@/pages/systemManage/TradeDateComponents/index";

export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "日期",
        key: "day",
        minWidth: 80,
        resizable: true,
        width: null,
        sortable: 'custom',
        render: (h, params) => {
          const {day} = params.row
          const val = moment(day).format('YYYY-MM-DD')
          return h('span', val)
        }
      },
      {
        title: "周几",
        key: "weekDay",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => {
          const {weekDay} = params.row
          const val = getDayOfWeek(weekDay).description
          return h('span', val)
        }
      },
      {
        title: "交易所类型",
        key: "exchangeCode",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => {
          const {exchangeCode} = params.row
          const val = getTradeExchangeType(exchangeCode).description
          return h('span', val)
        }
      },
      {
        title: "是否交易",
        key: "trading",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => {
          const {trading} = params.row
          return h('span', !trading ? '否' : '是')
        }
      },
      {
        title: "是否节假日",
        key: "holiday",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => {
          const {holiday} = params.row
          return h('span', !holiday ? '否' : '是')
        }
      },
      {
        title: "T-1",
        key: "pre1",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => renderDateCell(h, params, ['pre1', 'dayCountTPre1'])
      },
      {
        title: "T+0",
        key: "t0",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => renderDateCell(h, params, ['t0', 'dayCountT0'])
      },
      {
        title: "T+1",
        key: "t1",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => renderDateCell(h, params, ['t1', 'dayCountT1'])
      },
      {
        title: "T+2",
        key: "t2",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, params) => renderDateCell(h, params, ['t2', 'dayCountT2'])
      },
      {title: "操作", slot: "operator", width: null, minWidth: 100,},
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      sort: 'asc',
      sortField: '',
      startDate: moment().format("YYYYMMDD"),
      endDate: moment().format("YYYYMMDD"),
      exchangeCode: this.$store.state.dictionaryList.TradeExchangeType[0].code,
    };
    return {
      loading: true,
      tableHeight: window.innerHeight - 220,
      tableData: [],
      columns1,
      year: moment().format("YYYY"),
      showAddModal: false,
      pagination,
      URL
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getCalendarList();
  },
  unMounted() {
    window.removeEventListener('resize', () => {
    })
  },
  methods: {
    // 导出交易日历
    handleExport,
    // 排序
    handleSort,
    // 获取交易日历
    getCalendarList() {
      this.pagination.startDate = formatDate(this.pagination.startDate)
      this.pagination.endDate = formatDate(this.pagination.endDate)
      http.post(`${URL.calendarList}`, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
      });
    },
    // 用户弹窗
    modalUser(type, row) {
      this.showAddModal = true
      // 清除表单验证信息（初始化）
      this.$refs.yearForm.resetFields();
    },
    // 新增弹窗确认按键
    ok() {
      const year = moment(this.year).format('YYYY')
      http.post(`${URL.calendarCalculate}/${year}`, {}, (res) => {
        if (res.code === '0') {
          this.$Message.success('计算成功')
          this.showAddModal = false
          this.getCalendarList();
        }
      })
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getCalendarList();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getCalendarList();
    },
  },
};
</script>
