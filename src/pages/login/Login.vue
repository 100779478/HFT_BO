<template>
  <div>
    <div class="page-account">
      <div class="page-account-container">
        <div class="login_form">
          <div class="page-account-top">
            <div class="head-font">HFT 后台管理系统</div>
          </div>
          <Form
            ref="formInline"
            :model="formInline"
            :rules="ruleInline"
            :label-width="10"
          >
            <FormItem
              prop="user"
              style="margin-bottom: 30px"
            >
              <Input
                type="text"
                v-model="formInline.user"
                placeholder="用户名"
                style="width: 300px"
              >
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password" style="margin-bottom: 40px">
              <Input
                type="password"
                v-model="formInline.password"
                placeholder="密码"
                style="width: 300px"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')"
                >登录</Button
              >
            </FormItem>
          </Form>
          Copyright ©2022深圳市丽海弘金科技有限公司
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        password: "",
      },
      ruleInline: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能少于6位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
  },
};
</script>
<style scoped>
.login_form {
  height: 489px;
  width: 440px;
  background: #fff;
  padding: 0 60px;
  flex: none;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding-top: 65px;
}

.login_form .ivu-input-prefix {
  line-height: 36px;
}

.login_form .ivu-input-large {
  font-size: 14px;
  padding: 7px 16px 7px 38px;
}
.head-font {
  font-size: 24px;
}
</style>
