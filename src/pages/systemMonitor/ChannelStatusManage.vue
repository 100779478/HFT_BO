<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
}

.table-content {
  border: 1px solid #e8eaec;

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
        <Button type="success" @click="refresh()"
        >
          <Icon type="md-refresh"/>
          刷新
        </Button
        >
      </Col>
    </Row>
    <Table
        :columns="columns1"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        :loading="loading"
        border
    >
    </Table>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getApiType, getChannelConnectStatus} from "@/common/common";

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
      },
      {
        title: "接口类型",
        key: "apiType",
        minWidth: 100,
        resizable: true,
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
        title: "交易员运行时状态",
        key: "traderRunType",
        minWidth: 100,
        resizable: true,
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
        width: null,
      },
      {
        title: "更新日期",
        key: "updateDate",
        minWidth: 100,
        resizable: true,
        width: null,
      },
      // {
      //   title: "更新信息",
      //   key: "comment",
      //   minWidth: 100,
      // },
    ];
    return {
      loading: true,
      tableHeight: 0,
      tableData: [],
      columns1,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getChannelStatus();
  },
  methods: {
    // 获取状态连接列表
    getChannelStatus() {
      http.get(`${URL.channelStatus}`, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.tableData = res.data || [];
      });
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getChannelStatus();
    },
  },
};
</script>
