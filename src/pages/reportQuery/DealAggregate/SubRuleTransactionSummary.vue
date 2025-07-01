<style lang="less" scoped>
@import url("@/style/manage.less");
@import url("@/style/client.less");

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

</style>
<template>
  <div class="bck" :style="{marginTop:isClientPage?'0': '-25px'}">
    <Row v-if="!isClientPage" style="margin: 10px" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Select
              v-model="searchParams.commodityType"
              class="mr-3"
              style="width: 130px"
              placeholder="交易品种"
              :clearable="true"
          >
            <Option
                v-for="item in this.$store.state.dictionary.dictionaryList.CommodityType"
                :value="item.code"
                :key="item.code"
            >{{ item.description }}
            </Option>
          </Select>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.instrumentId"
              class="mr-3 input-form"
              placeholder="代码"
          >
          </Input>
        </form>
        <form autocomplete="off">
          <Input
              v-model="searchParams.ruleId"
              class="mr-3 input-form"
              placeholder="策略ID"
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
    <Row v-else style="margin: 10px" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 580px)"
      >
        <form autocomplete="off">
          <span style="color: #fff;margin-right: 5px">交易品种</span>
          <Select
              v-model="searchParams.commodityType"
              class="mr-3"
              style="width: 130px"
              placeholder="交易品种"
          >
            <Option
                :value="1"
                :key="1"
            >全部
            </Option>
            <Option
                v-for="item in this.$store.state.dictionary.dictionaryList.CommodityType"
                :value="item.code"
                :key="item.code"
            >{{ item.description }}
            </Option>
          </Select>
        </form>
        <div style="color: #fff;margin:auto 5px">策略ID</div>
        <form autocomplete="off">
          <Input
              v-model="searchParams.ruleId"
              class="mr-3 input-form"
              placeholder="策略ID"
          >
          </Input>
        </form>
      </Col>
      <Col class="mr-3" style="flex-shrink: 0;display: flex">
        <div style="color: var(--text-color);  line-height: 32px;margin-right: 25px">
          更新时间：{{ updateTime || '暂无数据' }}
        </div>
        <Button type="primary" @click="refresh()" class="mr-3 client-button">
          查询
        </Button
        >
        <Button type="primary" @click="handleExportOrders()" class="mr-3 client-button">
          <img src="@/assets/export.svg" alt="导出" class="client-icon">
        </Button>
        <form autocomplete="off">
          <Input
              v-model="searchParams.instrumentId"
              class="mr-3 input-form"
              @on-change="refresh"
              placeholder="债券代码"
              :search="true"
          >
          </Input>
        </form>
      </Col>
    </Row>
    <Table
        highlight-row
        :columns="columns1"
        size="small"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        row-key="quote"
        border
        @on-sort-change="e=>handleSort(e,this.getOrderData)"
        @on-column-width-resize="handleColumnResize"

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

export default {
  mixins: [tableMixin],
  data() {
    const savedWidths = JSON.parse(localStorage.getItem('subDealStatisticColumnWidths') || '{}');
    let columns1 = [
      {
        title: "交易所代码",
        key: "exchangeId",
        minWidth: 120,
        resizable: true,
        width: savedWidths.exchangeId || null,
        sortable: 'custom',
      },
      {
        title: "策略ID",
        key: "ruleId",
        minWidth: 120,
        resizable: true,
        width: savedWidths.ruleId || null,
        sortable: 'custom',
      },
      {
        title: "策略名称",
        key: "ruleName",
        minWidth: 150,
        resizable: true,
        width: savedWidths.ruleName || null,
        sortable: 'custom',
      },
      {
        title: "代码",
        key: "instrumentId",
        minWidth: 150,
        resizable: true,
        width: savedWidths.instrumentId || null,
        sortable: 'custom',
        tree: true
      },
      {
        title: "买成交量",
        key: "bidVolume",
        minWidth: 100,
        resizable: true,
        width: savedWidths.bidVolume || null,
        align: 'center',
      },
      {
        title: "买成交笔数",
        key: "bidNumber",
        minWidth: 100,
        resizable: true,
        width: savedWidths.bidNumber || null,
        align: 'center',
      },
      {
        title: "买成交均价",
        key: "bidAveragePrice",
        minWidth: 100,
        resizable: true,
        width: savedWidths.bidAveragePrice || null,
        align: 'center',
      },
      {
        title: "卖成交均价",
        key: "offerAveragePrice",
        minWidth: 100,
        resizable: true,
        width: savedWidths.offerAveragePrice || null,
        align: 'center',
      },
      {
        title: "卖成交笔数",
        key: "offerNumber",
        minWidth: 100,
        resizable: true,
        width: savedWidths.offerNumber || null,
        align: 'center',
      },
      {
        title: "卖成交量",
        key: "offerVolume",
        minWidth: 100,
        resizable: true,
        width: savedWidths.offerVolume || null,
        align: 'center',
      },
      {
        title: "成交差额",
        key: "dealSubtract",
        minWidth: 100,
        resizable: true,
        width: savedWidths.dealSubtract || null,
        align: 'center',
      },
      {
        title: "买最低价",
        key: "bidLowestPrice",
        minWidth: 100,
        resizable: true,
        width: savedWidths.bidLowestPrice || null,
        align: 'center',
      },
      {
        title: "买最高价",
        key: "bidHighestPrice",
        minWidth: 100,
        resizable: true,
        width: savedWidths.bidHighestPrice || null,
        align: 'center',
      },
      {
        title: "卖最低价",
        key: "offerLowestPrice",
        minWidth: 100,
        resizable: true,
        width: savedWidths.offerLowestPrice || null,
        align: 'center',
      },
      {
        title: "卖最高价",
        key: "offerHighestPrice",
        minWidth: 100,
        resizable: true,
        width: savedWidths.offerHighestPrice || null,
        align: 'center',
      },
      {
        title: "数量单位",
        key: "unit",
        minWidth: 90,
        resizable: true,
        width: savedWidths.unit || null,
      },
    ];
    let searchParams = {
      commodityType: 1,
      instrumentId: "",
      ruleId: "",
      envId: sessionStorage.getItem('envid'),
      tradingDay: null
    };
    return {
      columns1,
      searchParams,
      updateTime: "",
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
        commodityType: this.searchParams.commodityType === 1 ? "" : this.searchParams.commodityType,
      };
      const url = this.isClientPage ? URL.dealStatisticRule : URL.dealStatisticRuleWeb;
      http.post(url, payload, (res) => {
        this.pagination.total = res.data.total;
        this.updateTime = res.data.updateTime
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
      if (this.searchParams.envId === 'undefined') {
        delete this.searchParams.envId
      }
      const payload = {
        ...this.searchParams,
        commodityType: this.searchParams.commodityType === 1 ? "" : this.searchParams.commodityType,
      }
      const url = this.isClientPage ? URL.dealStatisticRuleExport : URL.dealStatisticRuleExportWeb;
      handleExport(url, payload, '分策略成交汇总列表')
    },
    // 表头宽度持久化
    handleColumnResize(newWidth, oldWidth, column, event) {
      const key = column.key || column.slot; // 兜底取唯一 key

      if (!key) return; // 防止无 key 的列参与

      const savedWidths = JSON.parse(localStorage.getItem('subDealStatisticColumnWidths') || '{}');
      savedWidths[key] = newWidth;
      localStorage.setItem('subDealStatisticColumnWidths', JSON.stringify(savedWidths));
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
};
</script>
