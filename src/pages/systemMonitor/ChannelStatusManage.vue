<style lang="less" scoped>
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col style="text-align: center;font-size: 16px;font-weight: bold;line-height: 30px">
        刷新频率：
      </Col>
      <Col style="height: 30px">
        <Select v-model="queryFrequency" placeholder="查询频率" @on-change="handleSetQueryTime">
          <Option v-for="option in timeOptions" :key="option.value" :value="option.value">{{ option.label }}</Option>
        </Select>
      </Col>
      <Col style="position:absolute;right: 25px">
        <Button type="info" @click="refresh()"
                style="margin-right: 5px"
        >
          <Icon type="md-refresh"/>
          刷新
        </Button
        >
        <Button type="success" @click="()=>handleExport(URL.channelStatusExport, this.pagination,'连接状态')"
                class="mr-3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
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
        @on-sort-change="e=>handleSort(e,this.getChannelStatus)"
    >
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getChannelStatus)"
            @on-change="e=>handleChangePage('pageNumber',e,getChannelStatus)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getApiType, getChannelConnectStatus, handleSort, handleExport} from "@/common/common";
import {tableMixin} from "@/mixins/tableMixin";

export default {
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "通道代码",
        key: "channelId",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom'
      },
      {
        title: "通道名称",
        key: "channelLabel",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom'
      },
      {
        title: "接口类型",
        key: "apiType",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, {row}) => {
          const result = getApiType(row.apiType);
          return h("span", result.description);
        },
      },
      {
        title: "服务运行时状态",
        key: "traderRunType",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
        render: (h, {row}) => {
          const result = getChannelConnectStatus(row.traderRunType);
          // 定义一个映射对象，将 code 映射到对应的颜色
          const codeToColor = {
            0: "#ff8000",
            1: "#ff8000",
            2: "#19be6b",
            3: "#ff0000",
            'A': "#ff0000",
            9: "#ff0000",
            4:"#ff8000"
          };
          const color = codeToColor[result.code] || "#ff0000"; // 默认颜色
          const iconStatus = h("Icon", {
            props: {
              type: "ios-radio-button-on",
              color: color,
            },
          });

          return h("span", [iconStatus, result.description]);
        },
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "更新日期",
        key: "updateDate",
        minWidth: 100,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
    ];
    const timeOptions = [ // 下拉框选项
      {value: 5, label: '5秒'},
      {value: 10, label: '10秒'},
      {value: 30, label: '30秒'},
      {value: 60, label: '60秒'}
    ]
    return {
      queryFrequency: 10,
      interval: null,
      columns1,
      timeOptions
    };
  },
  mounted() {
    this.getChannelStatus();
    this.handleSetQueryTime(this.queryFrequency)
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    handleExport,
    handleSort,
    // 手动设置查询时间
    handleSetQueryTime(e) {
      clearInterval(this.interval);
      this.queryFrequency = e
      this.interval = setInterval(() => {
        this.getChannelStatus()
      }, e * 1000)
    },
    // 获取状态连接列表
    getChannelStatus() {
      // this.loading = true;
      http.post(`${URL.channelStatus}`, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 0);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
      });
    },
    // 刷新
    refresh() {
      this.getChannelStatus();
    },
  },
};
</script>
