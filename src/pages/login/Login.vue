<template>
  <div>
    <div class="page-account">
      <div class="page-account-container">
        <div class="login_form">
          <div class="page-account-top">
            <div class="head-font">HFT 后台管理系统</div>
          </div>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="10">
            <FormItem prop="username" style="margin-bottom: 30px">
              <Input type="text" v-model="formInline.username" placeholder="用户名" style="width: 300px">
              <Icon type="md-person" slot="prepend" style="fontsize: 20px" />
              </Input>
            </FormItem>
            <FormItem prop="password" style="margin-bottom: 40px">
              <Input type="password" v-model="formInline.password" placeholder="密码" style="width: 300px">
              <Icon type="md-lock" slot="prepend" style="fontsize: 20px" />
              </Input>
            </FormItem>
            <FormItem>
              <Button type="info" @click="handleSubmit('formInline')" class="btn" :loading="loading">登录</Button>
            </FormItem>
          </Form>
          <span class="copyfont">Copyright ©2023深圳市丽海弘金科技有限公司</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { URL, http, defaultErrorHandler } from "@/utils/request";
import { putToken } from "@/utils/token";
export default {
  data() {
    return {
      loading: false,
      formInline: {
        username: "",
        password: "",
      },
      ruleInline: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
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
          this.openLoading()
          let loginParam = {
            username: this.formInline.username,
            password: this.$md5(this.formInline.password),
          }
          http.post(URL.login, loginParam, this.login, this.loginError)
        }
      });
    },
    login(response) {
      this.closeLoading();
      let token = response.data
      putToken(token);
      this.$Message.success('登录成功！')
      this.$router.push({ name: 'Home' })
    },
    loginError(error) {
      this.closeLoading();
      defaultErrorHandler(error)
    },
    closeLoading() {
      this.loading = false
    },
    openLoading() {
      this.loading = true
    }
  },
};
</script>
<style scoped lang='less'>
.page-account {
  background-image: url("../../assets/login_bg.png");
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  position: relative;
}

.page-account-container {
  position: absolute;
  top: 25%;
  right: 320px;
}

.login_form {
  height: 489px;
  width: 440px;
  background: #fff;
  padding: 0 60px;
  flex: none;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding-top: 65px;
  text-align: center;
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
  font-weight: bold;
  color: black;
  margin: 25px 0;
}

.btn {
  width: 300px;
  margin-right: 10px;
  height: 35px;
}

.copyfont {
  font-size: 12px;
  color: gray;
  display: inline-block;
  margin-top: 50px;
}
</style>
