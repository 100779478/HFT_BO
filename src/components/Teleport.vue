<script>
export default {
  name: 'Teleport',
  data() {
    return {
      isMounted: false
    }
  },
  props: {
    to: { // 传送目标
      type: String,
      require: true
    }
  },
  // 挂载元素
  mounted() {
    this.isMounted = true
    document.querySelector(this.to).appendChild(this.$el)
  },
  // 组件激活时
  activated() {
    if (this.isMounted) return
    document.querySelector(this.to).appendChild(this.$el)
  },
  // 路由切换移除
  deactivated() {
    this.isMounted = false
    this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
  },
  // render函数渲染，使用模板的方式也是可以的
  render() {
    return <div class='teleport'>{this.$scopedSlots.default()}</div>
  },
  // 组件销毁时移除
  destroyed() {
    this.isMounted = false
    this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
  }
}
</script>
