<template>
  <div v-if="visible" class="confirm-dialog-mask" @mousedown.stop>
    <div
        class="confirm-dialog-box"
        :style="boxStyle"
        ref="dialogBox"
        @mousedown.stop
    >
      <div
          class="confirm-dialog-title"
          @mousedown="startDrag"
      >
        {{ title }}
        <div class="confirm-dialog-icon" @click="$emit('update:visible',false)">×</div>
      </div>
      <!-- ✅ 默认插槽：替换 message -->
      <div class="confirm-dialog-content">
        <slot>
          {{ message }}
        </slot>
      </div>

      <!-- ✅ footer 插槽 -->
      <div class="confirm-dialog-actions">
        <slot name="footer">
          <Button class="client-button" @click="onCancel">取消</Button>
          <Button class="client-button-primary" @click="onConfirm" :loading="confirmLoading">确认</Button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: "提示"
    },
    message: {
      type: String,
      default: "是否确认执行该操作？"
    }
  },
  data() {
    return {
      offsetX: 0,
      offsetY: 0,
      dragging: false,
      dialogLeft: 0,
      dialogTop: 0,
      confirmLoading: false, // ✅ loading 状态
    };
  },
  computed: {
    boxStyle() {
      return {
        left: this.dialogLeft + 'px',
        top: this.dialogTop + 'px'
      };
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },
  watch: {
    visible(val) {
      if (val) this.$nextTick(this.centerDialog);
    }
  },
  methods: {
    onKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        // 触发关闭弹窗
        this.$emit('update:visible', false);
        // 如果你还想触发 cancel 事件：
        this.$emit('cancel');
      }
    },
    centerDialog() {
      this.$nextTick(() => {
        const box = this.$refs.dialogBox;
        if (!box) return;

        const {innerWidth, innerHeight} = window;
        const width = box.offsetWidth;
        const height = box.offsetHeight;

        this.dialogLeft = (innerWidth - width) / 2;
        this.dialogTop = (innerHeight - height) / 4;
      });
    },
    startDrag(e) {
      this.dragging = true;
      this.offsetX = e.clientX - this.dialogLeft;
      this.offsetY = e.clientY - this.dialogTop;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(e) {
      if (!this.dragging) return;
      const {innerWidth, innerHeight} = window;
      const box = this.$refs.dialogBox;
      const maxLeft = innerWidth - box.offsetWidth;
      const maxTop = innerHeight - box.offsetHeight;

      let newLeft = e.clientX - this.offsetX;
      let newTop = e.clientY - this.offsetY;

      // 限制不拖出窗口
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      this.dialogLeft = newLeft;
      this.dialogTop = newTop;
    },
    stopDrag() {
      this.dragging = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    },
    onCancel() {
      this.$emit("update:visible", false);
      this.$emit("cancel");
    },
    async onConfirm() {
      const confirmHandler = this._events.confirm?.[0];
      if (!confirmHandler) {
        this.$emit('update:visible', false);
        return;
      }
      try {
        const result = confirmHandler();
        if (result && typeof result.then === 'function') {
          this.confirmLoading = true; // ✅ 开启 loading
          await result;
        }
        this.$emit('update:visible', false);
      } catch (err) {
      } finally {
        this.confirmLoading = false; // ✅ 无论成功失败都重置
      }
    },
  }
};
</script>

<style scoped lang="less">
@import url("@/style/manage.less");
@import url("@/style/client.less");

.confirm-dialog-mask {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-dialog-box {
  position: absolute;
  background: var(--background-color);
  color: var(--text-color, #333);
  width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 2px solid #3a4c6e;
  user-select: none;
}

.confirm-dialog-title {
  font-size: 14px;
  cursor: move;
  padding: 6px;
  background: #29395A;
}

.confirm-dialog-icon {
  float: right;
  cursor: pointer;
  font-size: 18px;
  line-height: 20px;
}

.confirm-dialog-content {
  font-size: 12px;
  margin: 20px;
}

.confirm-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 10px;
}
</style>
