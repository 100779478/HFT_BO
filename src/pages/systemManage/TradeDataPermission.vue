<style lang="less" scoped>
@import "@/style/manage.less";
</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col style="height: 30px">
        <form autocomplete="off">
          <Input
              v-model="pagination.managerName"
              style="float: right; width: 160px; border-radius: 20px"
              placeholder="管理员名称"
              @on-keydown.enter="handleSearch"
              @on-change="handleSearch"
          >
            <Icon
                type="ios-search"
                slot="suffix"
                size="19"
                style="cursor: pointer"
                @click="handleSearch"
            />
          </Input>
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="modalUser('new')"
                style="margin-right: 5px"
        >
          <Icon type="md-add"/>
          新增权限
        </Button
        >
        <Button type="success" @click="()=>handleExport(URL.tradeDataExport, this.pagination,'权限管理')" class="mr3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="600"
            :mask-closable="false"
            :title="isNew ? '新增权限' : '编辑权限'"
            :loading="loading"
        >
          <Form
              ref="ruleForm"
              :model="tradeInfo"
              :label-width="180"
              label-colon
              autocomplete="off"
              :rules="tradeValidRules"
              style="height: 150px"
          >
            <Col :span="18">
              <FormItem label="管理用户" prop="managerId">
                <Select
                    v-model="tradeInfo.managerId"
                    filterable
                    style="width:260px"
                >
                  <Option v-for="(option) in customerList" :value="option.customerId" :key="option.customerId">
                    {{ option.customerId + `(${option.customerName})` }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="交易员" prop="traderIds">
                <Select
                    v-model="tradeInfo.traderIds"
                    multiple
                    filterable
                    :remote-method="remoteMethod3"
                    :loading="loading3"
                    style="width:260px"
                    :max-tag-count="1"
                >
                  <Option v-for="(option) in customerList" :value="option.customerId" :key="option.customerId">
                    {{ option.customerId + `(${option.customerName})` }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="ok(isNew)">确定</Button>
          </div>
        </Modal>
      </Col>
    </Row>
    <Table
        :columns="columns1"
        :data="tableData"
        size="small"
        class="table-content"
        :height="tableHeight"
        ref="table"
        border
        @on-sort-change="e=>handleSort(e,this.getTradeData)"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteRow(URL.tradeData,row.managerId,'管理员',getTradeData)" class="table-operate">
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getTradeData)"
            @on-change="e=>handleChangePage('pageNumber',e,getTradeData)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {handleExport, handleSort} from "@/common/common";
import {Message} from "view-design";
import {tableMixin} from "@/mixins/tableMixin";

export default {
  props: ["userId"],
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "管理员ID",
        key: "managerId",
        minWidth: 80,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "管理员名称",
        key: "managerName",
        minWidth: 80,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "交易员名称",
        key: "traders",
        minWidth: 800,
        resizable: true,
        width: null,
        render: this.renderTradeNames
      },
      {title: "操作", slot: "operator", width: null, minWidth: 100,},
    ];
    let pagination = {
      managerName: "",
    };
    let tradeValidRules = {
      managerId: [{required: true, message: "请选择管理员代码"}],
      traderIds: [{required: true, message: "请选择交易员"}],
    }
    return {
      loading3: false,
      tradeValidRules,
      tradeInfo: {
        managerId: "",
        traderIds: []
      },
      customerList: [], // 当前显示的列表
      originalCustomerList: [], // 原始完整列表
      searchMgId: "",
      searchTdId: "",
      columns1,
      showAddModal: false,
      isNew: true,
      pagination,
    };
  },
  mounted() {
    this.getTradeData();
    this.getCustomerList()
  },
  methods: {
    handleExport,
    handleSort,
    remoteMethod3(query) {
      if (query !== '') {
        this.loading3 = true;
        setTimeout(() => {
          this.loading3 = false;
        }, 200);
      }
    },
    getCustomerList() {
      http.get(URL.userList, (res) => {
        this.customerList = res.data
        this.originalCustomerList = res.data
      });
    },
    // 获取交易数据权限列表
    getTradeData() {
      this.loading = true;
      http.post(`${URL.tradeDataList}`, this.pagination, (res) => {
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
        this.remoteMethod3()
        this.isNew = true;
        this.showAddModal = true;
        this.tradeInfo = {
          managerId: "",  // 清空初始值
          traderIds: []
        };
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.tradeInfo = {...row};
        this.tradeInfo.traderIds = row.traders.map(v => v.traderId)
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (!this.tradeInfo.managerId) {
        Message.error('请选择管理用户')
        return
      } else if (!this.tradeInfo.traderIds.length) {
        Message.error('请选择交易员')
        return
      }
      const config = {
        method: isNew ? 'put' : 'post',
        msg: isNew ? '新增成功' : '修改成功',
        url: URL.tradeData
      };
      http[config.method](config.url, {...this.tradeInfo, messageType: config.msg}, () => {
        this.getTradeData()
        this.cancel();
      });
    },
    handleSearch() {
      this.getTradeData()
    },
    // 渲染交易员名称
    renderTradeNames(h, params) {
      const tradeNames = params.row.traders.map(v => v.traderName).join(",");
      const content = tradeNames.length > 100
          ? `${tradeNames.slice(0, 100)}...`
          : tradeNames;
      return h(
          "Tooltip",
          {
            attrs: {
              content: tradeNames,
              maxWidth: 600,
            },
            style: {
              whiteSpace: "nowrap",
            },
          },
          [content]
      );
    },
  },
};
</script>
