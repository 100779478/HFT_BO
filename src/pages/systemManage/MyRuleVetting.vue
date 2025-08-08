<style lang="less" scoped>
@import "@/style/manage.less";

.modal__content {
  display: flex;
}

.modal__content-left {
  //flex-grow: 0.8; /* 占据60%的空间 */
  margin-right: 30px;
  /* 其他样式，如宽度、背景等 */
}

.ivu-select-dropdown {
  z-index: 1000; /* 调整为合适的层叠顺序值 */
}

.modal__content-right {
  //flex-grow: 0.4; /* 占据40%的空间，但这不是必需的，因为默认就是剩余空间 */
  /* 其他样式，如宽度、背景等 */

  .btn {
    color: white;
    font-weight: bold;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

.progress-content {
  display: flex;
  align-content: center;
}
</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col class="mr-3">
        <form autocomplete="off">
          <Input
              v-model="pagination.ruleName"
              style="float: right; width: 180px; border-radius: 20px"
              placeholder="策略名称"
              @on-keydown.enter="handleSearch"
              @on-change="handleSearch"
          >
            <Icon
                type="ios-search"
                slot="suffix"
                size="19"
                @click.native="handleSearch"
                style="cursor: pointer"
            />
          </Input>
          <Select
              v-model="pagination.ruleVettingStatus"
              class="mr-3"
              style="width: 100px"
              placeholder="审批状态"
              :clearable="true"
          >
            <Option
                v-for="item in this.$store.state.dictionary.dictionaryList.RuleVettingStatus"
                :value="item.code"
                :key="item.code"
            >{{ item.description }}
            </Option>
          </Select>
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="primary" @click="refresh()" class="mr-3">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="success" @click="()=>handleExport(URL.myVettingExport, this.pagination, '我的策略申请')"
                class="mr-3">
          <Icon type="md-download"/>
          导出
        </Button>
      </Col>
    </Row>
    <RuleModal
        ref="ruleModal"
        :visible="showAddModal"
        :chooseRule="chooseRule"
        :isNew="false"
        :userStrategyInfo="userStrategyInfo"
        :userValidRules="userValidRules"
        :paramList="paramList"
        :userList="userList"
        :ruleMonitorNodes="ruleMonitorNodes"
        :btnLoading="btnLoading"
        :fileName="fileName"
        :fileUploadProgress="fileUploadProgress"
        @cancel="cancel"
        @confirm="ok(false)"
        @upload-param="uploadFile('param')"
        @add-param="addRow"
        @clear-param="clearParamList"
        @export-param="exportParamList"
        @upload-strategy="uploadFile('strategy')"
        @file-change="handleFileChange($event, fileType, URL.ruleUploadQuant)"
        @change-rule-path="handleChangeRulePath"
        @fetch-new-policy="fetchNewPolicyInfo"
        @show-params-table="handleShowParamsTable"
    />
    <Table
        :columns="columns1"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        size="small"
        ref="table"
        :loading="loading"
        border
        @on-sort-change="e=>handleSort(e,this.getMyVettingList)"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => handleCancelVetting(row)" class="table-operate">
            撤销
          </div>
          <Dropdown
              trigger="hover"
              transfer
              @on-click="doOperate($event, row)"
          >
            <a style="color: #02aff1; font-size: 14px">
              {{ "更多" }}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <template v-slot:list>
              <DropdownMenu>
                <DropdownItem name="param">策略参数</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getMyVettingList)"
            @on-change="e=>handleChangePage('pageNumber',e,getMyVettingList)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getRuleFileType, getRuleQuantType} from "@/common/common";
import ParamsTable from "@/components/ParamsTable.vue";
import {tableMixin} from "@/mixins/tableMixin";
import {ruleComponentMixin} from "@/mixins/ruleComponentMixin";
import {showParamList} from "@/utils/paramList";
import {renderRuleApprovalStatus} from "@/utils/renderRuleApprovalStatus";
import {ERROR_MSG, SUCCESS_MSG} from "@/common/constant";
import RuleModal from "./RuleManageComponents/QuantifyManage-complex/RuleTemplate-complex/RuleModal.vue";
import showMessage from "@/utils/message";

export default {
  components: {ParamsTable, RuleModal},
  mixins: [tableMixin, ruleComponentMixin],
  data() {
    let columns1 = [
      {
        title: "策略ID",
        key: "ruleId",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "策略文件类型",
        key: "ruleFileType",
        minWidth: 140,
        resizable: true,
        width: null,
        sortable: 'custom',
        render: (h, {row}) => {
          const result = getRuleFileType(row.ruleFileType, true);
          return h("span", result.description);
        },
      },
      {
        title: "策略文件路径",
        key: "ruleLocation",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 220,
      },
      {
        title: "策略文件名称",
        key: "ruleFileName",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 140,
      },
      {
        title: "策略版本",
        key: "ruleVersion",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "策略名称",
        key: "ruleName",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "策略服务节点名称",
        key: "ruleNodeName",
        resizable: true,
        width: null,
        minWidth: 160,
      },
      {
        title: "策略服务节点Ip",
        key: "ruleNodeIp",
        resizable: true,
        width: null,
        minWidth: 160,
      },
      {
        title: "申请时间",
        key: "submissionTime",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 170,
      },
      {
        title: "审批人",
        key: "approvalName",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "审批时间",
        key: "approvalTime",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "策略状态",
        key: "ruleVettingStatus",
        resizable: true,
        width: null,
        minWidth: 120,
        sortable: 'custom',
        render: renderRuleApprovalStatus
      },
      {
        title: "备注",
        key: "comment",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 180,
      },
      {title: "操作", slot: "operator", width: 180, fixed: 'right'},
    ];
    let pagination = {
      ruleVettingStatus: '',
      ruleName: ""
    };
    let userStrategyInfo = {
      customerIds: [],
      ruleFileBytesStr: null
    }
    return {
      pagination,
      columns1,
      btnLoading: false,
      showAddModal: false,
      fileName: "",
      userStrategyInfo
    };
  },
  mounted() {
    this.getMyVettingList();
    this.getUserList();
    this.getRuleMonitorNodesList()
  },
  methods: {
    getRuleQuantType,
    // 更多操作
    doOperate(name, row) {
      switch (name) {
        case "param":
          showParamList.call(this, row)
          break;
        default:
      }
    },
    // 获取用户策略列表
    getMyVettingList() {
      this.loading = true;
      http.post(URL.myVetting, this.pagination, this.getUserResponse);
    },
    // 用户策略代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getMyVettingList();
    },
    // 用户策略弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleModal.resetFormFields();
      this.paramList = []
      this.chooseRule = row.ruleType === '8'
      this.fileName = ""
      this.fileUploadProgress = 0
      this.userStrategyInfo.ruleFileBytesStr = null
      this.showAddModal = true;
      this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
      // 只读下拉框展示需改为字符串类型
      this.paramList.forEach(param => param.readOnly = String(param.readOnly));
      this.userStrategyInfo.customerIds = row.customers.map(v => v.customerId)
      Object.assign(this.userStrategyInfo, row);
    },
    // 新增弹窗确认按键
    ok() {
      // 检查重复的 name 字段
      const duplicateNames = this.checkDuplicateNames(this.paramList);
      if (duplicateNames.length > 0) {
        const messages = duplicateNames.map(({name, count}) => `${name} 有${count}条`);
        const message = `参数名重复：${messages.join('、')}`;
        // 有重复的 name 字段，显示警告消息
        showMessage(message, {type: "error"})
      } else {
        // 校验 range 格式和值合法性
        const invalidParams = [];
        this.paramList.forEach((param, index) => {
          if (param.type === '4' && !param.range) {
            invalidParams.push(`第${index + 1}行参数“${param.name}”的范围格式非法`)
          }
          if (param.type === '2' || param.type === '1') {
            const range = param.range?.toString().trim();
            const value = param.value?.toString().trim();

            if (!this.validateRangeFormat(range)) {
              range && invalidParams.push(`第${index + 1}行参数“${param.name}”的范围格式非法`);
            } else if (!this.checkValueInRange(value, range)) {
              value && invalidParams.push(`第${index + 1}行参数“${param.name}”的默认值不在范围内`);
            } else if (range.includes(' ')) {
              invalidParams.push(`第${index + 1}行参数“${param.name}”的参数范围不允许包含空格`)
            }
          }
        });

        if (invalidParams.length > 0) {
          showMessage(invalidParams.join('；'), {type: "error"})
          return;
        }

        // 没有重复的 name 字段，执行提交操作
        // 将 paramList 中的 readOnly 属性值从字符串转换为布尔值
        // this.paramList.forEach(param => param.readOnly = String(param.readOnly));
        this.userStrategyInfo.ruleParams = this.paramList;
        if (!this.userStrategyInfo.ruleLocation) {
          showMessage(ERROR_MSG.storagePathEmpty, {type: 'warning'})
          return
        }
        http.post(URL.updateVetting, {...this.userStrategyInfo, messageType: SUCCESS_MSG.modifySuccess}, (res) => {
          if (res.code === '0') {
            this.getMyVettingList();
            this.cancel();
          }
        });
      }
    },
    // 撤销审批策略
    handleCancelVetting(row) {
      let ruleId = row.ruleId;
      http.post(`${URL.cancelVetting}`, {ruleId, messageType: SUCCESS_MSG.revokeSuccess}, this.getMyVettingList);
    },
    // 刷新
    refresh() {
      this.getMyVettingList();
      this.getUserList();
    },
  },
}
;
</script>
