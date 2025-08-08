<template>
  <div class="protect-body">
    <div class="protect-container">
      <Card style="width:400px">
        <h2 class="protect-title">修改密码</h2>
        <ResetPwdModal
            :clear="false"
            :show="true"
            @password-change="onPasswordChange"
            @confirm-password-change="onConfirmPasswordChange"
            @old-password-change="onchangeOldPassword"
            @strength-level="getStrengthLevel"/>
        <Button type="primary" @click="ok" class="protect-btn">确定</Button>
      </Card>
    </div>
  </div>
</template>

<script>
import ResetPwdModal from "@/components/ResetPwdModal.vue";
import {encryptionModePassword} from "@/common/common";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import router from "@/router";
import {ERROR_MSG, SUCCESS_MSG} from "@/common/constant";
import showMessage from "@/utils/message";

export default {
  name: "LoginProtect",
  components: {ResetPwdModal},
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
      strength: ""
    }
  },
  methods: {
    onPasswordChange(val) {
      this.newPassword = val;
    },
    onConfirmPasswordChange(val) {
      this.confirmPassword = val;
    },
    onchangeOldPassword(val) {
      this.oldPassword = val;
    },
    getStrengthLevel(e) {
      this.strength = e
    },
    ok() {
      if (this.oldPassword === "") {
        showMessage(ERROR_MSG.oldPasswordEmpty, {type: 'error'})
        return;
      }
      if (this.newPassword === "") {
        showMessage(ERROR_MSG.newPasswordEmpty, {type: 'error'})
        return;
      }
      if (this.confirmPassword === "") {
        showMessage(ERROR_MSG.confirmPasswordEmpty, {type: 'error'})
        return;
      }
      if (this.newPassword.includes(' ')) {
        showMessage(ERROR_MSG.passwordContainsSpace, {type: 'warning'})
        return;
      }
      if (this.strength < 3) {
        showMessage(ERROR_MSG.passwordStrengthInsufficient, {type: 'error'})
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        showMessage(ERROR_MSG.passwordsMismatch, {type: 'warning'})
        return;
      }
      const passType = sessionStorage.getItem('passType')
      const oldPassword = encryptionModePassword(passType, this.oldPassword);
      const newPassword = encryptionModePassword(passType, this.newPassword);
      let params = {
        oldPassword,
        newPassword,
      };
      //修改密码http请求
      http.post(URL.modification, params, this.modificationPasswordSuccess);
    },
    modificationPasswordSuccess(res) {
      if (res.code === '0') {
        showMessage(SUCCESS_MSG.modifySuccess)
        this.$router.push({name: 'Login'})
      }
    },
  }
}
</script>

<style scoped lang="less">
.protect-body {
  background-image: url("../../assets/login_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  position: relative;
  width: 100%;
}

.protect-container {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-top: -100px;
  margin-left: -200px;
  width: 400px;

  .protect-title {
    margin-left: 150px;
    margin-bottom: 15px;
  }

  .protect-btn {
    margin: 0 auto;
    display: block;
    width: 200px;
  }
}
</style>