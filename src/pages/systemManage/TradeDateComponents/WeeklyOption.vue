<style lang="less" scoped>
@import url("@/style/manage.less");

.top {
  margin: -10px 5px 5px 5px
}
</style>
<template>
  <div>
    <Input class="top" style="float: left;width: 140px"
           placeholder="请输入日期"
    >
      <Icon
          type="ios-search"
          slot="suffix"
          size="19"
          style="cursor: pointer"
      />
    </Input>
    <div style="float: right">
      <Button type="info" @click="refresh()" class="top"> 新增</Button>
      <Button type="error" @click="refresh()" class="top"> 删除</Button>
      <Button type="success" @click="refresh()" class="top"> 查询</Button>
    </div>
    <Table
        style="clear: both"
        :columns="columns1"
        :data="list"
        size="small"
        class="table-content"
        :height="tableHeight"
        border
    >
      <!--        :loading="loading"-->
    </Table>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getApiType, getChannelConnectStatus, time, handleSort} from "@/common/common";

export default {
  data() {
    let columns1 = [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '日期',
        key: 'name'
      },
      {
        title: '周几',
        key: 'name'
      },
      {
        title: '调整缘由',
        key: 'name'
      },
      {
        title: '操作',
        slot: 'operate'
      },
    ];
    const list =
        [{
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
          }]
    return {
      // loading: true,
      tableHeight: window.innerHeight - 170,
      tableData: [],
      columns1,
      list
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 170
    })
    this.getChannelStatus();
  },
  methods: {
    // 获取状态连接列表
    // getChannelStatus() {
    //   http.post(`${URL.channelStatus}`, this.pagination, (res) => {
    //     setTimeout(() => {
    //       this.loading = false;
    //     }, 200);
    //     this.pagination.total = res.data.total;
    //     this.tableData = res.data.dataList || [];
    //   });
    // },
  },
};
</script>
