<template>
  <div class="battery-icon" :class="batteryClass"></div>
</template>

<script>
export default {
  name: 'BatteryIcon',
  props: {
    cpuUse: {
      type: Number,
      required: true,
    },
  },
  computed: {
    batteryClass() {
      const usage = this?.cpuUse;
      if (usage === 0) return 'battery-empty';
      if (usage < 30) return 'battery-low';
      if (usage <= 50) return 'battery-medium';
      return 'battery-high';
    },
  },
};
</script>

<style scoped>
.battery-icon {
  width: 20px;
  height: 12px;
  margin: auto 0 auto 5px;
  border-radius: 1px;
  border: 2px solid #989696;
  position: relative;
  background: #FFFFFF;
}

.battery-empty::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0;
}

.battery-low::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #95F204;
  width: 33%;
}

.battery-medium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: orange;
  width: 66%;
}

.battery-high::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: red;
  width: 80%;
}
</style>
