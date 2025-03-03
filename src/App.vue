<template>
  <div id="app">
    <!-- 上层红色闪烁覆盖层 -->
    <div v-if="showFlash" :class="['flash-overlay',overlayClass]"></div>
    <!-- 下层内容 -->
    <router-view style="height: 100%"></router-view>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      showFlash: false,
      overlayClass: "",
    }
  },
  computed: {
    ...mapState({
      myState: state => state.makeStatus.status,
      systems: state => state.makeStatus.system,
    }),
  },
  watch: {
    // 监听 myState
    myState(newVal) {
      this.updateShowFlash(newVal, this.systems.isFullScreenAlert);
    },
    // 监听 systems.isFullScreenAlert
    'systems.isFullScreenAlert'(newVal) {
      this.updateShowFlash(this.myState, newVal);
    }
  },
  methods: {
    updateShowFlash(myState, isFullScreenAlert) {
      // this.showFlash = (this.$route.name === 'MakeMarket' || this.$route.name === 'Monitor') && myState === '0' && isFullScreenAlert;
      const isMonitorRoute = this.$route.name === "MakeMarket" || this.$route.name === "MonitorStatus";
      this.showFlash = isMonitorRoute && myState !== "1" && isFullScreenAlert;
      if (this.showFlash) {
        if (myState === '2') {
          this.overlayClass = "week-warn";
        } else if (myState === '3') {
          this.overlayClass = "strong-warn";
        } else {
          this.overlayClass = ""; // 清空类名
        }
      }
    }
  },
  updated() {
    this.updateShowFlash(this.myState, this.systems.isFullScreenAlert)
  },
};
</script>

<style>
@import "style/global.css";

:root {
  --modal-backcolor: #FFFFFF;
  --text-color: #fff;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.flash-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
}

.week-warn {
  border: 5px solid rgba(255, 0, 0, 0.49);
  background: radial-gradient(transparent 70%, red);
  animation: flash 1s infinite;
}

.strong-warn {
  border: 5px solid rgba(255, 0, 0, 0.1);
  opacity: 0.8;
  background: radial-gradient(transparent 60%, red);
}
</style>
