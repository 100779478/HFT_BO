<style lang="less" scoped>
@import "@/style/manage.less";

.modal__content {
  display: flex;
}

.modal__content-left {
  flex-grow: 0.8; /* 占据60%的空间 */
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
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="chooseRule ? 1300 : 600"
            :mask-closable="false"
            :title=" '编辑用户策略'"
        >
          <div :class="[chooseRule ? 'modal__content' : '']">
            <div class="modal__content-left">
              <Form
                  ref="ruleForm"
                  :model="userStrategyInfo"
                  :label-width="210"
                  label-colon
                  :rules="userValidRules"
                  autocomplete="off"
              >
                <Col :span="18">
                  <FormItem label="策略文件类型" prop="ruleFileType">
                    <Select
                        v-model="userStrategyInfo.ruleFileType"
                        placeholder="请选择策略文件类型"
                        disabled
                        :maxlength="32"
                        @on-change="fetchNewPolicyInfo"
                    >
                      <Option
                          v-for="item in getRuleFileType()"
                          :key="item.code"
                          :value="item.code"
                      >{{ item.description }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略类型" prop="ruleType">
                    <Select
                        v-model="userStrategyInfo.ruleType"
                        placeholder="请选择策略类型"
                        disabled
                        :maxlength="32"
                        @on-change="handleShowParamsTable"
                    >
                      <Option
                          v-for="item in getRuleQuantType()"
                          :key="item.code"
                          :value="item.code"
                      >{{ item.description }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略ID" prop="ruleId">
                    <Input
                        v-model="userStrategyInfo.ruleId"
                        disabled
                        placeholder="请输入策略ID"
                        :maxlength="20"
                        show-message="false"
                    ></Input>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略文件路径" prop="ruleLocation">
                    <Tooltip :content="userStrategyInfo.ruleLocation" max-width="300" style="width: 100%">
                      <Input
                          disabled
                          v-model="userStrategyInfo.ruleLocation"
                          placeholder="请输入策略文件路径"
                          autocomplete="off"
                          :maxlength="256"
                      ></Input>
                    </Tooltip>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略文件名称" prop="ruleFileName">
                    <Input
                        v-model="userStrategyInfo.ruleFileName"
                        :disabled="userStrategyInfo.ruleFileType==='1'"
                        placeholder="c++策略文件名称以.so结尾"
                        autocomplete="off"
                        :maxlength="32"
                    ></Input>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略版本" prop="ruleVersion">
                    <Input
                        v-model="userStrategyInfo.ruleVersion"
                        placeholder="请输入策略版本"
                        autocomplete="off"
                        :maxlength="32"
                    ></Input>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略名称" prop="ruleName">
                    <Input
                        v-model="userStrategyInfo.ruleName"
                        placeholder="请输入策略名称"
                        autocomplete="off"
                        :maxlength="32"
                    ></Input>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="用户代码" prop="customerIds">
                    <Select
                        v-model="userStrategyInfo.customerIds"
                        placeholder="请选择用户代码"
                        :maxlength="32"
                        multiple
                        filterable
                        :max-tag-count="1"
                    >
                      <Option
                          v-for="item in userList"
                          :key="item.customerId"
                          :value="item.customerId"
                      >{{ item.customerId + `(${item.customerName})` }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略服务节点名称" prop="ruleNodeName">
                    <Select
                        v-model="userStrategyInfo.ruleNodeName"
                        placeholder="请选择策略服务节点"
                        :maxlength="32"
                    >
                      <Option
                          v-for="item in ruleMonitorNodes"
                          :key="item.ruleNodeName"
                          :value="item.ruleNodeName"
                      >{{ item.ruleNodeName }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="20">
                  <FormItem label="">
                    <input type="file" id="fileInput" style="display: none;"
                           @change="handleFileChange($event,fileType,URL.uploadVetting)">
                    <div class="progress-content" v-show="chooseRule">
                      <Button @click="uploadFile('strategy')" class="btn"
                              style="margin-right: 5px"
                              type="success">
                        <Icon type="md-cloud-upload"/>
                        上传策略文件
                      </Button>
                      <Circle v-if="fileUploadProgress" :percent="fileUploadProgress-1"
                              :size="30"
                              :stroke-color="'#19be6b'"
                              :trail-width="10"
                              :stroke-width="13"
                      >
                        <Icon v-if="this.fileName" type="ios-checkmark" size="25"
                              style="font-weight: bold;color: #19be6b"></Icon>
                        <span v-else class="demo-Circle-inner"
                              style="font-size:11px">{{ fileUploadProgress - 1 }}%</span>
                      </Circle>
                    </div>
                    <div style="height: 20px">
                      {{ this.fileName }}
                    </div>
                  </FormItem>
                </Col>
              </Form>
            </div>
            <div class="modal__content-right"
                 v-show="chooseRule"
            >
              <Button @click="uploadFile('param')" class="btn" type="info">导入参数</Button>
              <Button @click="addRow" class="btn" type="success">添加参数</Button>
              <Button @click="clearParamList" class="btn" type="error">清空列表</Button>
              <Button @click="exportParamList" class="btn" type="primary">导出参数</Button>
              <ParamsTable :paramList="paramList" :readOnly="false"/>
            </div>
          </div>
          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="ok()">确定</Button>
          </div>
        </Modal>
      </Col>
    </Row>
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

export default {
  components: {ParamsTable},
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
      {title: "操作", slot: "operator", width: 180},
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
      this.$refs.ruleForm.resetFields();
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
        this.showMessage(message, 'error', 6)
      } else {
        // 没有重复的 name 字段，执行提交操作
        // 将 paramList 中的 readOnly 属性值从字符串转换为布尔值
        // this.paramList.forEach(param => param.readOnly = String(param.readOnly));
        this.userStrategyInfo.ruleParams = this.paramList;
        if (!this.userStrategyInfo.ruleLocation) {
          this.$Message.warning(ERROR_MSG.storagePathEmpty)
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
