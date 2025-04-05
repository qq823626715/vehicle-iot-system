<template>
  <view class="container">
    <view class="header">
      <text class="title">车辆安全防护</text>
    </view>
    
    <view class="security-status">
      <text class="status-text" :class="{'warning': !securityStatus.allSecure}">
        {{securityStatus.allSecure ? '所有系统正常' : '检测到安全问题!'}}
      </text>
    </view>
    <view class="card">
      <view class="card-header">
        <text>消防系统状态</text>
        <text class="status" :class="{'active': securityStatus.fireProtection}">
          {{securityStatus.fireProtection ? '异常' : '正常'}}
        </text>
      </view>
      <text class="card-desc">检测消防系统状态</text>
    </view>
    <!-- <view class="card">
      <view class="card-header">
        <text>防盗系统</text>
        <switch :checked="securityStatus.antiTheft" @change="toggleAntiTheft" color="#4CAF50"></switch>
      </view>
      <text class="card-desc">启用后，车辆非法移动将触发报警</text>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text>碰撞检测</text>
        <text class="status" :class="{'active': securityStatus.collision}">
          {{securityStatus.collision ? '已触发' : '正常'}}
        </text>
      </view>
      <text class="card-desc">检测到碰撞时自动发送位置信息</text>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text>电子围栏</text>
        <switch :checked="securityStatus.geoFence" @change="toggleGeoFence" color="#4CAF50"></switch>
      </view>
      <text class="card-desc">车辆超出设定区域时发送警报</text>
      <button size="mini" @click="setGeoFence">设置围栏</button>
    </view> -->
    <view class="card">
      <view class="card-header">
        <text>位置信息</text>
      </view>
      <map :latitude="location.latitude" :longitude="location.longitude" class="map"></map>
    </view>
    
    <view class="emergency">
      <button type="warn" @click="emergencyCall">紧急求助</button>
    </view>
    <PageBg />
  </view>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      securityStatus: {
        allSecure: true,
        antiTheft: true,
        collision: false,
        fireProtection: false,
        geoFence: false
      },
      location: {
        latitude: 28.578,
        longitude: 121.534
      }
    }
  },
  methods: {
    toggleAntiTheft(e) {
      this.securityStatus.antiTheft = e.detail.value
      this.checkAllSecure()
      uni.showToast({
        title: e.detail.value ? '防盗系统已启用' : '防盗系统已关闭',
        icon: 'none'
      })
    },
    toggleGeoFence(e) {
      this.securityStatus.geoFence = e.detail.value
      this.checkAllSecure()
    },
    checkAllSecure() {
      this.securityStatus.allSecure = !this.securityStatus.collision && 
                                   (this.securityStatus.geoFence || this.securityStatus.antiTheft)
    },
    setGeoFence() {
      uni.showModal({
        title: '设置电子围栏',
        content: '请在地图上绘制电子围栏区域',
        success(res) {
          if (res.confirm) {
            uni.showToast({
              title: '电子围栏设置成功',
              icon: 'success'
            })
          }
        }
      })
    },
    emergencyCall() {
      uni.showActionSheet({
        title: '紧急求助',
        itemList: ['呼叫车主', '联系客服', '报警'],
        success(res) {
          const actions = ['正在呼叫车主...', '正在联系客服...', '正在拨打110...']
          uni.showToast({
            title: actions[res.tapIndex],
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

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


.security-status {
  @include card-style;
  background: map-get($theme-colors, 'primary');
  text-align: center;
  margin-bottom: map-get($spacing, 'base');

  &.warning {
    background: map-get($theme-colors, 'error');
  }
}

.card {
  @include card-style;
  margin-bottom: map-get($spacing, 'base');

  &-header {
    @include flex-between;
    align-items: center;
    margin-bottom: map-get($spacing, 'sm');

    .status {
      color: map-get($theme-colors, 'text-secondary');
      
      &.active {
        color: map-get($theme-colors, 'error');
        font-weight: bold;
      }
    }
  }

  &-desc {
    @include text-secondary;
    margin-bottom: map-get($spacing, 'sm');
  }
}

.emergency {
  margin-top: map-get($spacing, 'lg');
  text-align: center;
}
</style>
