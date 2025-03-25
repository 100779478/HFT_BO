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

.updateTime {
  color: var(--text-color);
  line-height: 32px;
  float: right;
  position: absolute;
  right: 20px
}

.top {
  margin: -10px 5px 5px 5px
}
</style>
<template>
  <div class="bck" :style="{marginTop:isClientPage?'0': '-25px'}">
    <Row style="margin:10px" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Input
              v-model="searchParams.commodityType"
              class="mr-3 input-form"
              placeholder="交易品种"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.instrumentId"
              class="mr-3 input-form"
              placeholder="债券代码"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <DatePicker
              v-show="!isClientPage"
              v-model="searchParams.tradingDay"
              split-panels
              class="mr-3"
              type="date"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 125px"
              format="yyyy-MM-dd"
              autocomplete="false"
          ></DatePicker>
        </form>
        <div class="updateTime">
          更新时间：{{ updateTime || '暂无数据' }}
        </div>
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
        style="clear: both"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        row-key="instrumentId"
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
import {handleExport, handleSort,} from "@/common/common";
import {tableMixin} from "@/mixins/tableMixin";
import {fixed} from "lodash/fp/_falseOptions";

export default {
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "交易所代码",
        key: "exchangeId",
        minWidth: 120,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "代码",
        key: "instrumentId",
        minWidth: 150,
        resizable: true,
        width: null,
        tree: true,
        renderHeader: (h, {column}) => {
          return h('span', [h('span', column.title), h('Icon', {
            props: {
              type: !this.showTree ? 'md-more' : 'ios-more', // 按钮图标
            },
            style: {
              fontSize: '15px',
              cursor: 'pointer'
            },
            on: {
              click: () => this.toggleExpandAll(), // 绑定点击事件
            },
          }, '')])
        }
      },
      {
        title: "成交来源",
        key: "dealResource",
        minWidth: 150,
        resizable: true,
        width: null,
      },
      {
        title: "买成交量",
        key: "bidVolume",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
      },
      {
        title: "买成交笔数",
        key: "bidNumber",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
      },
      {
        title: "买成交均价",
        key: "bidAveragePrice",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
        render: (h, params) => {
          const {row} = params
          const txt = row.bidAveragePrice ? row.bidAveragePrice.toFixed(4) : null
          return h('span', txt)
        }
      },
      {
        title: "卖成交均价",
        key: "offerAveragePrice",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
        render: (h, params) => {
          const {row} = params
          const txt = row.offerAveragePrice ? row.offerAveragePrice.toFixed(4) : null
          return h('span', txt)
        }
      },
      {
        title: "卖成交笔数",
        key: "offerNumber",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
      },
      {
        title: "卖成交量",
        key: "offerVolume",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
      },
      {
        title: "成交差额",
        key: "dealSubtract",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
      },
      {
        title: "买最低价",
        key: "bidLowestPrice",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
        render: (h, params) => {
          const {row} = params
          const txt = row.bidLowestPrice ? row.bidLowestPrice.toFixed(4) : null
          return h('span', txt)
        }
      },
      {
        title: "买最高价",
        key: "bidHighestPrice",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
        render: (h, params) => {
          const {row} = params
          const txt = row.bidHighestPrice ? row.bidHighestPrice.toFixed(4) : null
          return h('span', txt)
        }
      },
      {
        title: "卖最低价",
        key: "offerLowestPrice",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
        render: (h, params) => {
          const {row} = params
          const txt = row.offerLowestPrice ? row.offerLowestPrice.toFixed(4) : null
          return h('span', txt)
        }
      },
      {
        title: "卖最高价",
        key: "offerHighestPrice",
        minWidth: 100,
        resizable: true,
        width: null,
        align: 'right',
        render: (h, params) => {
          const {row} = params
          const txt = row.offerHighestPrice ? row.offerHighestPrice.toFixed(4) : null
          return h('span', txt)
        }
      },
      {
        title: "数量单位",
        key: "unit",
        minWidth: 90,
        resizable: true,
        width: null,
      },
    ];
    let searchParams = {
      commodityType: "",
      instrumentId: "",
      ruleId: "",
      envId: sessionStorage.getItem('envid'),
      // tradingDay: null,
      tradingDay: moment('20231129').format('YYYYMMDD'),
    };
    return {
      columns1,
      searchParams,
      updateTime: null,
      showTree: false,
      timer: null,
      tableHeight: sessionStorage.getItem('isClientPage') ? window.innerHeight - 115 : window.innerHeight - 240,
      URL
    };
  },
  mounted() {
    this.getOrderData()
    // 30秒请求一次
    this.timer = setInterval(() => {
      this.getOrderData();
    }, 30000)
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
      return this.isClientPage ? window.innerHeight - 115 : window.innerHeight - 240;
    },
    // 获取订单列表
    getOrderData() {
      if (this.searchParams.envId === 'undefined') {
        delete this.searchParams.envId
      }
      this.searchParams.tradingDay = moment(this.searchParams.tradingDay).isValid()
          ? moment(this.searchParams.tradingDay).format("YYYYMMDD")
          : null;
      const payload = {
        ...this.pagination,
        ...this.searchParams,
      };
      http.post(URL.dealStatisticTotal, payload, (res) => {
        this.pagination.total = res.data.total;
        this.updateTime = res.data.updateTime
        this.tableData = res.data.dataList;
      });
    },
    // 展开、收缩树形解构
    toggleExpandAll() {
      this.tableData.map(i => {
        this.$set(i, '_showChildren', !this.showTree);
      })
      console.log(this.tableData, this.showTree)
      this.showTree = !this.showTree
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
      if (this.searchParams.envId === 'undefined') {
        delete this.searchParams.envId
      }
      handleExport(URL.dealStatisticTotalExport, this.searchParams, '成交汇总列表')
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
};
</script>
