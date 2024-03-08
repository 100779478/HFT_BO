<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
}

.page-bottom {
  float: right;
  margin-top: 20px;
}

.modal__content {
  display: flex;
}

.modal__content-left {
  flex-grow: 0.5; /* 占据60%的空间 */
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

.table-content {
  //border: -5px solid #e8eaec;

  .table-operate {
    font-size: 14px;
    color: rgb(2, 175, 241);
    margin-right: 6px;
    cursor: pointer;
  }
}

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col span="8">
        <Button type="info" @click="modalUser('new')"
        >
          <Icon type="md-add"/>
          新增用户策略
        </Button
        >
        &nbsp;
        <Button type="success" @click="refresh()"
        >
          <Icon type="md-refresh"/>
          刷新
        </Button
        >
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="chooseRule ? 1600 : 600"
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
                        :maxlength="16"
                        show-message="false"
                    ></Input>
                  </FormItem>
                </Col>
                <Col :span="18">
                  <FormItem label="策略文件存储位置" prop="rulePath">
                    <Input
                        disabled
                        v-model="userStrategyInfo.rulePath"
                        placeholder="请输入策略文件存储位置"
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
                           @change="handleFileChange($event,fileType)">
                    <Button @click="uploadFile('strategy')" class="btn" style="margin-right: 5px"
                            type="success">
                      <Icon type="md-cloud-upload"/>
                      上传策略文件
                    </Button>
                    <Icon
                        v-show="uploadFlag"
                        type="ios-checkmark-circle"
                        color="green"
                        size="23"/>
                  </FormItem>
                </Col>
                <!--            <Col :span="18">-->
                <!--              <FormItem label="状态" prop="active">-->
                <!--                <i-Switch-->
                <!--                    v-model="userStrategyInfo.active"-->
                <!--                    style="margin-top: 5px"-->
                <!--                />-->
                <!--              </FormItem>-->
                <!--            </Col>-->
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
              <Table
                  :columns="columns2"
                  :data="paramList"
                  :width="1027"
                  class="table-content"
                  style="position: unset"
                  :height="450"
                  size="small"
                  ref="table2"
                  :loading="loading"
              >
                <template slot="operator" slot-scope="{ row }">
                  <div @click.stop style="display: flex; justify-content: flex-start">
                    <div @click="() => deleteParams(row)" class="table-operate">
                      删除
                    </div>
                  </div>
                </template>
              </Table>
            </div>
          </div>
          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="ok(isNew)">确定</Button>
          </div>
        </Modal>
      </Col>
      <Col span="8" offset="8">
        <Input
            v-model="pagination.ruleId"
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
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => changeUserStatus(row)" class="table-operate">
            {{ !row.active ? "启用" : "禁用" }}
          </div>
          <!--          <div @click="() => deleteStrategy(row)" class="table-operate">-->
          <!--            删除-->
          <!--          </div>-->
          <Dropdown
              trigger="hover"
              transfer
              @on-click="doOperate($event, row)"
          >
            <a style="color: #02aff1; font-size: 14px">
              {{ "更多" }}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="param">策略参数</DropdownItem>
              <DropdownItem name="dele" style="color: #ed4014"
              >删除用户
              </DropdownItem
              >
            </DropdownMenu>
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
import {getRuleFileType, getRuleType, handleSort, RulePropType} from "@/common/common";

export default {
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
    let columns2 = [
      {
        title: "参数名",
        key: "name",
        width: 150,
        render: this.renderEditable
      },
      {
        title: "参数描述",
        key: "description",
        width: 130,
        render: this.renderEditable
      },
      {
        title: "参数类型",
        key: "type",
        width: 150,
        render: this.renderSelectCell,
        renderHeader: (h, params) => {
          return h('span', [
            params.column.title,
            h('Tooltip', {
              props: {
                content: 'tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent',
                transfer: true,
                maxWidth: 300,
              },
            }, [
              h('Icon', {props: {type: 'md-alert'}})
            ])
          ]);
        }
      },
      {
        title: "参数默认值",
        key: "value",
        width: 150,
        render: this.renderEditable
      },
      {
        title: "参数分组",
        key: "group",
        width: 150,
        render: this.renderEditable
      },
      {
        title: "输入值范围",
        key: "range",
        width: 110,
        render: this.renderEditable,
        renderHeader: (h, params) => {
          return h('span', [
            params.column.title,
            h('Tooltip', {
              props: {
                content: 'tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,',
                transfer: true,
                maxWidth: 300,
              },
            }, [
              h('Icon', {props: {type: 'md-alert'}})
            ])
          ]);
        },
      },
      {
        title: "只读",
        key: "readOnly",
        width: 100,
        render: this.renderSelectCell
      },
      {title: "操作", slot: "operator", width: 80},
    ]
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      ruleId: "",
      sort: 'asc',
      sortField: ''
    };
    return {
      loading: true,
      fileType: '',
      uploadFlag: false,
      tableHeight: window.innerHeight - 220,
      chooseRule: false,
      userValidRules: {
        // username: [{ required: true, message: "请输入用户策略账号" }],
        // customerName: [{ required: true, message: "请输入用户策略名称" }],
        // // password: [{ required: true, message: "请输入密码" }],
        // roles: [{ required: false, message: "请选择用户策略角色" }],
      },
      userStrategyInfo: {
        ruleFileType: "",
        ruleId: "",
        rulePath: "",
        ruleVersion: "",
        ruleName: "",
        customerId: "",
        ruleType: "",
        ruleParams: [],
      },
      tableData: [],
      paramList: [
        {
          name: "account id",
          description: "分账户",
          type: 3,
          value: "testgy_sim01",
          group: "account",
          range: '100',
          readOnly: 'true'
        },
      ],
      columns1,
      columns2,
      pagination,
      showAddModal: false,
      isNew: true,
      userList: [],
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getUserStrategyData();
    this.getUserList();
  },
  methods: {
    // 更多操作
    doOperate(name, row) {
      switch (name) {
        case "param":
          this.$Modal.info({
            content: "<p>此操作不可逆</p>",
            okText: "确认",
          });
          break;
        case "dele":
          this.$Modal.confirm({
            title: `确认删除用户吗？`,
            content: "<p>此操作不可逆</p>",
            onOk: () => {
              this.deleteStrategy(row);
            },
            okText: "删除",
          });
          break;
        default:
      }
    },
    // 清空参数列表
    clearParamList() {
      this.paramList = []
    },
    // 删除参数列表
    deleteParams(row) {
      // 获取点击行的索引
      const rowIndex = row._index;
      // 根据点击行的索引找到 paramList 中对应索引的元素
      const paramIndex = rowIndex >= 0 && rowIndex < this.paramList.length ? rowIndex : -1;
      if (paramIndex !== -1) {
        // 如果找到匹配的元素，则执行删除操作
        this.paramList.splice(paramIndex, 1);
      }
    },
    // 添加一行参数列表
    addRow() {
      this.paramList.push({
        name: "",
        description: "",
        type: "",
        value: "",
        group: "",
        range: "",
        readOnly: ""
      },);
    },
    handleFileChange(event, type) {
      const file = event.target.files[0];
      const url = type === 'strategy' ? `${URL.ruleUpload}/${this.userStrategyInfo.ruleId}` : URL.ruleConfig
      if (file) {
        // 执行上传操作，你可以调用相应的上传方法，比如 http.uploadFile
        console.log('选择的文件：', file, event);
        // TODO: 调用上传操作的代码
        http.uploadFile(url, file, {},
            (response) => {
              this.$Message.success('上传成功')
              if (type === 'param') {
                this.paramList = this.paramList.concat(response.data)
              } else {
                this.uploadFlag = true
              }
            },
            (error) => {
              this.$Message.error('上传失败')
            }
        );
        document.getElementById('fileInput').value = ''
      }
    },
    // 上传策略或参数文件
    uploadFile(type) {
      this.fileType = type
      // 获取文件输入元素
      const fileInput = document.getElementById('fileInput');
      fileInput.click()
    },
    // 新建策略时获取策略ID及存储位置
    fetchNewPolicyInfo() {
      http.get(URL.ruleIdPath, (response) => {
        const {ruleId, rulePath} = response.data;
        this.userStrategyInfo.ruleId = ruleId;
        this.userStrategyInfo.rulePath = rulePath;
      })
    },
    getRuleFileType,
    getRuleType,
    handleSort,
    // 获取用户策略列表
    getUserStrategyData() {
      http.post(URL.ruleList, this.pagination, this.getUserResponse);
    },
    getUserResponse(res) {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
      // this.paramList = res.data.dataList || [];
    },
    // 获取用户代码
    getUserList() {
      http.get(URL.userList, (res) => {
        this.userList = res.data;
      });
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getUserStrategyData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getUserStrategyData();
    },
    // 用户策略代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserStrategyData();
    },
    handleShowParamsTable(e) {
      this.chooseRule = e === '2';
    },
    // 用户策略弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      this.paramList = []
      this.uploadFlag = false
      if (type === "new") {
        this.fetchNewPolicyInfo()
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
          ruleParams: [],
        };
        Object.assign(this.userStrategyInfo, info);
      } else {
        this.chooseRule = row.ruleType === '2'
        this.isNew = false;
        this.showAddModal = true;
        // this.paramList = row.ruleParams
        this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
        Object.assign(this.userStrategyInfo, row);
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (isNew) {
        http.put(URL.rule, this.userStrategyInfo, () => {
          this.getUserStrategyData()
          this.cancel();
        });
      } else {
        this.userStrategyInfo.ruleParams = this.paramList
        http.post(URL.rule, this.userStrategyInfo, () => {
          this.getUserStrategyData()
          this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
      this.paramList = []
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
    deleteStrategy(row) {
      // this.$Modal.confirm({
      //   title: `确认删除用户策略吗？`,
      //   content: "<p>此操作不可逆</p>",
      //   onOk: () => {
      http.delete(`${URL.rule}/${row.ruleId}?customerId=${row.customerId}`, {}, () => {
        this.getUserStrategyData();
        //     });
        //   },
        //   okText: "删除",
      });
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getUserStrategyData();
      this.getUserList();
    },
    // 渲染table列表
    renderEditable(h, params) {
      const {row, column} = params;
      const rowIndex = row._index;
      return h("Input", {
        props: {
          value: row[column.key].toString(),
        },
        on: {
          input: (event) => {
            // row[column.key] = event;
            // 动态绑定对应行的key-value
            this.paramList[rowIndex][column.key] = event
          },
        },
      });
    },
    renderSelectCell(h, params) {
      const {row, column} = params;
      const rowIndex = row._index;
      return h("Select",
          {
            props: {
              value: row[column.key].toString(),
            },
            on: {
              input: (event) => {
                // 动态绑定对应行的key-value
                this.paramList[rowIndex][column.key] = event
              },
            },
          },
          this.renderSelectOptions(h, column.key)
      )
    },
    renderSelectOptions(h, column) {
      const readList = [
        {code: "true", description: '是'},
        {code: "false", description: '否'},
      ]
      const options = column === 'type' ? RulePropType() : readList;
      // 这里你可以根据需要动态生成 Options，例如从数据中获取选项列表
      return options.map((option) => {
        return h("Option", {
          props: {
            value: option.code,
            label: option.description,
          },
        });
      });
    },
  },
}
;
</script>
