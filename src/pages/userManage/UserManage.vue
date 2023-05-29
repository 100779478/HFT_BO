<style lang="less">
</style>
<template>
  <Table
    stripe
    :columns="columns1"
    :data="data1"
    style="border: 1px solid #e8eaec"
    height="600"
  ></Table>
</template>
<script>
export default {
  data() {
    return {
      columns1: [
        {
          title: "操作",
          key: "action",
          width: 80,
        },
        {
          title: "用户ID",
          key: "userId",
          width: 180,
        },
        {
          title: "用户名",
          key: "username",
          width: 180,
        },
        {
          title: "用户名称",
          key: "customerName",
          width: 180,
        },
        {
          title: "是否活跃",
          key: "active",
          width: 180,
          
        },
        {
          title: "角色列表",
          key: "roles",
          width: 180,
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 180,
        },
         {
          title: "更新时间",
          key: "updateTime",
          width: 180,
        },
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          updateTime: "2016-10-03",
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          updateTime: "2016-10-01",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          updateTime: "2016-10-02",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          updateTime: "2016-10-04",
        },
      ],
    };
  },
};
</script>
