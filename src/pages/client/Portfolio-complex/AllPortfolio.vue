<template>
  <div class="content">
    <div class="content-item">
      <BookList
          title="汇总投组"
          subtitle="投组名称"
          :list="initialSumBooks"
          :activeItem="activeSumBook"
          @select="item => handleSelect('activeSumBook', item)"
      />
    </div>

    <div class="content-item">
      <BookList
          title="包含的投组"
          subtitle="投组名称"
          :list="initialBooks"
      />
    </div>
  </div>
</template>

<script>
import BookList from "@/pages/client/Portfolio-complex/complex/BookList.vue";

export default {
  name: "AllPortfolio",
  components: {BookList},
  props: {
    initialSumBooks: {
      type: Array,
      default: () => []
    },
    initialBooks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeSumBook: null,
    };
  },
  methods: {
    handleSelect(activeKey, item) {
      if (this[activeKey] === item.name) {
        this[activeKey] = null;
      } else {
        this[activeKey] = item.name;
      }
    }
  }
};
</script>

<style scoped lang="less">
.content {
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  height: 100%;
  color: white;

  .content-item {
    width: 48%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
