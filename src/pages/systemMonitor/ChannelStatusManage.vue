<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
}

.table-content {
  //border: 1px solid #e8eaec;

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
        <Button type="success" @click="handleExportOrders()" class="mr3"
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
import {getApiType, getChannelConnectStatus, time} from "@/common/common";

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
        title: "服务运行时状态",
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
      tableHeight: window.innerHeight - 220,
      tableData: [],
      columns1,
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
    // 导出列表
    handleExportOrders() {
      // 校验策略编号必须为数字类型
      http.postBlob(URL.channelStatusExport, {}, (res) => {
        const blob = res;
        // 创建link标签
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        // 设置链接元素的下载属性，指定文件名
        const dateObj = time.dateToLocaleObject(new Date());
        link.download = `连接状态_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
        // 将链接元素添加到文档中
        document.body.appendChild(link);
        // 触发点击事件以开始下载
        link.click();
        // 移除链接元素
        document.body.removeChild(link);
      });
    },
  },
};
</script>
