<template>
  <view class="container">
    <view class="header">
      <text class="title">车辆状态监控</text>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text>实时数据</text>
        <text class="time">{{currentTime}}</text>
      </view>
      
      <view class="status-grid">
        <view class="status-item">
          <text class="label">车速</text>
          <text class="value">{{status.speed | fixedTwo }} km/h</text>
        </view>
        <view class="status-item">
          <text class="label">发动机转速</text>
          <text class="value">{{status.rpm | fixedTwo}} rpm</text>
        </view>
        <view class="status-item">
          <text class="label">水温</text>
          <text class="value">{{status.temperature | fixedTwo}} °C</text>
        </view>
        <view class="status-item">
          <text class="label">剩余油量</text>
          <text class="value">{{status.fuel | fixedTwo}} %</text>
        </view>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text>位置信息</text>
      </view>
      <map :latitude="location.latitude" :longitude="location.longitude" class="map"></map>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTime: '',
      status: {
        speed: 60,
        rpm: 2200,
        temperature: 85,
        fuel: 45
      },
      location: {
        latitude: 39.909,
        longitude: 116.397
      }
    }
  },
  filters: {
    fixedTwo(num) {
      return num && typeof num === 'number' ? num.toFixed(2) : num 
    }
  },
  mounted() {
    this.updateTime()
    setInterval(this.updateTime, 1000)
    // 模拟实时数据更新
    setInterval(() => {
      this.status.speed = Math.max(0, this.status.speed + (Math.random() - 0.5) * 5)
      this.status.rpm = Math.max(800, this.status.rpm + (Math.random() - 0.5) * 100)
      this.status.temperature = Math.max(70, Math.min(110, this.status.temperature + (Math.random() - 0.5) * 2))
      this.status.fuel = Math.max(0, Math.min(100, this.status.fuel - 0.1))
    }, 2000)
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

.container {
  padding: map-get($spacing, base);
}

.header {
  margin-bottom: map-get($spacing, large);
  .title {
    font-size: 20px;
    font-weight: 600;
    color: map-get($theme-colors, text-primary);
  }
  .subtitle {
    font-size: 14px;
    color: map-get($theme-colors, text-secondary);
  }
}

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: map-get($spacing, base);
  
  &-item {
    background: rgba(40, 40, 40, 0.5);
    padding: map-get($spacing, small);
    border-radius: map-get($border-radius, small);
    
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

.map-container {
  filter: brightness(0.8) contrast(1.2);
  height: 200px;
  border-radius: map-get($border-radius, small);
  overflow: hidden;
}
</style>
