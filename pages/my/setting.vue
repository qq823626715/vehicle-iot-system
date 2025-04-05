<template>
  <view class="settings-page">
    <view class="menu-list">
      <view class="menu-item" @click="handleAccount">
        <text>账号安全</text>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>
      
      <view class="menu-item" @click="handleNotification">
        <text>消息通知</text>
        <switch checked />
      </view>
      
      <view class="menu-item" @click="handleClearCache">
        <text>清除缓存</text>
        <text class="cache-size">12.5MB</text>
      </view>
      
      <button 
        class="logout-btn" 
        type="warn" 
        @click="handleLogout"
      >
        退出登录
      </button>
    </view>
    <PageBg />
  </view>
</template>

<script>
export default {
  components: {
  },
  methods: {
    handleAccount() {
      uni.navigateTo({
        url: '/pages/my/account-safety'
      })
    },
    handleClearCache() {
      uni.showLoading({ title: '清理中' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }, 800)
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.reLaunch({
              url: '/pages/my/index'
            })
          }
        }
      })
    }
  }
}
</script>