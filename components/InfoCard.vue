<!--
 * @Description: 车辆基础信息卡片
-->
<template>
  <view class="card">
    <view class="card-header">
      <text>当前车辆信息</text>
      <text class="time">{{currentTime}}</text>
    </view>
    
    <view class="status-grid">
      <view class="status-item">
        <text class="label">名称：</text>
        <text class="value">{{ selectedCar.name }}</text>
      </view>
      <view class="status-item">
        <text class="label">VIN：</text>
        <text class="value">{{selectedCar.vin}}</text>
      </view>
      <view class="status-item">
        <text class="label">vcu版本：</text>
        <text class="value">{{selectedCar.vcuVerion}}</text>
      </view>
      <view class="status-item">
        <text class="label">油泵版本：</text>
        <text class="value">{{selectedCar.oilPumpVersion}}</text>
      </view>
      <view class="status-item">
        <text class="label">行驶软件版本：</text>
        <text class="value">{{selectedCar.driveVersion}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'InfoCard',
  components: {},
  data() {
    return {
      currentTime: '',
      status: {
        speed: 60,
        rpm: 2200,
        temperature: 85,
        fuel: 45
      },
      carList: [
        { name: '叉车 1', vin: '12345678901234567', vcuVerion: 'v1.2.3', oilPumpVersion: 'v1.2.3', driveVersion: 'v1.2.3' }
      ],
      selectedCar: { name: '叉车 1', vin: '12345678901234567', vcuVerion: 'v1.2.3', oilPumpVersion: 'v1.2.3', driveVersion: 'v1.2.3' },
      carIndex: 0
    }
  },
  created() {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';
.card {
  @include card-style;
  
  &-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: map-get($spacing, small);
    font-weight: bold;
    
    .time {
      color: map-get($theme-colors, text-tertiary);
      font-size: 12px;
    }
  }
}

.status-grid {
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  // gap: map-get($spacing, base);
  
  &-item {
    background: rgba(40, 40, 40, 0.5);
    padding: map-get($spacing, small);
    border-radius: map-get($border-radius, small);
    margin-bottom: 16px;
    .label {
      @include text-ellipsis;
      font-size: 12px;
      color: map-get($theme-colors, text-secondary);
    }
    
    .value {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
