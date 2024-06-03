<template>
  <div>
    <div style="position: relative; height: 50px">
      <!-- 下面的 Input 覆盖上面的 Input -->
      <form autocomplete="off">
        <Input
            @on-focus="handleFocus"
            @on-blur="handleBlur"
            ref="password"
            v-model="inputValue"
            type="text"
<<<<<<< HEAD
            placeholder="密码(8-20位字母/数字组合)"
=======
            placeholder="12位大小写字母+数字+特殊字符"
>>>>>>> feature_xibu
            :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? '2' : 'auto', opacity: typeInput ? '1' : '0' }"
            @on-change="handleInput"
        ></Input>
      </form>
      <!-- 上面的 Input 隐藏 -->
      <Input
          @on-focus="handleFocus2"
          v-model="inputValue"
          type="password"
<<<<<<< HEAD
          placeholder="密码(8-20位字母/数字组合)"
=======
          placeholder="12位大小写字母+数字+特殊字符"
>>>>>>> feature_xibu
          :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? 'auto' : '1', opacity: typeInput ? '0' : '1' }"
          @on-change="handleInput"
      ></Input>
      <div
<<<<<<< HEAD
=======
          v-if="showPwdCheck"
>>>>>>> feature_xibu
          class="pwd"
          :style="{ backgroundColor: strengthColor,width:strengthWidth,transition: 'width 0.5s' }">
        <div class="check_info" :style="{width:strengthWidth}">{{ strengthText }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import {encryptionModePassword} from "@/common/common";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {debounce} from "lodash";

export default {
  name: "InputPassword",
  props: {
    value: String, // 接受外部传入的值
    showPwdCheck: Boolean, // 是否展示密码校验
    clear: Boolean
  },
  data() {
    return {
      typeInput: true,
      inputValue: this.value, // 使用一个内部的数据来接收外部传入的值
      pwdStrengthLevel: '0', // 密码强度等级0-4 弱->很强
    }
  },
  watch: {
    clear(old) {
      if (!old) {
        this.inputValue = ''
        this.typeInput = true
        this.pwdStrengthLevel = '0'
      }
    },
  },
  // 密码强度背景色
  computed: {
    strengthText() {
      const texts = ["很弱", "弱", "中等", "强", "很强"];
      return texts[this.pwdStrengthLevel];
    },
    strengthColor() {
      // 根据 pwdStrengthLevel 返回相应的颜色
      // 这里假设 pwdStrengthLevel 为 0 到 4，分别对应不同的颜色
      const colors = ['red', 'orange', 'orange', '#08e813', '#08e813'];
      return colors[parseInt(this.pwdStrengthLevel)];
    },
    strengthWidth() {
      // 根据 pwdStrengthLevel 返回相应的宽度
      // 这里假设 pwdStrengthLevel 为 0 到 4，分别对应不同的宽度
      const widths = ['44px', '88px', '132px', '176px', '215px'];
      return widths[parseInt(this.pwdStrengthLevel)];
    }
  },
  methods: {
    handleFocus() {
      this.typeInput = true
    },
    handleFocus2() {
      this.typeInput = true
      this.$refs.password.focus();
    },
    handleBlur() {
      this.typeInput = false
    },
    // (防抖)当输入框内容改变时触发
    handleInput: debounce(function (event) {
      if (this.showPwdCheck) {
        const val = encryptionModePassword(sessionStorage.getItem('passType'), event.target.value);
        http.get(`${URL.pwdStrength}?password=${val}`, (res) => {
          this.pwdStrengthLevel = res.data;
          this.$emit('getStrength', res.data)
        });
      }
      this.inputValue = event.target.value;
      this.$emit('inputPass', this.inputValue);
    }, 100)
  },
}
</script>
<style>
.pwd {
  position: absolute;
  bottom: 2px;
  width: 220px;
  height: 7px;
  border-radius: 4px;
}

.check_info {
  position: relative;
  top: -12px;
  left: -42px;
  font-weight: bolder;
  z-index: 999;
}
</style>
