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
        :title="isNew ? '新增节假日' : '编辑节假日'"
    >
      <Form
          ref="ruleForm"
          :model="holidaySetting"
          :label-width="210"
          label-colon
          autocomplete="off"
      >
        <Col :span="18">
          <FormItem label="起始日期" prop="startDate">
            <DatePicker
                split-panels
                class="mr-3"
                type="date"
                placement="bottom-end"
                placeholder="选择起始日期"
                style="width: 125px"
                format="yyyy-MM-dd"
                v-model="holidaySetting.startDate"
                :transfer="true"
                autocomplete="false"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :span="18">
          <FormItem label="结束日期" prop="endDate">
            <DatePicker
                split-panels
                class="mr-3"
                type="date"
                placement="bottom-end"
                placeholder="选择结束日期"
                style="width: 125px"
                format="yyyy-MM-dd"
                v-model="holidaySetting.endDate"
                :transfer="true"
                autocomplete="false"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :span="18">
          <FormItem label="交易所类型" prop="exchangeCode">
            <Select
                v-model="holidaySetting.exchangeCode"
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
        <Col :span="18">
          <FormItem label="节假日说明" prop="comment">
            <Input
                v-model="holidaySetting.comment"
                placeholder="请输入节假日说明"
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
      <Button type="info" @click="modalUser('new')" class="top">
        <Icon type="md-add"/>
        新增
      </Button>
      <Button type="primary" @click="getHolidayList()" class="top">
        <Icon type="md-search"/>
        查询
      </Button>
      <Button type="success" @click="()=>handleExport(URL.holidayExport,this.pagination,'节假日')" class="top">
        <Icon type="md-download"/>
        导出
      </Button>
    </div>
    <Table
        :loading="loading"
        style="clear: both"
        :columns="columns1"
        :data="tableData"
        size="small"
        class="table-content"
        :height="tableHeight"
        border
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteRow(URL.holiday,row.id,'节假日',getHolidayList)" class="table-operate">
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getHolidayList)"
            @on-change="e=>handleChangePage('pageNumber',e,getHolidayList)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {formatDate, getTradeExchangeType, handleExport} from "@/common/common";
import moment from "moment/moment";
import tradeExchangeMixin from "@/mixins/tradeExchangeMixin";
import {tableMixin} from "@/mixins/tableMixin";
import {SUCCESS_MSG} from "@/common/constant";

export default {
  mixins: [tradeExchangeMixin, tableMixin],
  data() {
    let columns1 = [
      {
        title: '起始日期',
        key: 'startDate',
      },
      {
        title: '结束日期',
        key: 'endDate',
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
        title: '节假日说明',
        key: 'comment'
      },
      {
        title: '操作',
        slot: 'operator'
      },
    ];
    let holidaySetting = {
      comment: '',
      exchangeCode: null,
      startDate: moment().format("YYYYMMDD"),
      endDate: moment().format("YYYYMMDD")
    }
    let pagination = {
      startDate: moment().startOf('year').format('YYYY-MM-DD'),
      endDate: moment().endOf('year').format('YYYY-MM-DD'),
      exchangeCode: null,
    };
    return {
      holidaySetting,
      showAddModal: false,
      isNew: true,
      columns1,
      pagination,
    };
  },
  mounted() {
    this.getHolidayList();
  },
  methods: {
    handleExport,
    // 获取状态连接列表
    getHolidayList() {
      this.loading = true
      this.pagination.startDate = formatDate(this.pagination.startDate)
      this.pagination.endDate = formatDate(this.pagination.endDate)
      http.post(`${URL.holidayList}`, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
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
          exchangeCode: this.tradeExchangeTypeList[0].code,
          startDate: moment().format("YYYYMMDD"),
          endDate: moment().format("YYYYMMDD"),
        };
        Object.assign(this.holidaySetting, info);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.holidaySetting = {...row};
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      this.holidaySetting.startDate = formatDate(this.holidaySetting.startDate)
      this.holidaySetting.endDate = formatDate(this.holidaySetting.endDate)
      if (this.holidaySetting.startDate > this.holidaySetting.endDate) {
        this.$Message.warning('起始日期不能大于结束日期')
        return
      }
      const config = {
        method: isNew ? 'put' : 'post',
        msg: isNew ? SUCCESS_MSG.addSuccess : SUCCESS_MSG.modifySuccess,
        url: URL.holiday
      };
      http[config.method](config.url, {...this.holidaySetting, messageType: config.msg}, () => {
        this.getHolidayList()
        this.cancel();
      });
    },
    setExchangeCode(code) {
      this.holidaySetting.exchangeCode = code;
      this.pagination.exchangeCode = code;
    }
  },
};
</script>
