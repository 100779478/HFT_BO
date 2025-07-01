<template>
  <div class="header-content">
    <div class="market-info">
      <Tooltip theme="light" max-width="800" :transfer="true" placement="right">
        <Icon type="md-settings" size="18" style="margin-right: 5px;cursor: pointer"
              @click="$emit('marketSetting')"/>
        <Icon type="md-alert" size="18"/>
        <span style="font-weight: normal">做市说明</span>
        <div slot="content">
          <div class="color-info">
            <p><strong>图标说明：</strong></p>
            <ol style="margin-left: 20px;">
              <li><i class="icon iconfont icon-NEW-copy"/>今日新上市的债券</li>
              <li><i class="icon iconfont icon-yk_yuanquan_fill"/>当前债券做市情况为：未报</li>
              <li><i class="icon iconfont icon-shibai"/>当前债券做市情况为：失败</li>
              <li><i class="icon iconfont icon-warn"/>当前债券做市情况为：警告</li>
              <li><i class="icon iconfont icon-kedabiao"/>当前债券做市情况为：可达标</li>
              <li><i class="icon iconfont icon-chenggong"/>当前债券做市情况为：已达标</li>
            </ol>
            <p><strong>操作说明：</strong></p>
            <ol style="margin-left: 20px;">
              <li>双击债券可查看详细信息。</li>
              <li>点击标题旁的
                <Icon type='ios-arrow-down'/>
                可收缩或展开做市面板。
              </li>
            </ol>
            <p><strong v-show="logicDescription">业务说明：</strong></p>
            <div>
              {{ logicDescription }}
              <br>
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
    <!--      <div class="title-info" @dblclick="viewRemindMessage">-->
    <!--        {{ data?.remindMessage }}-->
    <!--      </div>-->
    <div class="market-data">
      更新时间：<span class="market-data-value">{{ updateTime ?? '--:--:--' }}</span>
      已报：<span class="market-data-value">{{ madeCount ?? '--' }}</span>
      已达标：<span class="market-data-value">{{ successCount ?? '--' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MarketHeader",
  props: {
    logicDescription: String,
    madeCount: Number,
    successCount: Number,
    updateTime:String,
  }
}
</script>

<style scoped lang="less">
.header-content {
  display: flex;
  font-size: 14px;
  align-items: center;
  font-weight: bolder;
  background-color: var(--background-color);
  color: var(--text-color);
}

.market-info {
  font-size: 14px;
  width: 120px;
  white-space: nowrap;
  padding-right: 15px;
  z-index: 999;
  text-align: center;
  background-color: var(--background-color);
}

@keyframes init-scroll {
  0% {
    transform: translateX(100%); /* 瞬间跳到100%（右侧外部） */
  }
  100% {
    transform: translateX(-100%); /* 从100%位置开始，继续向左移动到-600px */
  }
}

@keyframes scroll {
  0% {
    transform: translateX(100%); /* 瞬间跳到100%（右侧外部） */
  }
  100% {
    transform: translateX(-100%); /* 从100%位置开始，继续向左移动到-600px */
  }
}

.title-info {
  //overflow: hidden;
  will-change: transform;
  font-weight: bolder;
  width: auto;
  color: red;
  display: inline-block; /* 确保文字在一行内 */
  white-space: nowrap; /* 确保文字不换行 */
  animation: init-scroll 50s linear, scroll 50s linear 5s infinite;
  margin-left: 30px;
}

.market-data {
  position: absolute;
  right: 0;
  font-size: 14px;
  min-width: 170px; /* 最小宽度 */
  width: auto; /* 宽度自适应 */
  font-weight: normal; /* 默认字体不加粗 */
  z-index: 999;
  white-space: nowrap;
  text-align: right;
  padding: 0 10px 0 30px;
  background-color: var(--background-color);

  .market-data-value {
    font-weight: bold; /* 数据加粗 */
  }
}

.title-info:hover {
  animation-play-state: paused;
}

.color-info {
  //color: var(--text-color);
  color: #3c4860;
  margin-top: 10px;
}

</style>