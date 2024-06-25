<style lang="less" scoped>
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Modal
          v-model="showAddModal"
          draggable
          sticky
          mask
          :width="600"
          :mask-closable="false"
          :title="'策略审批'"
          :loading="loading"
      >
        <Form
            ref="ruleForm"
            :model="ruleApproval"
            :label-width="180"
            label-colon
            autocomplete="off"
            :rules="ruleApprovalValid"
        >
          <Col :span="18">
            <FormItem label="策略ID" prop="ruleId">
              <Input
                  v-model="ruleApproval.ruleId"
                  placeholder="请输入策略ID"
                  :maxlength="20"
                  show-message="false"
              ></Input>
            </FormItem>
            <FormItem label="策略名称" prop="ruleName">
              <Input
                  v-model="ruleApproval.ruleName"
                  placeholder="请输入策略名称"
                  :maxlength="20"
                  show-message="false"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="用户账号" prop="customerId">
              <Input
                  v-model="ruleApproval.customerId"
                  placeholder="请输入用户账号"
                  :maxlength="20"
                  show-message="false"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="申请备注" prop="remark">
              <Input
                  v-model="ruleApproval.remark"
                  placeholder="请输入申请备注"
                  :maxlength="20"
                  show-message="false"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="审批意见" prop="nnnn">
              <Input
                  v-model="ruleApproval.nnnn"
                  placeholder="请填写审批意见"
                  :maxlength="20"
                  show-message="false"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="审批备注" prop="auditMsg">
              <Input
                  v-model="ruleApproval.auditMsg"
                  placeholder="请填写审批备注"
                  show-message="false"
                  :autosize="true"
                  type="textarea"
              ></Input>
            </FormItem>
          </Col>
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="ok(isNew)">确定</Button>
        </div>
      </Modal>
      <Col
          span="19"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <Select
            v-model="pagination.operatingLogType"
            class="mr3"
            style="width: 100px"
            placeholder="审批状态"
            :clearable="true"
        >
          <Option
              v-for="item in this.$store.state.dictionaryList.OperatingLogType"
              :value="item.code"
              :key="item.code"
          >{{ item.description }}
          </Option
          >
        </Select>
      </Col>
      <Col style="position:absolute;right: 25px">
        <Button type="info" @click="refresh()"
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
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => handleRuleApproval( row)" class="table-operate">
            审批
          </div>
          <div @click="() => downloadRuleApproval(row)" class="table-operate">
            下载
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
import {handleSort, handleExport} from "@/common/common";

export default {
  data() {
    let columns1 = [
      {
        title: "策略ID",
        key: "ruleId",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom'
      },
      {
        title: "策略名称",
        key: "ruleName",
        minWidth: 120,
        resizable: true,
        width: null,
        sortable: 'custom'
      },
      {
        title: "审批状态",
        key: "auditStatus",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "用户代码",
        key: "customerId",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "申请时间",
        key: "insertTime",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "审批时间",
        key: "auditTime",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "申请备注",
        key: "remark",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "审批备注",
        key: "auditMsg",
        minWidth: 120,
        resizable: true,
        width: null,
      },
      {
        title: "操作",
        slot: "operator",
        width: null,
        minWidth: 120,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      sort: 'asc',
      sortField: '',
      operatingLogType: '',
    };
    let ruleApprovalValid = {
      // ruleId: [{required: true, message: "请填写策略ID"}],
    }
    return {
      ruleApprovalValid,
      ruleApproval: {ruleId: ''},
      loading: true,
      tableHeight: window.innerHeight - 220,
      tableData: [],
      columns1,
      pagination,
      showAddModal: false
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getOperatingLog();
  },
  methods: {
    handleSort,
    // 获取操作日志列表
    getOperatingLog() {
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
      this.loading = true;
      this.getOperatingLog();
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getOperatingLog();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getOperatingLog();
    },
    // 审批策略
    handleRuleApproval(row) {
      this.$refs.ruleForm.resetFields();
      this.showAddModal = true;
    },
    // 导出列表
    handleExportLog() {
      handleExport(URL.logExport, this.pagination, "策略审批")
    },
  },
};
</script>
