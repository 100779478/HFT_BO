<template>
  <div class="content">
    <div class="content-item">
      <BookList
          title="汇总投组"
          subtitle="投组名称"
          :list="sumBookList"
          :activeItem="activeSumBook"
          :addable="true"
          :deletable="true"
          @add="item => handleAdd('sumBookList', item)"
          @delete="item => handleDelete('sumBookList', item)"
          @select="item => handleSelect('activeSumBook', item)"
      />
    </div>
    <div class="content-item">
      <BookList
          title="包含的投组"
          subtitle="投组名称"
          :list="currentIncludeBookList"
          :activeItem="activeIncludeBook"
          :deletable="true"
          @select="item => handleSelect('activeIncludeBook', item)"
          @delete="item=>handleDeleteIncludeBook(item)"
      />
    </div>
    <div class="content-operate">
      <Button class="content-button" @click="moveBookList"> ⇦</Button>
    </div>
    <div class="content-item">
      <BookList
          title="投组列表"
          subtitle="投组名称"
          :list="bookList"
          :activeItem="activeBook"
          :addable="true"
          :deletable="true"
          @add="item => handleAdd('bookList', item)"
          @delete="item => handleDelete('bookList', item)"
          @select="item => handleSelect('activeBook', item)"
      />
    </div>
    <ConfirmDialog
        :visible.sync="showConfirm"
        title="删除投组"
        message="你确定要删除当前投组吗？"
        @confirm="onConfirm"
    />
  </div>
</template>

<script>
import BookList from "@/pages/client/Portfolio-complex/complex/BookList.vue";
import ConfirmDialog from "@/pages/client/client-complex/ConfirmDialog.vue";
import showMessage from "@/utils/message";
import {http} from "@/utils/request"
import {URL} from "@/api/serverApi"
import {getUserInfo} from "@/utils/token";

export default {
  name: "MyPortfolio",
  components: {ConfirmDialog, BookList},
  data() {
    return {
      activeSumBook: null,
      activeIncludeBook: null,
      activeBook: null,
      sumBookList: [],
      bookList: [],
      showConfirm: false,
      deleteTarget: {
        listKey: '',
        item: null,
      },
    }
  },
  created() {
    this.getBookList()
    this.getSumBookList()
  },
  computed: {
    // 根据当前选中的 sumBook 展示 includeBook 列表
    currentIncludeBookList() {
      const current = this.sumBookList.find(i => i.id === this.activeSumBook);
      return current?.portfolios || []
    }
  },
  methods: {
    // 获取所有投组列表
    getBookList() {
      http.get(URL.portfolio, res => {
        this.bookList = res.data.map(item => {
          return {...item, name: item.portfolioName, id: item.portfolioId}
        })
      })
    },
    // 获取所有汇总投组列表
    getSumBookList() {
      http.get(URL.portfolioSum, res => {
        this.sumBookList = res.data.map(item => {
          return {
            ...item,
            name: item.sumPortfolioName,
            id: item.sumPortfolioId,
            portfolios: (item.portfolios || []).map(p => ({
              ...p,
              id: p.portfolioId,
              name: p.portfolioName
            }))
          }
        })
      })
    },
    // 新增一条数据
    handleAdd(listKey, item) {
      const map = {
        sumBookList: {
          url: URL.portfolioSum,
          dataKey: 'sumPortfolioName',
          refresh: this.getSumBookList
        },
        bookList: {
          url: URL.portfolio,
          dataKey: 'portfolioName',
          customerIds: [getUserInfo()],
          refresh: this.getBookList
        }
      };

      const config = map[listKey];
      if (!config) return;

      const payload = {
        [config.dataKey]: item.name,
      };

      // 如果 config 中有 customerIds，则添加进 payload
      if (config.customerIds) {
        payload.customerIds = config.customerIds;
      }

      http.post(config.url, payload, res => {
        if (res.code === '0') {
          showMessage('新增成功')
        }
        config.refresh();
      });
    },
    handleDelete(listKey, item) {
      this.deleteTarget = {
        type: 'list',
        listKey,
        item,
      };
      this.showConfirm = true;
    },
    handleDeleteIncludeBook(item) {
      this.deleteTarget = {
        type: 'include',
        item,
      };
      this.showConfirm = true;
    },
    onConfirm() {
      const {type, listKey, item} = this.deleteTarget;
      const deleteHandlers = {
        list: {
          sumBookList: () => {
            return http.delete(`${URL.portfolioSum}/${item.id}`, {}, res => {
              if (res.code === '0') {
                showMessage('删除成功');
                this.activeSumBook = null;
                this.getSumBookList()
              }
            });
          },
          bookList: () => {
            return http.delete(`${URL.portfolio}/${item.id}`, {}, res => {
              if (res.code === '0') {
                showMessage('删除成功');
                this.activeIncludeBook = null
                this.getSumBookList()
                this.getBookList()
              }
            });
          }
        },
        include: () => {
          if (this.activeSumBook && item?.id) {
            return http.delete(
                URL.portfolioSumRel,
                {sumPortfolioId: this.activeSumBook, portfolioId: item.id},
                res => {
                  if (res.code === '0') {
                    showMessage('删除成功');
                    this.activeBook = null;
                    this.getSumBookList()
                  }
                }
            );
          }
        }
      };
      if (type === 'list' && listKey && deleteHandlers.list[listKey]) {
        deleteHandlers.list[listKey]();
      } else if (type === 'include') {
        deleteHandlers.include();
      }
      this.deleteTarget = {type: '', listKey: '', item: null};
    },
    handleSelect(activeKey, item) {
      this[activeKey] === item.id ? this[activeKey] = null : this[activeKey] = item.id;
    },
    // 添加投组到包含投组
    moveBookList() {
      const currentSumBook = this.sumBookList.find(i => i.id === this.activeSumBook);
      if (!currentSumBook) {
        showMessage('请选择汇总投组', {type: 'error'})
        return
      }
      if (this.activeBook) {
        const exist = currentSumBook.portfolios.some(
            item => item.id === this.activeBook
        );
        if (exist) {
          showMessage('投组名称重复，添加失败', {type: 'error'})
          return;
        }
        // 调用接口添加portfolios(includeBooks)
        http.post(URL.portfolioSumRel, {sumPortfolioId: this.activeSumBook, portfolioId: this.activeBook}, res => {
          if (res.code === '0') {
            showMessage('添加成功')
            this.getSumBookList()
          }
        })
      } else {
        showMessage('请选择要添加的投组', {type: 'error'})
      }
    },
  },
  watch: {
    activeSumBook(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.activeIncludeBook = null;
      }
    },
  }
}
</script>

<style scoped lang="less">
@import "@/style/client.less";
@import "@/style/manage.less";

.content {
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  color: white;
  height: 100%;

  .content-item {
    width: 31%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .content-title {
      padding: 8px;
      text-align: center;
      color: #fff;
      font-weight: bolder;

      .content-info {
        font-weight: normal;
      }
    }

    .content-list {
      background: #1D2B48;
      flex: 1;
      width: 100%;
      padding: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;

      ul {
        list-style: none;

        .list-icon {
          float: right;
          line-height: 20px
        }
      }
    }
  }

  .content-operate {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

</style>