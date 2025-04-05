<template>
  <!-- 模板部分保持不变，只修改class名称 -->
  <view class="vs-container">
    <view class="vs-card" @click="togglePopup">
      <view class="vs-info">
        <text class="vs-vin">VIN: {{ currentVehicle.vin }}</text>
        <text class="vs-name">{{ currentVehicle.name }}</text>
        <view class="vs-versions">
          <text 
            class="vs-version-item"
            v-for="(ver, key) in versionFields" 
            :key="key"
          >
            {{ ver.label }}: {{ currentVehicle[ver.field] }}
          </text>
        </view>
      </view>
      <text class="vs-arrow">▼</text>
    </view>

    <view 
      class="vs-popup" 
      :class="{ 'vs-popup-show': showPopup }"
      @touchmove.stop.prevent="noop"
    >
      <view class="vs-mask" @click="closePopup"></view>
      <view class="vs-popup-content">
        <view class="vs-popup-header">
          <text class="vs-popup-title">选择车辆</text>
          <text class="vs-popup-close" @click="closePopup">×</text>
        </view>
        
        <scroll-view scroll-y class="vs-list">
          <view 
            v-for="item in filteredVehicles" 
            :key="item.vin"
            class="vs-item"
            :class="{ 'vs-item-active': item.vin === currentVehicle.vin }"
            @click="selectVehicle(item)"
          >
            <view class="vs-item-left">
              <text 
                class="vs-check-icon"
                v-if="item.vin === currentVehicle.vin"
              >✓</text>
              <text class="vs-item-name">{{ item.name }}</text>
            </view>
            <text class="vs-item-vin">{{ item.vin }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
      searchQuery: '',
      versionFields: [
        { field: 'vcuVersion', label: 'VCU' },
        { field: 'pumpVersion', label: '油泵' },
        { field: 'driveVersion', label: '行驶' }
      ],
      vehicles: [
        {
          vin: 'LSVNV133X111111111',
          name: '电动叉车-01',
          vcuVersion: 'v2.1.3',
          pumpVersion: 'v1.5.2',
          driveVersion: 'v3.0.1'
        },
        {
          vin: 'LSVNV133X22222222',
          name: '电动叉车-02',
          vcuVersion: 'v2.1.3',
          pumpVersion: 'v1.5.2',
          driveVersion: 'v3.0.1'
        },
        {
          vin: 'LSVNV133X33333333',
          name: '电动叉车-03',
          vcuVersion: 'v2.1.3',
          pumpVersion: 'v1.5.2',
          driveVersion: 'v3.0.1'
        }
      ],
      currentVehicle: {
        vin: 'LSVNV133X111111111',
        name: '电动叉车-01',
        vcuVersion: 'v2.1.3',
        pumpVersion: 'v1.5.2',
        driveVersion: 'v3.0.1'
      }
    }
  },
  computed: {
    filteredVehicles() {
      const query = this.searchQuery.toLowerCase()
      return this.vehicles.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.vin.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    noop() {},
    togglePopup() {
      this.showPopup = !this.showPopup
    },
    closePopup() {
      this.showPopup = false
    },
    selectVehicle(item) {
      if (item.vin === this.currentVehicle.vin) return
      this.currentVehicle = item
      this.$emit('change', item)
      this.closePopup()
    }
  }
}
</script>
<style lang="scss">
/* 使用项目变量和混合，但修改选择器名称 */
@import '@/styles/variables';
@import '@/styles/mixins';

.vs-container {
  position: relative;
  z-index: 10;
}

.vs-card {
  @include flex-between;
  @include card-style;
  padding: map-get($spacing, 'base');
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .vs-info {
    flex: 1;
    
    .vs-vin {
      @include text-tertiary;
      @include text-ellipsis;
      font-size: map-get($font-size, 'sm');
      margin-bottom: 4px;
    }
    
    .vs-name {
      @include text-primary;
      @include text-ellipsis;
      font-size: map-get($font-size, 'lg');
      font-weight: bold;
      margin-bottom: map-get($spacing, 'sm');
    }
    
    .vs-versions {
      @include flex-align-center;
      gap: map-get($spacing, 'sm');
      
      .vs-version-item {
        @include text-secondary;
        font-size: map-get($font-size, 'sm');
        background: rgba(map-get($theme-colors, 'border'), 0.3);
        padding: 2px map-get($spacing, 'sm');
        border-radius: map-get($border-radius, 'sm');
        margin-right: 8px;
      }
    }
  }
  
  .vs-arrow {
    color: map-get($theme-colors, 'text-tertiary');
    margin-left: map-get($spacing, 'base');
  }
}

/* 弹窗样式 */
.vs-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &.vs-popup-show {
    visibility: visible;
    opacity: 1;
    
    .vs-popup-content {
      transform: translateY(0);
    }
  }
}

.vs-mask {
  @include square(100%);
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
}

.vs-popup-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: map-get($theme-colors, 'content-bg');
  border-radius: map-get($border-radius, 'lg') map-get($border-radius, 'lg') 0 0;
  padding: map-get($spacing, 'base');
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  max-height: 70vh;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.vs-popup-header {
  @include flex-between;
  padding-bottom: map-get($spacing, 'base');
  border-bottom: 1px solid map-get($theme-colors, 'border');
  
  .vs-popup-title {
    @include text-primary;
    font-size: map-get($font-size, 'xl');
    font-weight: bold;
  }
  
  .vs-popup-close {
    @include text-tertiary;
    font-size: map-get($font-size, 'xl');
    padding: map-get($spacing, 'sm');
  }
}

.vs-list {
  max-height: calc(70vh - 60px);
  padding-top: map-get($spacing, 'sm');
}

.vs-item {
  @include flex-between;
  padding: map-get($spacing, 'base') 0;
  border-bottom: 1px solid map-get($theme-colors, 'border');
  
  &:last-child {
    border-bottom: none;
  }
  
  &.vs-item-active {
    background: rgba(map-get($theme-colors, 'primary'), 0.05);
  }
  
  .vs-item-left {
    @include flex-align-center;
    gap: map-get($spacing, 'sm');
    
    .vs-check-icon {
      color: map-get($theme-colors, 'primary');
      font-weight: bold;
      width: 16px;
    }
    
    .vs-item-name {
      @include text-primary;
      font-weight: 500;
    }
  }
  
  .vs-item-vin {
    @include text-tertiary;
    font-size: map-get($font-size, 'sm');
  }
}
</style>
