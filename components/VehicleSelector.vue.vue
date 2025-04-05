<template>
  <view class="vehicle-selector">
    <!-- 当前车辆卡片 -->
    <view class="vehicle-card" @click="togglePopup">
      <view class="vehicle-info">
        <text class="vin">VIN: {{ currentVehicle.vin }}</text>
        <text class="name">{{ currentVehicle.name }}</text>
        <view class="versions">
          <text v-for="(ver, key) in versionFields" :key="key">
            {{ ver.label }}: {{ currentVehicle[ver.field] }}
          </text>
        </view>
      </view>
      <text class="arrow">▼</text>
    </view>

    <!-- 自定义弹窗 -->
    <view 
      class="vehicle-popup" 
      :class="{ 'popup-show': showPopup }"
      @touchmove.stop.prevent
    >
      <view class="popup-mask" @click="closePopup"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">选择车辆</text>
          <text class="close-btn" @click="closePopup">×</text>
        </view>
        
        <scroll-view scroll-y class="vehicle-list">
          <view 
            v-for="item in filteredVehicles" 
            :key="item.vin"
            class="vehicle-item"
            :class="{ 'active': item.vin === currentVehicle.vin }"
            @click="selectVehicle(item)"
          >
            <view class="item-left">
              <text 
                class="check-icon"
                v-if="item.vin === currentVehicle.vin"
              >✓</text>
              <text class="item-name">{{ item.name }}</text>
            </view>
            <text class="item-vin">{{ item.vin }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // vehicles: {
    //   type: Array,
    //   default: () => [],
    //   validator: value => {
    //     return value.every(item => 
    //       item.vin && item.name && 
    //       item.vcuVersion && item.pumpVersion && item.driveVersion
    //     )
    //   }
    // }
  },
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
        },
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
    // currentVehicle() {
    //   return this.vehicles[0] || this.emptyVehicle()
    // },
    filteredVehicles() {
      const query = this.searchQuery.toLowerCase()
      return this.vehicles.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.vin.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    emptyVehicle() {
      return {
        vin: '无车辆数据',
        name: '暂无车辆',
        vcuVersion: '--',
        pumpVersion: '--',
        driveVersion: '--'
      }
    },
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

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.vehicle-selector {
  position: relative;
  z-index: 10;
}

.vehicle-card {
  @include flex-between;
  @include card-style;
  padding: map-get($spacing, 'base');
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .vehicle-info {
    flex: 1;
    
    .vin {
      @include text-tertiary;
      @include text-ellipsis;
      font-size: map-get($font-size, 'sm');
      margin-bottom: 4px;
    }
    
    .name {
      @include text-primary;
      @include text-ellipsis;
      font-size: map-get($font-size, 'lg');
      font-weight: bold;
      margin-bottom: map-get($spacing, 'sm');
    }
    
    .versions {
      @include flex-align-center;
      gap: map-get($spacing, 'sm');
      
      text {
        @include text-secondary;
        font-size: map-get($font-size, 'sm');
        background: rgba(map-get($theme-colors, 'border'), 0.3);
        padding: 2px map-get($spacing, 'sm');
        border-radius: map-get($border-radius, 'sm');
      }
    }
  }
  
  .arrow {
    color: map-get($theme-colors, 'text-tertiary');
    margin-left: map-get($spacing, 'base');
  }
}

/* 弹窗样式 */
.vehicle-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &.popup-show {
    visibility: visible;
    opacity: 1;
    
    .popup-content {
      transform: translateY(0);
    }
  }
}

.popup-mask {
  @include square(100%);
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
}

.popup-content {
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

.popup-header {
  @include flex-between;
  padding-bottom: map-get($spacing, 'base');
  border-bottom: 1px solid map-get($theme-colors, 'border');
  
  .title {
    @include text-primary;
    font-size: map-get($font-size, 'xl');
    font-weight: bold;
  }
  
  .close-btn {
    @include text-tertiary;
    font-size: map-get($font-size, 'xl');
    padding: map-get($spacing, 'sm');
  }
}

.vehicle-list {
  max-height: calc(70vh - 60px);
  padding-top: map-get($spacing, 'sm');
}

.vehicle-item {
  @include flex-between;
  padding: map-get($spacing, 'base') 0;
  border-bottom: 1px solid map-get($theme-colors, 'border');
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    background: rgba(map-get($theme-colors, 'primary'), 0.05);
  }
  
  .item-left {
    @include flex-align-center;
    gap: map-get($spacing, 'sm');
    
    .check-icon {
      color: map-get($theme-colors, 'primary');
      font-weight: bold;
      width: 16px;
    }
    
    .item-name {
      @include text-primary;
      font-weight: 500;
    }
  }
  
  .item-vin {
    @include text-tertiary;
    font-size: map-get($font-size, 'sm');
  }
}
</style>