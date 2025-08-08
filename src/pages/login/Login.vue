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
            <FormItem prop="username" style="margin-bottom: 30px">
              <Input
                  type="text"
                  v-model="formInline.username"
                  placeholder="用户代码"
                  style="width: 300px"
              >
                <Icon type="md-person" slot="prepend" style="fontsize: 20px"/>
              </Input>
            </FormItem>
            <FormItem prop="password" style="margin-bottom: 30px">
              <Input
                  type="password"
                  password
                  v-model="formInline.password"
                  placeholder="密码"
                  style="width: 300px"
                  @on-keydown.enter="handleSubmit('formInline')"
              >
                <Icon type="md-lock" slot="prepend" style="fontsize: 20px"/>
              </Input>
            </FormItem>
            <FormItem prop="verifyCode" style="margin-bottom: 40px">
              <div style="display: flex; height: 30px">
                <Input
                    type="text"
                    v-model="formInline.verifyCode"
                    placeholder="验证码"
                    style="width: 150px"
                    @on-keydown.enter="handleSubmit('formInline')"
                >
                  <Icon type="md-mail" slot="prepend" style="fontsize: 20px"/>
                </Input>
                <div class="verifyContent" @click="handleGetVerifyImg()">
                  <img :src="imgUrl" alt="正在加载" style="height: 35px"/>
                  <span>看不清 换一张</span>
                </div>
              </div>
            </FormItem>
            <FormItem>
              <Button
                  type="info"
                  @click="handleSubmit('formInline')"
                  class="btn"
                  :loading="loading"
              >登录
              </Button>
            </FormItem>
          </Form>
          <div class="login-err">{{ passwordIncorrectMessage }}</div>
        </div>
      </div>
      <div class="version">Version{{ version }}</div>
    </div>
  </div>
</template>
<script>
import {http, defaultErrorHandler} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {putToken} from "@/utils/token";
import {Message} from "view-design";
import {checkPwdExpiredTime, encryptionModePassword} from "@/common/common";
import showMessage from "@/utils/message";

export default {
  data() {
    return {
      imgUrl: "",
      loading: false,
      encryptType: "",
      passwordIncorrectMessage: "",
      formInline: {
        username: "",
        password: "",
        verifyCode: "",
      },
      ruleInline: {
        username: [
          {required: true, message: "请输入用户代码", trigger: "blur"},
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {
            type: "string",
            min: 6,
            message: "密码长度不能少于6位",
            trigger: "blur",
          },
        ],
        verify: [{required: true, message: "请输入验证码", trigger: "blur"}],
      },
      version: null,
    };
  },
  methods: {
    // 获取当前系统密码类型MD5 or CUSTOMIZE
    getEncryptionType() {
      http.get(URL.encryption, (res) => {
        this.encryptType = res.data
        sessionStorage.setItem('passType', res.data)
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.openLoading();
          let loginParam = {
            username: this.formInline.username,
            password: encryptionModePassword(this.encryptType, this.formInline.password),
            verifyCode: this.formInline.verifyCode,
          };
          http.post(URL.login, loginParam, this.login, this.loginError);
        }
      });
    },
    login(response) {
      this.closeLoading();
      let token = response.data.token;
      if (!token) {
        this.passwordIncorrectMessage = response.data.message
        this.handleGetVerifyImg()
        return
      }
      putToken(token);
      http.get(URL.loginProtect, (res) => {
            if (!checkPwdExpiredTime(res.data.expiredTime, res.data.serverTime)) {
              showMessage('登录成功！')
              this.$router.push({name: "Home"});
            }
          }
      )
    },
    loginError(error) {
      console.log("LoginError", error);
      this.closeLoading();
      defaultErrorHandler(error);
      this.formInline.verifyCode = null
      this.handleGetVerifyImg();
    }
    ,
    closeLoading() {
      this.loading = false;
    }
    ,
    openLoading() {
      this.loading = true;
    }
    ,
    handleGetVerifyImg() {
      http.get(
          URL.verifyCode,
          (res) => {
            let blob = new Blob([res], {type: "image/png"});
            this.imgUrl = window.URL.createObjectURL(blob);
          }, () => {
          }, 'blob'
      );
    }
    ,
    handleGetDic() {
      http.get(URL.dictionaryList, (res) => {
        this.$store.commit("dictionary/dictionaryList", res.data);
      });
    }
    ,
  },
  created() {
    this.version = process.env.VERSION
  },
  mounted() {
    this.getEncryptionType()
    this.handleGetVerifyImg();
    this.handleGetDic();
  }
  ,
}
;
</script>
<style scoped lang='less'>
.page-account {
  background-image: url("../../assets/login_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  position: relative;
  width: 100%;
}

.page-account-container {
  position: absolute;
  top: 25%;
  right: 15%;
}

.login-err {
  color: red;
}

.login_form {
  height: 489px;
  width: 450px;
  background: #fff;
  padding: 65px 60px 0 60px;
  flex: none;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
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

.verifyContent {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: 20px;
  color: #09357e;
  cursor: pointer;
}

.copy-font {
  font-size: 12px;
  color: gray;
  display: inline-block;
  margin-top: 50px;
}

.version {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  font-size: 14px;
  color: #6c757d;
}

</style>
