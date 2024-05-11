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
        :title="isNew ? '新增周末工作日' : '编辑周末工作日'"
    >
      <Form
          ref="ruleForm"
          :model="weeklySetting"
          :label-width="210"
          label-colon
          autocomplete="off"
      >
        <Col :span="18">
          <FormItem label="日期" prop="tradingDay">
            <DatePicker
                split-panels
                class="mr3"
                type="date"
                placement="bottom-end"
                placeholder="选择日期"
                style="width: 125px"
                format="yyyy-MM-dd"
                v-model="weeklySetting.tradingDay"
                :transfer="true"
                autocomplete="false"
            ></DatePicker>
          </FormItem>
        </Col>
        <FormItem label="交易所类型" prop="exchangeCode">
          <Select
              v-model="weeklySetting.exchangeCode"
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
        </FormItem>
        <Col :span="18">
          <FormItem label="调整缘由" prop="comment">
            <Input
                v-model="weeklySetting.comment"
                placeholder="调整缘由"
                :maxlength="20"
                show-message="false"
            ></Input>
          </FormItem>
        </Col>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok(isNew)">确定</Button>
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
      <Button type="info" @click="modalUser('new')" class="top">
        <Icon type="md-add"/>
        新增
      </Button>
      <Button type="success" @click="getWeeklyList()" class="top">
        <Icon type="md-search"/>
        查询
      </Button>
    </div>
    <Table
        :loading="loading"
        style="clear: both"
        :columns="columns1"
        :data="list"
        size="small"
        class="table-content"
        :height="tableHeight"
        border
    >
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteHoliday(row)" class="table-operate">
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
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import moment from "moment/moment";
import InputPassword from "@/components/InputPassword.vue";
import {formatDate, getTradeExchangeType} from "@/common/common";

export default {
  components: {InputPassword},
  data() {
    let columns1 = [
      {
        title: '日期',
        key: 'tradingDay',
        render: (h, params) => {
          const {tradingDay} = params.row
          const val = moment(tradingDay).format('YYYY-MM-DD')
          return h('div', val)
        }
      },
      {
        title: "交易所类型",
        key: "exchangeCode",
        render: (h, params) => {
          const {exchangeCode} = params.row
          const val = getTradeExchangeType(exchangeCode).description
          return h('span', val)
        }
      },
      {
        title: '周几',
        key: 'weekDay'
      },
      {
        title: '调整缘由',
        key: 'comment'
      },
      {
        title: '操作',
        slot: 'operator'
      },
    ];
    let list = []
    let weeklySetting = {
      tradingDay: moment().format("YYYYMMDD"),
      exchangeCode: this.$store.state.dictionaryList.TradeExchangeType[0].code,
      weekDay: "",
      comment: ""
    }
    let pagination = {
      startDate: moment().subtract(1, 'month').format("YYYYMMDD"),
      endDate: moment().format("YYYYMMDD"),
      exchangeCode: this.$store.state.dictionaryList.TradeExchangeType[0].code,
      total: 0,
      pageSize: 20,
      pageNumber: 1,
    };
    return {
      loading: true,
      weeklySetting,
      showAddModal: false,
      isNew: true,
      tableHeight: window.innerHeight - 220,
      columns1,
      list,
      pagination
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getWeeklyList();
  },
  methods: {
    // 获取周末工作日列表
    getWeeklyList() {
      this.pagination.startDate = formatDate(this.pagination.startDate)
      this.pagination.endDate = formatDate(this.pagination.endDate)
      http.post(`${URL.weeklyList}`, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.list = res.data.dataList || [];
      });
    },
    // 用户弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          comment: '',
          weekDay: '',
          exchangeCode: this.$store.state.dictionaryList.TradeExchangeType[0].code,
          tradingDay: moment().format("YYYYMMDD"),
        };
        Object.assign(this.weeklySetting, info);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.weeklySetting = {...row};
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      this.weeklySetting.tradingDay = formatDate(this.weeklySetting.tradingDay)
      // 换算当前日期为周几
      this.weeklySetting.weekDay = moment(this.weeklySetting.tradingDay).isoWeekday();
      if (isNew) {
        http.put(URL.weekly, this.weeklySetting, () => {
          this.getWeeklyList()
          this.cancel();
        });
      } else {
        http.post(`${URL.weekly}`, this.weeklySetting, () => {
              this.getWeeklyList()
              this.cancel();
            }
        );
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 删除工作日
    deleteHoliday(row) {
      this.$Modal.confirm({
        title: `确认删除节假日吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.weekly}/${row.tradingDay}`, {}, () => {
            this.getWeeklyList();
          });
        },
        okText: "删除",
      });
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;

      this.getWeeklyList();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getWeeklyList();
    },
  },
};
</script>
