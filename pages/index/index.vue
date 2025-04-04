<template>
  <view class="container">
    <view class="header">
      <text class="title">车辆物联管理系统</text>
      <text class="subtitle">当前用户: {{username}}</text>
    </view>
    
    <view class="grid">
      <navigator url="/pages/status/index" class="grid-item">
        <image src="/static/icons/status.png" class="icon"></image>
        <text>状态监控</text>
      </navigator>
      
      <navigator url="/pages/faults/index" class="grid-item">
        <image src="/static/icons/fault.png" class="icon"></image>
        <text>历史故障</text>
      </navigator>
      
      <navigator url="/pages/security/index" class="grid-item">
        <image src="/static/icons/security.png" class="icon"></image>
        <text>安全防护</text>
      </navigator>
      
      <navigator url="/pages/management/index" class="grid-item">
        <image src="/static/icons/management.png" class="icon"></image>
        <text>车辆管理</text>
      </navigator>
      
      <navigator url="/pages/ota/index" class="grid-item">
        <image src="/static/icons/ota.png" class="icon"></image>
        <text>OTA更新</text>
      </navigator>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '管理员'
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.grid-item {
  width: 48%;
  height: 120px;
  background: #f5f5f5;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}
</style>