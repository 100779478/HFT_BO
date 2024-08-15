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
              @on-change="handleSearch"
          />
          <Input
              v-model="pagination.customerId"
              style=" width: 120px; border-radius: 20px"
              class="mr3"
              placeholder="用户代码"
              @on-change="handleSearch"
          />
          <Input
              v-model="pagination.ruleTag"
              style=" width: 120px; border-radius: 20px"
              class="mr3"
              placeholder="标签"
              @on-change="handleSearch"
          />
        </form>
      </Col>
      <Col span="" class="mr3" style="flex-shrink: 0">
        <Button type="primary" @click="handleSearch" class="mr3">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="success" @click="()=>handleExport(URL.ruleExportInstance, this.pagination, '策略实例')"
                class="mr3">
          <Icon type="md-download"/>
          导出
        </Button>
      </Col>
    </Row>
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
    />
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
    ];
    let pagination = {
      ruleName: "",
      ruleId: null,
      ruleTag: "",
      customerId: "",
    };
    return {
      columns1,
      pagination,
      loading: false,
      activeList: ACTIVE_LIST,
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
  },
}
;
</script>
