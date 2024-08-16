<style lang="less" scoped>
@import url("@/style/manage.less");

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
              @on-keydown.enter="getVettingList"
              @on-change="getVettingList"
          >
            <Icon
                type="ios-search"
                slot="suffix"
                size="19"
                @click.native="getVettingList"
                style="cursor: pointer"
            />
          </Input>
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
        </form>
      </Col>
      <Col style="position:absolute;right: 25px">
        <Button type="primary" @click="getVettingList" class="mr3">
          <Icon type="md-search"/>
          查询
        </Button>
        <Button type="success" @click="()=>handleExport(URL.vettingExport, this.pagination,'策略审批')" class="mr3">
          <Icon type="md-download"/>
          导出
        </Button>
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
        @on-sort-change="e=>handleSort(e,this.getVettingList)"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div
              :class="row.ruleVettingStatus === '3' || row.ruleVettingStatus === '4' || row.ruleVettingStatus === '2' ? 'table-operate-disabled' : 'table-operate'"
              @click="() => handleRuleApproval(row,true)"
          >
            通过
          </div>
          <div
              :class="row.ruleVettingStatus === '3' || row.ruleVettingStatus === '4' || row.ruleVettingStatus === '2' ? 'table-operate-disabled' : 'table-operate'"
              @click="() => handleRuleApproval(row,false)"
          >
            拒绝
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
                <DropdownItem name="down">下载</DropdownItem>
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getVettingList)"
            @on-change="e=>handleChangePage('pageNumber',e,getVettingList)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {handleSort, getRuleFileType, getRuleMakeMarketType, getRuleVettingStatus, handleExport} from "@/common/common";
import {downLoadZip} from "@/utils/downLoadZip";
import ParamsTable from "@/components/ParamsTable.vue";
import {tableMixin} from "@/mixins/tableMixin";
import {ruleVettingColumn} from "@/mixins/ruleComponentMixin";

export default {
  mixins: [tableMixin],
  data() {
    let pagination = {
      ruleVettingStatus: '',
      ruleName: ""
    };
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
        title: "申请人",
        key: "submissionName",
        sortable: 'custom',
        resizable: true,
        width: null,
        minWidth: 170,
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
    return {
      pagination,
      columns1,
      comment: "",
    };
  },
  mounted() {
    this.loading = false
    this.getVettingList();
  },
  methods: {
    handleExport,
    handleSort,
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
        case 'down':
          this.downloadRuleApproval(row)
          break
        default:
      }
    },
    // 获取策略审批单列表
    getVettingList() {
      this.loading = true;
      http.post(`${URL.vetting}`, this.pagination, (res) => {
        this.loading = false;
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
      });
    },
    /**
     * 审批按钮
     * @param {Object} row -选中行数据
     * @param {Boolean} status -审批状态：通过 、拒绝
     */
    handleRuleApproval(row, status) {
      // 使用解构和剩余运算符去掉 index 和 rowKey 属性
      const {ruleId} = row;
      const messageType = status ? "通过" : "拒绝";
      const url = status ? URL.agreeVetting : URL.refuseVetting
      this.$Modal.confirm({
        title: `确认${messageType}审批吗？`,
        render: (h) => {
          return h('div', [
            h('Input', {
              props: {
                model: this.comment,
                autofocus: true,
                type: 'textarea',
                placeholder: '请输入备注',
                rows: 4
              },
              on: {
                input: (value) => {
                  this.comment = value
                }
              }
            })
          ]);
        },
        onOk: () => {
          http.post(url, {ruleId, messageType: '审批' + messageType, comment: this.comment}, () => {
            this.getVettingList();
          })
        },
        onCancel: () => {
          this.comment = ''
        },
        okText: "确认",
        cancelText: "取消"
      });
    },
    // 下载审批文件
    downloadRuleApproval(row) {
      const {ruleId} = row
      const data = {
        ruleId,
        messageType: '下载成功',
        responseType: 'blob',
      }
      downLoadZip(URL.vettingDownload, data, "审批文件")
    }
    ,
  },
};
</script>
