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
</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col>
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
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="modalUser('new')">
          <Icon type="md-add"/>
          新增策略
        </Button>
        &nbsp
        <Button type="success" @click="()=>handleExport(URL.ruleExport, this.pagination, '策略管理')"
        >
          导出
        </Button>
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="chooseRule ? 1300 : 600"
            :mask-closable="false"
            :title="isNew ? '新增用户策略' : '编辑用户策略'"
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
                  <FormItem label="策略文件存储位置" prop="rulePath">
                    <Tooltip :content="userStrategyInfo.rulePath" max-width="300" style="width: 100%">
                      <Input
                          disabled
                          v-model="userStrategyInfo.rulePath"
                          placeholder="请输入策略文件存储位置"
                          autocomplete="off"
                          :maxlength="32"
                      ></Input>
                    </Tooltip>
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
                  <FormItem label="用户代码" prop="customerId">
                    <Select
                        v-model="userStrategyInfo.customerId"
                        placeholder="请选择用户代码"
                        :maxlength="32"
                    >
                      <Option
                          v-for="item in userList"
                          :key="item.customerId"
                          :value="item.customerId"
                      >{{ item.customerId }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略类型" prop="ruleType">
                    <Select
                        v-model="userStrategyInfo.ruleType"
                        placeholder="请选择策略类型"
                        :maxlength="32"
                        @on-change="handleShowParamsTable"
                    >
                      <Option
                          v-for="item in getRuleType()"
                          :key="item.code"
                          :value="item.code"
                      >{{ item.description }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="20">
                  <FormItem label="">
                    <input type="file" id="fileInput" style="display: none;"
                           @change="handleFileChange($event,fileType,URL.ruleUpload)">
                    <Button v-show="chooseRule" @click="uploadFile('strategy')" class="btn"
                            style="margin-right: 5px"
                            type="success">
                      <Icon type="md-cloud-upload"/>
                      上传策略文件
                    </Button>
                    <Icon
                        v-show="uploadFlag"
                        type="ios-checkmark-circle"
                        color="green"
                        size="23"/>
                    <div>{{ this.fileName }}</div>
                  </FormItem>
                </Col>
              </Form>
            </div>
            <div class="modal__content-right"
                 v-show="chooseRule"
            >
              <Button @click="uploadFile('param')" class="btn" type="info">
                <Icon type="md-arrow-round-forward"/>
                导入参数列表
              </Button>
              <Button @click="addRow" class="btn" type="success">添加参数</Button>
              <Button @click="clearParamList" class="btn" type="error">清空列表</Button>
              <ParamsTable :paramList="paramList" :readOnly="false"/>
            </div>
          </div>
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
        class="table-content"
        :height="tableHeight"
        size="small"
        ref="table"
        :loading="loading"
        border
        @on-sort-change="e=>handleSort(e,this.getUserStrategyData)"
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
                <DropdownItem name="upload">上传生产</DropdownItem>
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
import {getRuleFileType, getRuleType, handleExport, handleSort} from "@/common/common";
import ParamsTable from "@/components/ParamsTable.vue";
import {tableMixin} from "@/mixins/tableMixin";
import {ruleComponentMixin} from "@/mixins/ruleComponentMixin";

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
        title: "策略文件存储位置",
        key: "rulePath",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 220,
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
        key: "customerId",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
      },
      {
        title: "策略类型",
        key: "ruleType",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 220,
        render: (h, {row}) => {
          const result = getRuleType(row.ruleType, true);
          return h("span", result.description);
        },
      },
      {
        title: "状态",
        key: "active",
        resizable: true,
        width: null,
        minWidth: 120,
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
    };
    return {
      fileName: "",
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
      selectedEnv: null,
    };
  },
  mounted() {
    this.getUserStrategyData();
    this.getUserList();
  },
  methods: {
    // 更多操作
    doOperate(name, row) {
      switch (name) {
        case "param":
          this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
          this.$Modal.info({
            render: (h) => h(ParamsTable, {props: {paramList: this.paramList, readOnly: true}}),
            width: 650, // 设置宽度
            okText: "确认",
          });
          break;
        case "upload":
          this.handleUploadToProduct(row)
          break;
        case "dele":
          this.deleteRow(URL.rule, row.ruleId, '策略', this.getUserStrategyData)
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
              messageType: "上传成功"
            }
            http.post(URL.ruleUploadProduct, data)
          },
          okText: "上传"
        });
      })
    },
    // 获取用户策略列表
    getUserStrategyData() {
      this.loading = true;
      http.post(URL.ruleList, this.pagination, this.getUserResponse);
    },
    // 用户策略代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserStrategyData();
    },
    // 用户策略弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      this.paramList = []
      this.uploadFlag = false
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          id: "",
          ruleId: "",
          rulePath: "",
          ruleVersion: "",
          ruleName: "",
          customerId: "",
          ruleType: "",
          active:true,
          ruleParams: [],
        };
        Object.assign(this.userStrategyInfo, info);
      } else {
        this.chooseRule = row.ruleType === '8'
        this.isNew = false;
        this.showAddModal = true;
        this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
        // 只读下拉框展示需改为字符串类型
        this.paramList.forEach(param => {
          if (param.readOnly === true) {
            param.readOnly = 'true';
          } else if (param.readOnly === false) {
            param.readOnly = 'false';
          }
        });
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
        this.paramList.forEach(param => {
          param.readOnly = param.readOnly === 'true';
          return param;
        });
        this.userStrategyInfo.ruleParams = this.paramList;
        if (!this.userStrategyInfo.rulePath) {
          this.$Message.warning('策略存储路径不能为空')
          return
        }
        const config = {
          method: isNew ? 'put' : 'post',
          msg: isNew ? '新增成功' : '修改成功',
          url: URL.rule
        };
        http[config.method](config.url, {...this.userStrategyInfo, messageType: config.msg}, (res) => {
          if (res.code === '0') {
            this.getUserStrategyData();
            this.cancel();
          }
        });
      }
    },
    // 启用用户策略
    handleActiveEnable(res) {
      if (res.code !== "0") {
        this.$Message.error("启用失败：" + res.msg);
        return;
      }
      this.$Message.success(`用户策略已启用`);
      this.getUserStrategyData();
    },
    // 🈲用用户策略
    handleActiveDisable(res) {
      if (res.code !== "0") {
        this.$Message.error("禁用失败：" + res.msg);
        return;
      }
      this.$Message.error(`用户策略已禁用`);
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
