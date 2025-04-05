<template>
  <view class="container">
    <!-- 顶部车辆选择器 -->
    <vehicle-selector @change="handleVehicleChange" />
    
    <!-- 主卡片内容 -->
    <view class="ota-card">
      <!-- 当前版本信息 -->
      <view class="ota-header">
        <text>当前版本信息</text>
        <text class="version">{{currentVehicle.vcuVersion}} / {{currentVehicle.driveVersion}} / {{currentVehicle.pumpVersion}}</text>
      </view>
      
      <!-- 更新模块选择 -->
      <view class="module-selection">
        <text class="section-title">选择更新模块</text>
        <view class="module-grid">
          <view 
            class="module-item" 
            v-for="module in modules" 
            :key="module.id"
            :class="{ 'active': selectedModule === module.id }"
            @click="selectModule(module.id)"
          >
            <image :src="module.icon" class="module-icon"></image>
            <text class="module-name">{{module.name}}</text>
          </view>
        </view>
      </view>
      
      <!-- 固件文件选择 -->
      <view class="firmware-selection">
        <text class="section-title">选择固件文件</text>
        <view class="file-picker">
          <picker @change="onFileChange" :range="filteredFirmwareFiles" range-key="name">
            <view class="picker-content">
              <text>{{selectedFile.name || '请选择固件文件'}}</text>
              <text class="icon">▼</text>
            </view>
          </picker>
        </view>
        <view class="file-info" v-if="selectedFile.name">
          <text class="info-item">版本: {{selectedFile.version}}</text>
          <text class="info-item">大小: {{selectedFile.size}}</text>
          <text class="info-item">日期: {{selectedFile.date}}</text>
        </view>
      </view>
      
      <!-- 更新进度 -->
      <view class="ota-progress" v-if="updating">
        <progress :percent="progress" stroke-width="10" activeColor="#4CAF50" />
        <view class="progress-info">
          <text class="progress-text">{{progress}}%</text>
          <text class="status-text">{{statusText}}</text>
        </view>
      </view>
      
      <!-- 更新按钮 -->
      <button 
        type="primary" 
        class="update-btn" 
        @click="startUpdate"
        :disabled="!selectedModule || !selectedFile.name || updating"
      >
        {{updating ? '更新中...' : '开始更新'}}
      </button>
    </view>
    
    <!-- 更新历史 -->
    <view class="ota-history">
      <view class="history-header">
        <text>更新历史记录</text>
      </view>
      
      <view class="history-item" v-for="(item, index) in history" :key="index">
        <view class="history-header">
          <text class="version">{{item.version}}</text>
          <text class="date">{{item.date}}</text>
        </view>
        <text class="module">{{item.module}}模块</text>
        <text class="desc">{{item.description}}</text>
      </view>
    </view>
    
    <PageBg />
  </view>
</template>

<script>
import VehicleSelector from '@/components/VehicleSelector.vue'

export default {
  components: {
    VehicleSelector
  },
  data() {
    return {
      currentVehicle: {
        vin: 'LSVNV133X111111111',
        name: '电动叉车-01',
        vcuVersion: 'v2.1.3',
        pumpVersion: 'v1.5.2',
        driveVersion: 'v3.0.1'
      },
      selectedModule: null,
      modules: [
        { id: 'vcu', name: 'VCU', icon: '/static/icons/vcu.png' },
        { id: 'drive', name: '行驶系统', icon: '/static/icons/drive.png' },
        { id: 'pump', name: '油泵系统', icon: '/static/icons/pump.png' }
      ],
      selectedFile: {},
      firmwareFiles: [
        { 
          name: 'VCU_v2.2.0.bin', 
          version: 'v2.2.0', 
          size: '2.4MB', 
          date: '2023-05-20',
          module: 'vcu'
        },
        { 
          name: 'Drive_v3.1.0.bin', 
          version: 'v3.1.0', 
          size: '1.8MB', 
          date: '2023-05-18',
          module: 'drive'
        },
        { 
          name: 'Pump_v1.6.0.bin', 
          version: 'v1.6.0', 
          size: '1.2MB', 
          date: '2023-05-15',
          module: 'pump'
        }
      ],
      updating: false,
      progress: 0,
      statusText: '准备更新...',
      history: [
        {
          version: 'v2.1.3',
          date: '2023-04-10',
          module: 'VCU',
          description: '性能优化和小问题修复'
        },
        {
          version: 'v3.0.1',
          date: '2023-03-01',
          module: '行驶系统',
          description: '新增故障诊断功能'
        },
        {
          version: 'v1.5.2',
          date: '2023-01-15',
          module: '油泵系统',
          description: '全新控制算法'
        }
      ]
    }
  },
  computed: {
    filteredFirmwareFiles() {
      if (!this.selectedModule) return []
      return this.firmwareFiles.filter(file => file.module === this.selectedModule)
    }
  },
  methods: {
    handleVehicleChange(vehicle) {
      this.currentVehicle = vehicle
      // 重置选择状态
      this.selectedModule = null
      this.selectedFile = {}
    },
    selectModule(moduleId) {
      this.selectedModule = moduleId
      this.selectedFile = {}
    },
    onFileChange(e) {
      console.log(e)
      this.selectedFile = this.filteredFirmwareFiles[e.detail.value] || {}
    },
    startUpdate() {
      if (!this.selectedModule || !this.selectedFile.name) return
      
      this.updating = true
      this.progress = 0
      this.statusText = '准备更新...'
      
      // 模拟更新过程
      const timer = setInterval(() => {
        this.progress += 2
        if (this.progress >= 20) {
          this.statusText = '校验文件中...'
        } else if (this.progress >= 50) {
          this.statusText = '写入存储器...'
        } else if (this.progress >= 80) {
          this.statusText = '验证固件...'
        }
        
        if (this.progress >= 100) {
          clearInterval(timer)
          this.statusText = '更新完成!'
          
          // 更新车辆版本信息
          if (this.selectedModule === 'vcu') {
            this.currentVehicle.vcuVersion = this.selectedFile.version
          } else if (this.selectedModule === 'drive') {
            this.currentVehicle.driveVersion = this.selectedFile.version
          } else if (this.selectedModule === 'pump') {
            this.currentVehicle.pumpVersion = this.selectedFile.version
          }
          
          // 添加到历史记录
          this.history.unshift({
            version: this.selectedFile.version,
            date: new Date().toISOString().split('T')[0],
            module: this.modules.find(m => m.id === this.selectedModule).name,
            description: `手动更新${this.selectedFile.name}`
          })
          
          setTimeout(() => {
            this.updating = false
            uni.showToast({
              title: '更新成功',
              icon: 'success'
            })
          }, 1000)
        }
      }, 200)
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

.ota-card {
  @include card-style;
  margin-bottom: map-get($spacing, base);
}

.ota-header {
  @include flex-between;
  padding-bottom: map-get($spacing, base);
  border-bottom: 1px solid map-get($theme-colors, border);
  
  .version {
    @include text-secondary;
    font-size: map-get($font-size, sm);
  }
}

.module-selection {
  margin: map-get($spacing, base) 0;
  
  .section-title {
    @include text-primary;
    font-weight: bold;
    margin-bottom: map-get($spacing, sm);
  }
  
  .module-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: map-get($spacing, sm);
    
    .module-item {
      @include flex-center;
      flex-direction: column;
      padding: map-get($spacing, base);
      border-radius: map-get($border-radius, sm);
      background: rgba(map-get($theme-colors, border), 0.1);
      transition: all 0.2s;
      
      &.active {
        background: rgba(map-get($theme-colors, primary), 0.1);
        border: 1px solid map-get($theme-colors, primary);
      }
      
      .module-icon {
        width: 40px;
        height: 40px;
        margin-bottom: map-get($spacing, xs);
      }
      
      .module-name {
        @include text-primary;
        font-size: map-get($font-size, sm);
      }
    }
  }
}

.firmware-selection {
  margin: map-get($spacing, base) 0;
  
  .section-title {
    @include text-primary;
    font-weight: bold;
    margin-bottom: map-get($spacing, sm);
  }
  
  .file-picker {
    .picker-content {
      @include card-style;
      @include flex-between;
      padding: map-get($spacing, sm);
      
      .icon {
        @include text-tertiary;
      }
    }
  }
  
  .file-info {
    margin-top: map-get($spacing, sm);
    
    .info-item {
      display: block;
      @include text-secondary;
      font-size: map-get($font-size, sm);
      margin-bottom: map-get($spacing, xs);
    }
  }
}

.ota-progress {
  margin: map-get($spacing, base) 0;
  
  progress {
    @include progress-bar;
  }
  
  .progress-info {
    @include flex-between;
    margin-top: map-get($spacing, xs);
    
    .progress-text {
      @include text-primary;
    }
    
    .status-text {
      @include text-secondary;
      font-size: map-get($font-size, sm);
    }
  }
}

.update-btn {
  margin-top: map-get($spacing, base);
}

.ota-history {
  @include card-style;
  
  .history-header {
    @include text-primary;
    font-weight: bold;
    padding-bottom: map-get($spacing, sm);
    border-bottom: 1px solid map-get($theme-colors, border);
  }
  
  .history-item {
    padding: map-get($spacing, base) 0;
    border-bottom: 1px solid rgba(map-get($theme-colors, border), 0.5);
    
    &:last-child {
      border-bottom: none;
    }
    
    .history-header {
      @include flex-between;
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .version {
      color: map-get($theme-colors, primary);
    }
    
    .date {
      @include text-tertiary;
      font-size: map-get($font-size, sm);
    }
    
    .module {
      display: block;
      @include text-secondary;
      font-size: map-get($font-size, sm);
      margin: map-get($spacing, xs) 0;
    }
    
    .desc {
      @include text-secondary;
      font-size: map-get($font-size, sm);
    }
  }
}
</style>