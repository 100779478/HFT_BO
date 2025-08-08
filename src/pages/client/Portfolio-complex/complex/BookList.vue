<template>
  <div class="book-list">
    <div class="book-title">
      {{ title }}
      <div class="book-subtitle">{{ subtitle }}</div>
    </div>
    <div class="book-content">
      <ul>
        <li
            v-for="item in list"
            :key="item.id"
            @click="$emit('select', item)"
            :style="{ background: activeItem === item.id ? '#39478E' : '' }"
        >
          {{ item.name }}
          <Icon
              v-if="deletable && activeItem===item.id"
              type="md-close"
              class="list-icon"
              @click.stop="$emit('delete', item)"
          />
        </li>
      </ul>

      <Input
          v-if="showAddInput"
          ref="inputRef"
          v-model="inputValue"
          size="small"
          placeholder="请输入投组名称,按下回车确认"
          @on-enter="confirmAdd"
          @on-blur="hideInput"
          style="margin: 4px auto;"
      />
      <Icon
          v-if="addable"
          type="md-add"
          class="add-icon"
          @click="handleAdd"
      />
    </div>
  </div>
</template>

<script>
import showMessage from "@/utils/message";

export default {
  name: "BookList",
  props: {
    title: String,
    subtitle: String,
    list: Array,
    activeItem: Number,
    addable: {type: Boolean, default: false},
    deletable: {type: Boolean, default: false}
  },
  data() {
    return {
      showAddInput: false,
      inputValue: ""
    };
  },
  methods: {
    // 新增投组，展示输入框
    handleAdd() {
      this.showAddInput = true;
      this.inputValue = "";
      this.$nextTick(() => {
        this.$refs.inputRef?.focus();
      });
    },
    // 失焦隐藏输入框
    hideInput() {
      this.showAddInput = false;
    },
    // 确认添加投组
    confirmAdd() {
      const name = this.inputValue.trim();
      if (!name) return;

      if (this.list.some(item => item.name === name)) {
        showMessage('投组名称重复，请重新输入', {type: "error"})
        return;
      }

      this.$emit("add", {name});
      this.showAddInput = false;
      this.inputValue = "";
    }
  }
};
</script>

<style scoped lang="less">
.book-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .book-title {
    padding: 8px;
    text-align: center;
    font-weight: bold;
    color: white;

    .book-subtitle {
      font-weight: normal;
    }
  }

  .book-content {
    background: #1D2B48;
    flex: 1;
    padding: 8px;
    display: flex;
    flex-direction: column;
    text-align: center;

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 4px 8px;
        margin-bottom: 2px;
        text-align: center;

        .list-icon {
          float: right;
          line-height: 20px;
          font-weight: bolder;
          cursor: pointer;
        }
      }
    }

    .add-icon {
      line-height: 25px;
      text-align: center;
      margin: 0 auto;
      width: 50px;
      font-weight: bolder;
      cursor: pointer
    }
  }
}
</style>
