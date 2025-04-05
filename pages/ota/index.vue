<template>
  <view class="container">
    <view class="header">
      <text class="title">OTA远程升级</text>
    </view>
    
    <view class="ota-card" v-if="currentVersion">
      <view class="ota-header">
        <text>当前版本</text>
        <text class="version">{{currentVersion}}</text>
      </view>
      
      <view class="ota-progress" v-if="updating">
        <progress :percent="progress" stroke-width="10" activeColor="#4CAF50" />
        <text class="progress-text">{{progress}}%</text>
        <text class="status-text">{{statusText}}</text>
      </view>
      
      <view class="ota-update" v-else-if="hasUpdate">
        <text class="update-title">发现新版本 {{latestVersion}}</text>
        <text class="update-desc">{{updateDescription}}</text>
        <button type="primary" @click="startUpdate">立即更新</button>
      </view>
      
      <view class="ota-up-to-date" v-else>
        <image src="/static/icons/check.png" class="check-icon"></image>
        <text>当前已是最新版本</text>
      </view>
    </view>
    
    <view class="ota-history">
      <view class="history-header">
        <text>更新历史</text>
      </view>
      
      <view class="history-item" v-for="(item, index) in history" :key="index">
        <text class="version">{{item.version}}</text>
        <text class="date">{{item.date}}</text>
        <text class="desc">{{item.description}}</text>
      </view>
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
      currentVersion: 'V2.1.5',
      latestVersion: 'V2.2.0',
      hasUpdate: true,
      updating: false,
      progress: 0,
      statusText: '准备更新...',
      updateDescription: '1. 优化车辆状态监控算法\n2. 新增电子围栏功能\n3. 修复已知问题',
      history: [
        {
          version: 'V2.1.5',
          date: '2023-04-10',
          description: '性能优化和小问题修复'
        },
        {
          version: 'V2.1.0',
          date: '2023-03-01',
          description: '新增故障诊断功能'
        },
        {
          version: 'V2.0.0',
          date: '2023-01-15',
          description: '全新UI界面和功能架构'
        }
      ]
    }
  },
  methods: {
    startUpdate() {
      this.updating = true
      this.progress = 0
      this.statusText = '下载更新包...'
      
      // 模拟下载过程
      const timer = setInterval(() => {
        this.progress += 5
        if (this.progress >= 30) {
          this.statusText = '校验文件...'
        } else if (this.progress >= 60) {
          this.statusText = '安装更新...'
        } else if (this.progress >= 90) {
          this.statusText = '即将完成...'
        }
        
        if (this.progress >= 100) {
          clearInterval(timer)
          this.statusText = '更新完成!'
          setTimeout(() => {
            this.currentVersion = this.latestVersion
            this.hasUpdate = false
            this.updating = false
            uni.showToast({
              title: '更新成功',
              icon: 'success'
            })
          }, 1000)
        }
      }, 300)
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


.ota-card {
  @include card-style;

  &-header {
    @include flex-between;
    margin-bottom: map-get($spacing, 'base');

    .version {
      color: map-get($theme-colors, 'primary');
    }
  }
}

.ota-progress {
  text-align: center;
  margin: map-get($spacing, 'base') 0;

  progress {
    @include progress-bar;
  }

  .progress-text {
    @include text-primary;
    margin-top: map-get($spacing, 'sm');
  }
}

.ota-history {
  .history-header {
    @include text-primary;
    margin-bottom: map-get($spacing, 'sm');
  }

  .history-item {
    padding: map-get($spacing, 'base') 0;
    border-bottom: 1px solid map-get($theme-colors, 'border');

    .version {
      color: map-get($theme-colors, 'primary');
      margin-right: map-get($spacing, 'sm');
    }

    .date {
      @include text-tertiary;
      font-size: 12px;
    }

    .desc {
      @include text-secondary;
      margin-top: map-get($spacing, 'sm');
    }
  }
}
</style>
