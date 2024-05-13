<script>
import {encryptionModePassword} from "@/common/common";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export default {
  name: "InputPassword",
  props: {
    value: String // 接受外部传入的值
  },
  data() {
    return {
      typeInput: true,
      inputValue: this.value, // 使用一个内部的数据来接收外部传入的值
      pwdStrengthLevel: '0' // 密码强度等级0-4 弱->很强
    }
  },
  // 密码强度背景色
  computed: {
    strengthColor() {
      // 根据 pwdStrengthLevel 返回相应的颜色
      // 这里假设 pwdStrengthLevel 为 0 到 4，分别对应不同的颜色
      const colors = ['red', 'orange', 'orange', '#08e813', '#08e813'];
      return colors[parseInt(this.pwdStrengthLevel)];
    },
    strengthWidth() {
      // 根据 pwdStrengthLevel 返回相应的宽度
      // 这里假设 pwdStrengthLevel 为 0 到 4，分别对应不同的宽度
      const widths = ['44px', '88px', '132px', '176px', '220px'];
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
    // 当输入框内容改变时触发
    handleInput(event) {
      const val = encryptionModePassword(sessionStorage.getItem('passType'), event.target.value)
      http.get(`${URL.pwdStrength}?password=${val}`, (res) => {
        this.pwdStrengthLevel = res.data
      })
      this.inputValue = event.target.value; // 更新内部数据
      this.$emit('inputPass', this.inputValue); // 发送事件给父组件
    },
  },
}
</script>

<template>
  <div>
    <div style="position: relative; height: 50px; overflow: hidden;">
      <!-- 下面的 Input 覆盖上面的 Input -->
      <form autocomplete="off">
        <Input
            @on-focus="handleFocus"
            @on-blur="handleBlur"
            ref="password"
            v-model="inputValue"
            type="text"
            placeholder="请输入密码"
            :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? '2' : 'auto', opacity: typeInput ? '1' : '0' }"
            @on-change="handleInput"
        ></Input>
      </form>
      <!-- 上面的 Input 隐藏 -->
      <Input
          @on-focus="handleFocus2"
          v-model="inputValue"
          type="password"
          placeholder="请输入密码"
          :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? 'auto' : '1', opacity: typeInput ? '0' : '1' }"
          @on-change="handleInput"
      ></Input>
      <div
          class="pwd"
          :style="{ backgroundColor: strengthColor,width:strengthWidth }"></div>
    </div>
  </div>
</template>
<style>
.pwd {
  position: absolute;
  bottom: -5px;
  width: 220px;
  height: 12px
}

</style>