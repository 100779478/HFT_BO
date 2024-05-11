<style lang="less" scoped>
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col style="height: 30px">
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
                class="mr3"
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
import {getApiType, getChannelConnectStatus, time, handleSort, handleExport} from "@/common/common";

export default {
  data() {
    let columns1 = [
      // {
      //   title: "环境ID标识",
      //   key: "id",
      //   minWidth: 80,
      // },
      {
        title: "通道代码",
        key: "channelId",
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
      // {
      //   title: "用途类型",
      //   key: "comment",
      //   minWidth: 100,
      // },
      // {
      //   title: "用户代码",
      //   key: "comment",
      //   minWidth: 100,
      // },
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
            1: "#ff8000	",
            2: "#19be6b",
            3: "#ff0000",
            9: "#ff0000",
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
      // {
      //   title: "交易员当前连接是否活跃",
      //   key: "active",
      //   minWidth: 100,
      // },
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
      // {
      //   title: "更新信息",
      //   key: "comment",
      //   minWidth: 100,
      // },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      sort: 'asc',
      sortField: ''
    };
    return {
      loading: true,
      tableHeight: window.innerHeight - 220,
      tableData: [],
      columns1,
      pagination,
      URL
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getChannelStatus();
  },
  methods: {
    handleExport,
    handleSort,
    // 获取状态连接列表
    getChannelStatus() {
      http.post(`${URL.channelStatus}`, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
      });
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getChannelStatus();
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getChannelStatus();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getChannelStatus();
    },
  },
};
</script>
