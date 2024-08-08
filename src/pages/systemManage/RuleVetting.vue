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
        <Button type="primary" @click="refresh()" style="margin-right: 5px">
          <Icon type="md-search"/>
          查询
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
          <div @click="() => handleRuleApproval(row,true)" class="table-operate">
            通过
          </div>
          <div @click="() => handleRuleApproval(row,false)" class="table-operate">
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
import {handleSort, getRuleFileType, getRuleMakeMarketType, getRuleVettingStatus} from "@/common/common";
import {downLoadZip} from "@/utils/downLoadZip";
import ParamsTable from "@/components/ParamsTable.vue";
import {tableMixin} from "@/mixins/tableMixin";
import {ruleVettingColumn} from "@/mixins/ruleComponentMixin";

export default {
  mixins: [tableMixin, ruleVettingColumn],
  data() {
    let pagination = {
      ruleVettingStatus: '',
      ruleName: ""
    };
    return {
      pagination,
    };
  },
  mounted() {
    this.loading = false
    this.getVettingList();
  },
  methods: {
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
    ok() {
      this.cancel();
    },
    /**
     * 审批按钮
     * @param {Object} row -选中行数据
     * @param {Boolean} status -审批状态：通过 、拒绝
     */
    handleRuleApproval(row, status) {
      // 使用解构和剩余运算符去掉 index 和 rowKey 属性
      const {ruleId} = row;
      const messageType = status ? "审批通过" : "审批拒绝";
      const url = status ? URL.agreeVetting : URL.refuseVetting
      http.post(url, {ruleId, messageType}, () => {
        this.getVettingList();
      })
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
    },
  },
};
</script>
