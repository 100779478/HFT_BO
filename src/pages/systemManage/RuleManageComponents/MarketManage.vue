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
</style>
<template>
  <div>
    <Row style="margin: 0 3px 0 3px">
      <Col>
        <form autocomplete="off" class="top">
          <Input
              v-model="pagination.ruleFileName"
              style=" width: 120px; border-radius: 20px"
              class="mr-3"
              placeholder="策略文件名称"
              @on-change="handleSearch"
          > </Input>
          <Input
              v-model="pagination.customerId"
              style=" width: 120px; border-radius: 20px"
              class="mr-3"
              placeholder="用户代码"
              @on-change="handleSearch"
          > </Input>
          <Select
              v-model="pagination.ruleType"
              class="mr-3"
              style="width: auto"
              placeholder="策略类型"
              :clearable="true"
              @on-change="handleSearch"
          >
            <Option
                v-for="item in this.$store.state.dictionary.dictionaryList.RuleMakeMarketType"
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
      <Col style="position: absolute;right: 25px" class="mr-3">
        <Button type="primary" @click="handleSearch" class="top">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="info" @click="modalUser('new')" class="top">
          <Icon type="md-add"/>
          新增做市策略
        </Button>
        <Button class="top" type="success"
                @click="()=>handleExport(URL.ruleExportMarket, this.pagination, '做市策略管理')">
          <Icon type="md-download"/>
          导出
        </Button>
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="600"
            :mask-closable="false"
            :title="isNew ? '新增做市策略' : '编辑做市策略'"
        >
          <div class="modal__content">
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
                        :disabled="!isNew"
                        :maxlength="32"
                        @on-change="handleShowParamsTable"
                    >
                      <Option
                          v-for="item in getRuleMakeMarketType()"
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
                        placeholder="c++策略文件名称以.so结尾"
                        autocomplete="off"
                        :maxlength="32"
                    ></Input>
                  </FormItem>
                </Col>
                <!--                <Col :span="18">-->
                <!--                  <FormItem label="策略版本" prop="ruleVersion">-->
                <!--                    <Input-->
                <!--                        v-model="userStrategyInfo.ruleVersion"-->
                <!--                        placeholder="请输入策略版本"-->
                <!--                        autocomplete="off"-->
                <!--                        :maxlength="32"-->
                <!--                    ></Input>-->
                <!--                  </FormItem>-->
                <!--                </Col>-->
                <!--                <Col :span="18">-->
                <!--                  <FormItem label="策略名称" prop="ruleName">-->
                <!--                    <Input-->
                <!--                        v-model="userStrategyInfo.ruleName"-->
                <!--                        placeholder="请输入策略名称"-->
                <!--                        autocomplete="off"-->
                <!--                        :maxlength="32"-->
                <!--                    ></Input>-->
                <!--                  </FormItem>-->
                <!--                </Col>-->
                <Col :span="18">
                  <FormItem label="用户代码" prop="customerId">
                    <Select
                        v-model="userStrategyInfo.customerId"
                        placeholder="请选择用户代码"
                        :maxlength="32"
                        :disabled="!isNew"
                        filterable
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
              </Form>
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
          <!--          <div @click="() => modalUser('modify', row)" class="table-operate">-->
          <!--            编辑-->
          <!--          </div>-->
          <div @click="() => changeUserStatus(row)" class="table-operate">
            {{ !row.active ? "启用" : "禁用" }}
          </div>
          <div class="table-operate" style="color:red;"
               @click="doOperate('dele', row)">
            删除
          </div>
          <!--          <Dropdown-->
          <!--              trigger="hover"-->
          <!--              transfer-->
          <!--              @on-click="doOperate($event, row)"-->
          <!--          >-->
          <!--            <a style="color: #02aff1; font-size: 14px">-->
          <!--              {{ "更多" }}-->
          <!--              <Icon type="ios-arrow-down"></Icon>-->
          <!--            </a>-->
          <!--            <template v-slot:list>-->
          <!--              <DropdownMenu>-->
          <!--                <DropdownItem name="dele" style="color: #ed4014">删除策略</DropdownItem>-->
          <!--              </DropdownMenu>-->
          <!--            </template>-->
          <!--          </Dropdown>-->
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
import {getRuleFileType, getRuleMakeMarketType} from "@/common/common";
import {tableMixin} from "@/mixins/tableMixin";
import {ruleComponentMixin} from "@/mixins/ruleComponentMixin";
import {ACTIVE_LIST, ERROR_MSG, SUCCESS_MSG} from "@/common/constant";
import showMessage from "@/utils/message";

export default {
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
        minWidth: 220,
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
          const result = getRuleMakeMarketType(row.ruleType, true);
          return h("span", result.description);
        },
      },
      {
        title: "策略状态",
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
      ruleFileName: "",
      ruleType: "",
      customerId: "",
      active: "",
    };
    return {
      activeList: ACTIVE_LIST,
      columns1,
      pagination,
      userValidRules: {},
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
        case "dele":
          this.deleteRow(URL.rule, row.ruleId, '做市策略', this.getUserStrategyData)
          break;
        default:
      }
    },
    // 获取策略列表
    getUserStrategyData() {
      this.loading = true;
      http.post(URL.ruleListMarket, this.pagination, this.getUserResponse);
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
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          id: "",
          ruleFileType: this.$store.state.dictionary.dictionaryList.RuleFileType[0].code,
          ruleId: "",
          ruleLocation: "",
          // ruleVersion: "",
          // ruleName: "",
          customerId: "",
          ruleType: "",
          active: true,
          ruleParams: [],
        };
        Object.assign(this.userStrategyInfo, info);
        this.fetchNewPolicyInfo(this.userStrategyInfo.ruleFileType)
      } else {
        this.isNew = false;
        this.showAddModal = true;
        // 只读下拉框展示需改为字符串类型
        Object.assign(this.userStrategyInfo, row);
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (!this.userStrategyInfo.ruleLocation) {
        showMessage(ERROR_MSG.storagePathEmpty, {type: 'warning'})
        return
      }
      // ruleFileType：0为C++策略，1为python策略
      if (this.userStrategyInfo.ruleFileName.slice(-3) !== '.so' && this.userStrategyInfo.ruleFileType === '0') {
        showMessage(ERROR_MSG.fileTypeCPlusPlus)
        return
      }
      const config = {
        method: isNew ? 'put' : 'post',
        msg: isNew ? SUCCESS_MSG.addSuccess : SUCCESS_MSG.modifySuccess,
        url: URL.ruleMarket
      };
      http[config.method](config.url, {...this.userStrategyInfo, messageType: config.msg}, (res) => {
        if (res.code === '0') {
          this.getUserStrategyData();
          this.cancel();
        }
      });
    },
    // 启用策略
    handleActiveEnable(res) {
      if (res.code !== "0") {
        showMessage(ERROR_MSG.enableFail + res.msg, {type: 'error'})
        return;
      }
      showMessage(SUCCESS_MSG.ruleIsActive)
      this.getUserStrategyData();
    },
    // 🈲用策略
    handleActiveDisable(res) {
      if (res.code !== "0") {
        showMessage("禁用失败：" + res.msg, {type: 'error'})
        return;
      }
      showMessage(ERROR_MSG.ruleDisabled,{type:'error'})
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
