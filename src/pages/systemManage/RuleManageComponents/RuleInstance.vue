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

::v-deep .ivu-table td,
::v-deep .ivu-table th {
  padding-top: 5px !important; /* 调整上边距 */
  padding-bottom: 5px !important; /* 调整下边距 */
  line-height: normal; /* 确保文本的行高正常 */
  height: 12px !important;
}

.top {
  margin: -10px 5px 5px 5px
}
</style>
<template>
  <div>
    <Row style="margin: -5px 5px 5px 5px" justify="space-between" align="top">
      <Col
          span="22"
          style="display: flex; flex-wrap: wrap; flex-basis: calc(100% - 180px)"
      >
        <form autocomplete="off">
          <Input
              v-model="pagination.ruleName"
              style="width: 120px; border-radius: 20px"
              class="mr3"
              placeholder="实例名称"
          />
          <Input
              v-model="pagination.customerId"
              style=" width: 120px; border-radius: 20px"
              class="mr3"
              placeholder="用户代码"
          />
          <Input
              v-model="pagination.ruleTag"
              style=" width: 120px; border-radius: 20px"
              class="mr3"
              placeholder="标签"
          />
          <Select
              v-model="pagination.active"
              class="mr3"
              style="width: 100px"
              placeholder="状态"
              :clearable="true"
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
      <Col span="" class="mr3" style="flex-shrink: 0">
        <Button type="primary" @click="handleSearch" class="mr3">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="success" @click="()=>handleExport(URL.ruleExportQuant, this.pagination, '策略实例')" class="mr3">
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
        :width="1300"
        :mask-closable="false"
        title="查看策略实例"
    >
      <div class="modal__content">
        <div class="modal__content-left">
          <Form
              ref="ruleForm"
              :model="instanceStrategyInfo"
              :label-width="210"
              label-colon
              autocomplete="off"
          >
            <Col :span="18">
              <FormItem label="实例ID">
                <Input
                    v-model="instanceStrategyInfo.ruleId"
                    disabled
                    :maxlength="20"
                    show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="实例名称">
                <Input
                    v-model="instanceStrategyInfo.ruleName"
                    disabled
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户代码">
                <Input
                    v-model="instanceStrategyInfo.customerId"
                    disabled
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="标签">
                <Input
                    v-model="instanceStrategyInfo.ruleTag"
                    disabled
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="状态">
                <i-Switch
                    v-model="instanceStrategyInfo.active"
                    disabled
                    style="margin-top: 5px"
                />
              </FormItem>
            </Col>
          </Form>
        </div>
        <div class="modal__content-right">
          <ParamsTable :paramList="paramList" :readOnly="true"/>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="()=>this.showAddModal=false">确定</Button>
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
        @on-sort-change="e=>handleSort(e,this.getUserStrategyData)"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            查看
          </div>
          <div @click="() => deleteRow(URL.rule, row.ruleId, '策略实例', this.getUserStrategyData)"
               class="table-operate">
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
import ParamsTable from "@/components/ParamsTable.vue";
import {tableMixin} from "@/mixins/tableMixin";
import {ruleComponentMixin} from "@/mixins/ruleComponentMixin";
import {ACTIVE_LIST} from "@/common/constant";

export default {
  components: {ParamsTable},
  mixins: [tableMixin, ruleComponentMixin],
  data() {
    let columns1 = [
      {
        title: "策略实例ID",
        key: "ruleId",
        minWidth: 120,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "策略实例名称",
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
        title: "策略标签",
        key: "ruleTag",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 120,
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
      ruleName: "",
      ruleId: null,
      ruleTag: "",
      customerId: "",
      active: ""
    };
    let instanceStrategyInfo = {
      ruleId: null,
      ruleName: null,
      customerId: null,
      ruleTag: null,
      active: true,
    }
    return {
      instanceStrategyInfo,
      columns1,
      pagination,
      loading: false,
      activeList: ACTIVE_LIST,
      showAddModal: false,
    };
  },
  computed: {
    ruleId() {
      return this.$store.state.rule.ruleId;
    }
  },
  watch: {
    ruleId(newValue, oldValue) {
      // 当 ruleId 变化时，执行一些操作
      this.pagination.ruleId = newValue
      this.getUserStrategyData()
    }
  },
  methods: {
    calculateTableHeight() {
      return window.innerHeight * 0.33;
    },
    // 获取策略实例列表
    getUserStrategyData() {
      this.loading = true;
      http.post(URL.ruleQuantInstanceList, this.pagination, this.getUserResponse);
    },
    // 策略实例模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserStrategyData();
    },
    // 策略实例弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      this.paramList = []
      this.showAddModal = true;
      this.paramList = JSON.parse(JSON.stringify(row.ruleProps))
      // 只读下拉框展示需改为字符串类型
      this.paramList.forEach(param => param.readOnly = String(param.readOnly));
      Object.assign(this.instanceStrategyInfo, row);
    },
  },
}
;
</script>
