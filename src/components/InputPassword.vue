<script>
export default {
  name: "InputPassword",
  props: {
    value: String // 接受外部传入的值
  },
  data() {
    return {
      typeInput: true,
      inputValue: this.value // 使用一个内部的数据来接收外部传入的值
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
      this.inputValue = event.target.value; // 更新内部数据
      this.$emit('inputPass', this.inputValue); // 发送事件给父组件
    }
  }
}
</script>

<template>
  <div style="position: relative; height: 34px; overflow: hidden;">
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

  </div>
</template>
