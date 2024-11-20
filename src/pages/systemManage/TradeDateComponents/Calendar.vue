<style lang="less" scoped>
@import url("@/style/manage.less");

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
            <DatePicker type="year" placeholder="选择年份" style="width: 100px" v-model="year"></DatePicker>
          </FormItem>
        </Col>
        <Col :span="18">
          <FormItem label="交易所类型">
            <Select
                v-model="exchangeCode"
                class="mr-3"
                style="width: 100px"
                placeholder="交易所类型"
            >
              <Option
                  v-for="item in this.tradeExchangeTypeList"
                  :value="item.code"
                  :key="item.code"
              >{{ item.description }}
              </Option
              >
            </Select>
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
          class="mr-3"
          style="width: 100px"
          placeholder="交易所类型"
      >
        <Option
            v-for="item in this.tradeExchangeTypeList"
            :value="item.code"
            :key="item.code"
        >{{ item.description }}
        </Option
        >
      </Select>
      <DatePicker
          split-panels
          class="mr-3"
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
          class="mr-3"
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
        <Icon type="md-calculator"/>
        计算
      </Button>
      <Button type="primary" @click="getCalendarList()" class="top">
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
        :loading="loading"
        size="small"
        class="table-content"
        :height="tableHeight"
        ref="table"
        border
        @on-sort-change="e=>handleSort(e,this.getCalendarList)"
    ></Table>
    <template>
      <div class="page-bottom">
        <Page
            :total="pagination.total"
            :current="pagination.pageNumber"
            :page-size="pagination.pageSize"
            :page-size-opts="[20, 50, 100, 200]"
            show-sizer
            show-total
            @on-page-size-change="e=>handleChangePage('pageSize', e, getCalendarList)"
            @on-change="e=>handleChangePage('pageNumber',e,getCalendarList)"
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
import tradeExchangeMixin from "@/mixins/tradeExchangeMixin";
import {tableMixin} from "@/mixins/tableMixin";
import {SUCCESS_MSG} from "@/common/constant";

export default {
  props: ["userId"],
  mixins: [tradeExchangeMixin, tableMixin],
  data() {
    let columns1 = [
      {
        title: "日期",
        key: "day",
        minWidth: 80,
        resizable: true,
        width: null,
        sortable: 'custom',
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
        title: "是否交易日",
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
      },
      {
        title: "T+0",
        key: "t0",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "T+1",
        key: "t1",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "T+2",
        key: "t2",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
    ];
    let pagination = {
      startDate: moment().startOf('year').format('YYYY-MM-DD'),
      endDate: moment().endOf('year').format('YYYY-MM-DD'),
      exchangeCode: null,
    };
    return {
      columns1,
      year: moment().format("YYYY"),
      exchangeCode: null,
      showAddModal: false,
      pagination,
    };
  },
  mounted() {
    this.getCalendarList();
  },
  methods: {
    // 导出交易日历
    handleExport,
    // 排序
    handleSort,
    // 获取交易日历
    getCalendarList() {
      this.loading = true
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
      http.post(`${URL.calendarCalculate}`, {
        year,
        exchangeCode: this.exchangeCode,
        messageType: SUCCESS_MSG.calculationSuccess
      }, (res) => {
        if (res.code === '0') {
          this.showAddModal = false
          this.getCalendarList();
        }
      })
    },
    setExchangeCode(code) {
      this.exchangeCode = code;
      this.pagination.exchangeCode = code;
    }
  },
};
</script>
