<script>
import InputPassword from "@/components/InputPassword.vue";

export default {
  name: "ResetPwdModal",
  components: {InputPassword},
  props: ['show', 'clear'],
  data() {
    return {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    onchangePassword(e) {
      this.password = e
      this.$emit('password-change', e);
    },
    onchangeConfirmPassword(e) {
      this.confirmPassword = e
      this.$emit('confirm-password-change', e);
    },
    onchangeOldPassword(e) {
      this.oldPassword = e;
      this.$emit('old-password-change', e);
    },
    getPwdStrength(e) {
      this.$emit('strength-level', e)
    }
  },
}
</script>

<template>
  <div>
    <Form ref="form" :label-width="80">
      <FormItem label="旧密码" v-if="show">
        <InputPassword :clear="clear" v-model="oldPassword" placeholder="请输入旧密码" :showPwdCheck="false"
                       @inputPass="onchangeOldPassword"/>
      </FormItem>
      <FormItem label="新密码" prop="password">
        <InputPassword :clear="clear" v-model="password" placeholder="请输入新密码" :showPwdCheck="true"
                       @inputPass="onchangePassword" @getStrength="getPwdStrength"/>
      </FormItem>
      <FormItem label="确认密码" prop="confirmPassword">
        <InputPassword :clear="clear" v-model="confirmPassword" :showPwdCheck="false"
                       @inputPass="onchangeConfirmPassword"/>
      </FormItem>
    </Form>
  </div>
</template>

<style scoped lang="less">

</style>