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
      <Col class="mr3">
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
      <Col span="19" style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)">
        <Select
            v-model="pagination.ruleVettingStatus"
            class="mr3"
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
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="refresh()" style="margin-right: 5px">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="success" @click="()=>handleExport(URL.ruleExport, this.pagination, '我的审批')"
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
                    <Button v-show="userStrategyInfo.ruleType==='8'" @click="uploadFile('strategy')" class="btn"
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
import {getRuleFileType, getRuleType, getRuleVettingStatus, handleExport, handleSort} from "@/common/common";
import ParamsTable from "@/components/ParamsTable.vue";

export default {
  components: {ParamsTable},
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
        key: "ruleVettingStatus",
        resizable: true,
        width: null,
        minWidth: 120,
        sortable: 'custom',
        render: (h, params) => {
          const colorList = ["#dcba0e", "#19be6b", "#ed4014", "#616261"]
          const statusInfo = getRuleVettingStatus(params.row.ruleVettingStatus)
          const createIcon = (code) => {
            return h("Icon", {
              props: {
                type: "ios-radio-button-on",
                color: colorList[code],
              },
            });
          };
          return h("span", [
            createIcon(statusInfo.code - 1),
            statusInfo.description,
          ]);
        },
      },
      {title: "操作", slot: "operator", width: 180},
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      sort: 'asc',
      sortField: '',
      ruleVettingStatus: '',
      ruleName: ""
    };
    return {
      loading: true,
      fileType: '',
      rulePath: '',
      uploadFlag: false,
      tableHeight: window.innerHeight - 220,
      chooseRule: false,
      userValidRules: {},
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
      pagination,
      showAddModal: false,
      userList: [],
      URL
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getMyVettingList();
    this.getUserList();
  },
  methods: {
    handleExport,
    // 更多操作
    doOperate(name, row) {
      switch (name) {
        case "param":
          this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
          this.$Modal.info({
            render: (h) => h(ParamsTable, {props: {paramList: this.paramList, readOnly: true}}),
            width: 1100, // 设置宽度
            okText: "确认",
          });
          break;
        default:
      }
    },
    // 清空参数列表
    clearParamList() {
      this.paramList = []
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
        readOnly: "false"
      },);
    },
    // 检查重复的 name 字段的函数
    checkDuplicateNames(paramList) {
      const nameCountMap = {};
      const duplicateNames = [];
      paramList.forEach((param) => {
        const name = param.name;
        nameCountMap[name] = (nameCountMap[name] || 0) + 1;
      });
      // 过滤出出现超过一次的名称
      Object.keys(nameCountMap).forEach((name) => {
        if (nameCountMap[name] > 1) {
          duplicateNames.push({name, count: nameCountMap[name]});
        }
      });
      return duplicateNames;
    },
    handleFileChange(event, type) {
      // 获取用户选择的文件
      const file = event.target.files[0];
      if (file) {
        // 根据 type 判断处理逻辑
        if (type === 'strategy') {
          // 使用注释逻辑
          const url = `${URL.uploadVetting}/${this.userStrategyInfo.ruleId}`;
          // 执行上传操作，你可以调用相应的上传方法，比如 http.uploadFile
          console.log('选择的文件：', file, event);
          // TODO: 调用上传操作的代码
          http.uploadFile(url, file, {},
              (response) => {
                this.$Message.success('上传成功');
                // 处理上传成功后的逻辑
              },
              (error) => {
                this.$Message.error('上传失败');
                // 处理上传失败后的逻辑
              }
          );
          document.getElementById('fileInput').value = '';
        } else {
          // 使用处理 JSON 文件的逻辑
          // 检查文件类型是否为 JSON
          if (file.type === 'application/json') {
            // 创建一个 FileReader 对象
            const reader = new FileReader();
            // 为文件加载完成时触发的事件注册处理程序
            reader.onload = (event) => {
              try {
                // event.target.result 包含文件内容，这里假设文件内容是 JSON 格式的
                const jsonContent = JSON.parse(event.target.result).param;
                // 检查重复的 name 字段
                const duplicateNames = this.checkDuplicateNames(jsonContent);
                if (duplicateNames.length > 0) {
                  const messages = duplicateNames.map(({name, count}) => `${name} 有${count}条`);
                  const message = `参数名重复：${messages.join('、')}`;
                  // 有重复的 name 字段，显示警告消息
                  this.showMessage(message, 'error', 6)
                } else {
                  // 没有重复的 name 字段，显示成功消息
                  this.$Message.success('导入参数列表成功');
                }
                // 更新 paramList
                this.paramList = jsonContent;
              } catch (error) {
                this.$Message.error('导入参数列表失败');
                console.error('读取 JSON 文件时发生错误：', error);
              }
            };
            // 开始读取文件，以文本格式读取
            reader.readAsText(file);
          } else {
            // 文件不是 JSON 类型，进行相应的处理
            this.$Message.error('选择的文件不是 JSON 文件');
          }
        }
      }
      // 在上传后添加以下代码
      document.getElementById('fileInput').value = '';
    }
    ,
    // 上传策略或参数文件
    uploadFile(type) {
      this.fileType = type
      // 获取文件输入元素
      const fileInput = document.getElementById('fileInput');
      fileInput.click()
    },
    // 新建策略时获取策略ID及存储位置
    fetchNewPolicyInfo(code) {
      if (code) {
        http.get(`${URL.ruleIdPath}?type=${code}`, (response) => {
          const {ruleId, rulePath} = response.data;
          this.userStrategyInfo.ruleId = ruleId;
          this.rulePath = rulePath
          this.userStrategyInfo.rulePath = rulePath;
        })
      }
    },
    getRuleFileType,
    getRuleType,
    handleSort,
    // 获取用户策略列表
    getMyVettingList() {
      http.post(URL.myVetting, this.pagination, this.getUserResponse);
    },
    getUserResponse(res) {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
    },
    // 获取用户代码
    getUserList() {
      http.get(URL.userList, (res) => {
        this.userList = res.data;
      });
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getMyVettingList();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getMyVettingList();
    },
// 用户策略代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getMyVettingList();
    },
    handleShowParamsTable(e) {
      this.chooseRule = e === '8';
      switch (e) {
          // 0 银行间双边做市策略-->./Rules/libMM_strategy.so
          // 1 银行间指示性报价策略->./Rules/indicative_strategy.so
          // 3 交易所新债平台做市策略-->./Rules/libmm_strategy_rate.so
          // 4 交易所固收平台做市策略-->./Rules/libmm_strategy_fi.so
        case '0':
          this.userStrategyInfo.rulePath = './Rules/libMM_strategy.so'
          break
        case '1':
          this.userStrategyInfo.rulePath = './Rules/indicative_strategy.so'
          break
        case '3':
          this.userStrategyInfo.rulePath = './Rules/libmm_strategy_rate.so'
          break
        case '4':
          this.userStrategyInfo.rulePath = './Rules/libmm_strategy_fi.so'
          break
        default:
          this.userStrategyInfo.rulePath = this.rulePath || this.userStrategyInfo.rulePath
          break
      }
    },
    // 用户策略弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      this.paramList = []
      this.uploadFlag = false
      this.chooseRule = row.ruleType === '8'
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
        this.paramList.forEach(param => {
          if (param.readOnly === 'true') {
            param.readOnly = true;
          } else if (param.readOnly === 'false') {
            param.readOnly = false;
          }
        });
        this.userStrategyInfo.ruleParams = this.paramList;
        if (!this.userStrategyInfo.rulePath) {
          this.$Message.warning('策略存储路径不能为空')
          return
        }
        http.post(URL.updateVetting, {...this.userStrategyInfo, messageType: '修改成功'}, (res) => {
          if (res.code === '0') {
            this.getMyVettingList();
            this.cancel();
          }
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
      this.paramList = []
    },
    // 撤销审批策略
    handleCancelVetting(row) {
      let ruleId = row.ruleId;
      http.post(`${URL.cancelVetting}`, {ruleId, messageType: "撤销成功"}, this.getMyVettingList);
    },
    // 公共方法：显示消息提示
    showMessage(content, type = 'info', duration = 6) {
      this.$Message[type]({
        content,
        duration,
      });
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getMyVettingList();
      this.getUserList();
    },
  },
}
;
</script>
