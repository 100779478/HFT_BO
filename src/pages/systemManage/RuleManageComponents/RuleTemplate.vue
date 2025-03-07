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

.top {
  margin: -10px 5px 5px 5px
}

.progress-content {
  display: flex;
  align-content: center;
}

::v-deep .ivu-table td,
::v-deep .ivu-table th {
  padding-top: 5px !important; /* 调整上边距 */
  padding-bottom: 5px !important; /* 调整下边距 */
  line-height: normal; /* 确保文本的行高正常 */
  height: 12px !important;
}

::v-deep .ivu-table-row-highlight td {
  background-color: #cdcecf !important; /* 自定义选中行的背景色 */
  font-weight: bolder;
}
</style>
<template>
  <div>
    <Row style="margin:-5px 5px 5px 5px" justify="space-between" align="top">
      <Col
          span="14"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 280px)"
      >
        <form autocomplete="off">
          <Input
              v-model="pagination.ruleName"
              style=" width: 120px; border-radius: 20px"
              class="mr-3"
              placeholder="策略名称"
              @on-change="handleSearch"
          />
          <Input
              v-model="pagination.customerId"
              style=" width: 120px; border-radius: 20px"
              class="mr-3"
              placeholder="用户代码"
              @on-change="handleSearch"
          />
          <Select
              v-model="pagination.ruleType"
              class="mr-3"
              style="width: 100px"
              placeholder="策略类型"
              :clearable="true"
              @on-change="handleSearch"
          >
            <Option
                v-for="item in this.$store.state.dictionary.dictionaryList.RuleQuantType"
                :value="item.code"
                :key="item.code"
            >{{ item.description }}
            </Option>
          </Select>
          <Select
              v-model="pagination.active"
              class="mr-3"
              style="width: 100px"
              placeholder="状态"
              :clearable="true"
              @on-change="handleSearch"
          >
            <Option
                v-for="item in activeList"
                :value="item.code"
                :key="item.code"
            >{{ item.description }}
            </Option>
          </Select>
        </form>
      </Col>
      <Col span="" class="mr-3" style="flex-shrink: 0">
        <Button type="primary" @click="handleSearch" class="mr-3">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="info" @click="modalUser('new')" class="mr-3">
          <Icon type="md-add"/>
          新增策略模板
        </Button>
        <Button type="success" @click="()=>handleExport(URL.ruleExportQuant, this.pagination, '策略模板')" class="mr-3">
          <Icon type="md-download"/>
          导出
        </Button>
      </Col>
    </Row>
    <Modal
        v-model="showAddModal"
        draggable
        sticky
        mask
        :width="chooseRule ? 1300 : 600"
        :mask-closable="false"
        :title="isNew ? '新增策略模板' : '编辑策略模板'"
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
                    :maxlength="32"
                    @on-change="fetchNewPolicyInfo"
                    :disabled="!isNew"
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
                    :disabled="!isNew"
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
                <Tooltip :disabled="!userStrategyInfo.ruleLocation" :content="userStrategyInfo.ruleLocation"
                         max-width="300"
                         style="width: 100%;">
                  <Input
                      disabled
                      v-model="userStrategyInfo.ruleLocation"
                      placeholder="请输入策略文件路径"
                      @change="handleChangeRulePath"
                      autocomplete="off"
                      :maxlength="256"
                  />
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
                       @change="handleFileChange($event,fileType,URL.ruleUploadQuant)">
                <div class="progress-content" v-show="chooseRule">
                  <Tooltip>
                    <div slot="content">
                      <p>C++策略文件格式必须为.so</p>
                      <p>Python策略文件格式必须为.zip</p>
                    </div>
                    <Button @click="uploadFile('strategy')" class="btn"
                            style="margin-right: 5px"
                            type="success">
                      <Icon type="md-cloud-upload"/>
                      上传策略文件
                    </Button>
                  </Tooltip>
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
        <Button type="primary" @click="ok(isNew)">确定</Button>
      </div>
    </Modal>
    <Table
        :columns="columns1" style="clear: both"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        size="small"
        ref="table"
        :loading="loading"
        border
        highlight-row
        @on-sort-change="e=>handleSort(e,this.getUserStrategyData)"
        @on-row-click="handleClickRow"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => changeUserStatus(row)" class="table-operate">
            {{ !row.active ? "启用" : "禁用" }}
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
                <DropdownItem name="upload" v-show="row.ruleType==='8'">上传生产</DropdownItem>
                <DropdownItem name="dele" style="color: #ed4014">删除策略</DropdownItem>
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getUserStrategyData)"
            @on-change="e=>handleChangePage('pageNumber',e,getUserStrategyData)"
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
import {ACTIVE_LIST, ERROR_MSG, SUCCESS_MSG} from "@/common/constant";
import {showParamList} from "@/utils/paramList";

export default {
  components: {ParamsTable},
  mixins: [tableMixin, ruleComponentMixin],
  data() {
    let columns1 = [
      {
        title: "策略ID",
        key: "ruleId",
        minWidth: 95,
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
        title: "用户代码",
        key: "customers",
        resizable: true,
        width: null,
        minWidth: 220,
        render: (h, params) => {
          const customerIds = params.row.customers.map(v => v.customerId).join(",");
          const content = customerIds.length > 100
              ? `${customerIds.slice(0, 100)}...`
              : customerIds;
          return h(
              "Tooltip",
              {
                attrs: {
                  content: customerIds,
                  maxWidth: 400,
                  transfer: true,
                },
                style: {
                  // whiteSpace: "nowrap",
                },
              },
              [content]
          );
        },
      },
      {
        title: "策略类型",
        key: "ruleType",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
        render: (h, {row}) => {
          const result = getRuleQuantType(row.ruleType, true);
          return h("span", result.description);
        },
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
        title: "策略状态",
        key: "active",
        resizable: true,
        width: null,
        minWidth: 95,
        sortable: 'custom',
        render: (h, params) => {
          const iconOpen = h("Icon", {
            props: {
              type: "ios-radio-button-on",
              color: "#19be6b",
            },
          });
          const iconClose = h("Icon", {
            props: {
              type: "ios-radio-button-on",
              color: "#ed4014",
            },
          });
          return h("span", [
            params.row.active ? iconOpen : iconClose,
            params.row.active ? "  已启用" : "  已禁用",
          ]);
        },
      },
      {title: "操作", slot: "operator", width: 180},
    ];
    let pagination = {
      ruleName: "",
      ruleType: "",
      customerId: "",
      active: "",
    };
    let userStrategyInfo = {
      customerIds: [],
      ruleFileBytesStr: null
    }
    return {
      activeList: ACTIVE_LIST,
      fileName: "",
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
      selectedEnv: null,
      selectedRowId: null,
      userStrategyInfo,
    };
  },
  mounted() {
    this.getUserStrategyData();
    this.getUserList();
    this.getRuleMonitorNodesList()
  },
  methods: {
    getRuleQuantType,
    handleClickRow(row) {
      this.$store.commit('rule/setRuleId', row)
    },
    calculateTableHeight() {
      return window.innerHeight * 0.245;
    },
    // 更多操作
    doOperate(name, row) {
      switch (name) {
        case "param":
          showParamList.call(this, row)
          break;
        case "upload":
          this.handleUploadToProduct(row)
          break;
        case "dele":
          this.deleteRow(URL.rule, row.ruleId, '量化策略', this.getUserStrategyData)
          break;
        default:
      }
    },
    // 一键上传策略到生产
    handleUploadToProduct(row = {}) {
      const {ruleId} = row
      http.get(URL.envAllProduct, (res) => {
        const options = res.data;
        this.$Modal.confirm({
          render: (h) => h("div", {
            style: {
              display: "flex",
              alignItems: "center", // 垂直居中对齐
              justifyContent: "center", // 水平居中对齐
              height: "100%" // 确保容器占满整个高度
            }
          }, ["上传策略至：",
            h("Select", {
                  props: {
                    placeholder: "请选择环境",
                  },
                  style: {width: '200px'},
                  on: {
                    change: (value) => {
                      this.selectedEnv = value; // 更新绑定的变量
                    }
                  },
                  model: {
                    value: this.selectedEnv,
                    callback: (value) => {
                      this.selectedEnv = value;
                    }
                  }
                }, options.map(option =>
                    h("Option", {
                      props: {value: option.id}
                    }, option.name))
            )
          ]),
          onOk: () => {
            const data = {
              ruleId,
              productEnvId: this.selectedEnv,
              messageType: SUCCESS_MSG.uploadSuccess
            }
            http.post(URL.ruleUploadProduct, data)
          },
          okText: "上传"
        });
      })
    },
    // 获取策略列表
    getUserStrategyData() {
      this.loading = true;
      http.post(URL.ruleList, this.pagination, this.getUserResponse);
    },
    // 策略代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserStrategyData();
    },
    // 策略弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      this.paramList = []
      this.fileName = ""
      this.fileUploadProgress = 0
      this.userStrategyInfo.ruleFileBytesStr = null
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          ruleId: "",
          ruleLocation: "",
          ruleVersion: "",
          ruleName: "",
          ruleFileName: "",
          customerIds: [],
          ruleType: "",
          ruleParams: [],
          ruleNodeName: ""
        };
        Object.assign(this.userStrategyInfo, info);
      } else {
        this.chooseRule = row.ruleType === '8'
        this.isNew = false;
        this.showAddModal = true;
        this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
        // 只读下拉框展示需改为字符串类型
        this.paramList.forEach(param => param.readOnly = String(param.readOnly))
        this.userStrategyInfo.customerIds = row.customers.map(v => v.customerId)
        Object.assign(this.userStrategyInfo, row);
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
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
        // this.paramList.forEach(param => param.readOnly = String(param.readOnly))
        this.userStrategyInfo.ruleParams = this.paramList;
        if (!this.userStrategyInfo.ruleLocation) {
          this.$Message.error(ERROR_MSG.filePathEmpty)
          return
        }
        if (this.userStrategyInfo.ruleFileName.slice(-3) !== '.so' && this.userStrategyInfo.ruleFileType === '0') {
          this.$Message.error(ERROR_MSG.fileTypeCPlusPlus)
          return
        }
        if (this.userStrategyInfo.customerIds.length <= 0) {
          this.$Message.error(ERROR_MSG.userCodeEmpty)
          return
        }
        const config = {
          method: isNew ? 'put' : 'post',
          msg: isNew ? SUCCESS_MSG.addSuccess : SUCCESS_MSG.modifySuccess,
          url: URL.ruleQuant
        };
        http[config.method](config.url, {...this.userStrategyInfo, messageType: config.msg}, (res) => {
          if (res.code === '0') {
            this.getUserStrategyData();
            this.cancel();
          }
        });
      }
    },
    // 启用策略
    handleActiveEnable(res) {
      if (res.code !== "0") {
        this.$Message.error(ERROR_MSG.enableFail + res.msg);
        return;
      }
      this.$Message.success(SUCCESS_MSG.ruleIsActive);
      this.getUserStrategyData();
    },
    // 🈲用策略
    handleActiveDisable(res) {
      if (res.code !== "0") {
        return;
      }
      this.$Message.success(ERROR_MSG.ruleDisabled);
      this.getUserStrategyData();
    },
    changeUserStatus(row) {
      let data = row.ruleId;
      if (!row.active) {
        http.post(`${URL.rule}/${data}/enable`, {}, this.handleActiveEnable);
      } else {
        http.post(`${URL.rule}/${data}/disable`, {}, this.handleActiveDisable);
      }
    },
  },
}
;
</script>
