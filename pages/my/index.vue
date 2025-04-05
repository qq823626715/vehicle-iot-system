<template>
  <view class="my-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-section">
        <image 
          :src="'/static/icons/avatar-default.png'" 
          class="avatar"
          @click="handleAvatarClick"
        />
        <view class="user-meta">
          <text class="username">{{ userInfo.nickname || '未登录' }}</text>
          <text class="phone">{{ userInfo.phone || '点击登录账号' }}</text>
        </view>
      </view>
      
      <view class="action-buttons">
        <button 
          v-if="!isLogin" 
          type="primary" 
          size="mini"
          @click="handleLogin"
        >
          立即登录
        </button>
        <button 
          v-else 
          type="default" 
          size="mini"
          @click="handleEditProfile"
        >
          编辑资料
        </button>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-list">
      <navigator 
        url="/pages/management/index" 
        class="menu-item"
      >
        <uni-icons type="car" size="20" color="#1c1c1c" />
        <text>车辆管理</text>
        <uni-icons type="arrowright" size="16" color="#999" />
      </navigator>

      <navigator 
        url="/pages/my/bind-car" 
        class="menu-item"
      >
        <uni-icons type="plus" size="20" color="#1c1c1c" />
        <text>车辆绑定</text>
        <uni-icons type="arrowright" size="16" color="#999" />
      </navigator>

      <navigator 
        url="/pages/my/settings" 
        class="menu-item"
      >
        <uni-icons type="gear" size="20" color="#1c1c1c" />
        <text>设置</text>
        <uni-icons type="arrowright" size="16" color="#999" />
      </navigator>
    </view>
    <PageBg />
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: '',
        nickname: '',
        phone: ''
      },
      isLogin: false
    }
  },
  onShow() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      // 实际项目中替换为真实的登录状态检查
      const token = uni.getStorageSync('token')
      if (token) {
        this.isLogin = true
        this.getUserInfo()
      }
    },
    getUserInfo() {
      // 模拟获取用户信息
      this.userInfo = {
        avatar: '/static/avatar-demo.jpg',
        nickname: '新能源车主',
        phone: '138****8888'
      }
    },
    handleLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    },
    handleEditProfile() {
      uni.navigateTo({
        url: '/pages/my/profile'
      })
    },
    handleAvatarClick() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0]
          // 实际项目这里需要上传图片到服务器
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.my-page {
  padding: map-get($spacing, 'base');
}

.user-card {
  @include card-style;
  padding: map-get($spacing, 'large');
  margin-bottom: map-get($spacing, 'large');
  
  .avatar-section {
    @include flex-align-center;
    margin-bottom: map-get($spacing, 'base');
    
    .avatar {
      @include square(60px);
      border-radius: 50%;
      margin-right: map-get($spacing, 'base');
    }
    
    .user-meta {
      flex: 1;
      
      .username {
        @include text-primary;
        font-size: 18px;
        font-weight: bold;
        display: block;
        margin-bottom: 4px;
      }
      
      .phone {
        @include text-secondary;
        font-size: 14px;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    
    button {
      margin-left: map-get($spacing, 'base');
    }
  }
}

.menu-list {
  background: map-get($theme-colors, 'content-bg');
  border-radius: map-get($border-radius, 'base');
  overflow: hidden;
  
  .menu-item {
    @include flex-between;
    padding: map-get($spacing, 'base') map-get($spacing, 'large');
    border-bottom: 1px solid map-get($theme-colors, 'border');
    
    &:active {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    text {
      flex: 1;
      margin-left: map-get($spacing, 'base');
    }
  }
}
</style>