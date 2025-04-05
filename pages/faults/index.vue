<template>
  <view class="container">
    <!-- 顶部车辆选择器 -->
    <vehicle-selector @change="handleVehicleChange" />
    
    <!-- 筛选区域 -->
    <view class="filter-section">
      <picker mode="date" fields="month" @change="dateChange">
        <view class="filter-item">
          <text class="label">选择月份:</text>
          <text class="value">{{ selectedDate || '全部' }}</text>
          <text class="icon">▼</text>
        </view>
      </picker>
      
      <picker @change="levelChange" :range="faultLevels" range-key="text">
        <view class="filter-item">
          <text class="label">故障等级:</text>
          <text class="value">{{ selectedLevel.text || '全部' }}</text>
          <text class="icon">▼</text>
        </view>
      </picker>
    </view>
    
    <!-- 故障列表 -->
    <view class="fault-list">
      <view 
        class="fault-item" 
        v-for="(item, index) in filteredFaults" 
        :key="index"
        @click="showDetail(item)"
        :class="'level-' + item.level"
      >
        <!-- 故障等级标签 - 修改后 -->
        <view class="level-tag">
          <view class="level-icon">
            <!-- 不同等级使用不同图标 -->
            <text v-if="item.level === 1" class="iconfont icon-warning"></text>
            <text v-if="item.level === 2" class="iconfont icon-alert"></text>
            <text v-if="item.level === 3" class="iconfont icon-info"></text>
          </view>
          <text class="level-text">{{ item.levelText }}</text>
        </view>
        <view class="time-info">
          <text class="label">时间:</text>
          <text class="time">{{ item.time }}</text>
        </view>
        <view class="code-info">
          <text class="label">故障码:</text>
          <text class="code">{{ item.code }}</text>
        </view>
        <view class="desc-info">
          <text class="label">描述:</text>
          <text class="description">{{ item.description }}</text>
        </view>
        <view class="mileage-info">
          <text class="label">里程:</text>
          <text class="mileage">{{ item.mileage }} km</text>
        </view>
        <view class="status-info">
          <text class="label">状态:</text>
          <text class="status">{{ item.statusText }}</text>
        </view>
      </view>
    </view>
    
    <!-- 故障详情弹窗 -->
    <view class="detail-popup" :class="{ 'show': showDetailPopup }">
      <view class="popup-mask" @click="closeDetail"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">故障详情</text>
          <text class="close-btn" @click="closeDetail">×</text>
        </view>
        
        <scroll-view scroll-y class="detail-scroll">
          <view class="detail-section">
            <text class="section-title">基本信息</text>
            <view class="detail-row">
              <text class="label">时间:</text>
              <text class="value">{{ currentDetail.time }}</text>
            </view>
            <view class="detail-row">
              <text class="label">故障原因:</text>
              <text class="value">{{ currentDetail.description }}</text>
            </view>
            <view class="detail-row">
              <text class="label">总里程:</text>
              <text class="value">{{ currentDetail.mileage }} km</text>
            </view>
            <view class="detail-row">
              <text class="label">故障等级:</text>
              <text class="value" :class="'level-' + currentDetail.level">{{ currentDetail.levelText }}</text>
            </view>
          </view>
          
          <view class="detail-section" v-if="currentDetail.driveData">
            <text class="section-title">行驶数据</text>
            <view class="detail-row">
              <text class="label">绝缘阻值:</text>
              <text class="value">{{ currentDetail.driveData.insulationResistance }} Ω</text>
            </view>
            <view class="detail-row">
              <text class="label">油门开度:</text>
              <text class="value">{{ currentDetail.driveData.throttleOpening }} %</text>
            </view>
            <view class="detail-row">
              <text class="label">刹车开度:</text>
              <text class="value">{{ currentDetail.driveData.brakeOpening }} %</text>
            </view>
            <view class="detail-row">
              <text class="label">时速:</text>
              <text class="value">{{ currentDetail.driveData.speed }} km/h</text>
            </view>
            <view class="detail-row">
              <text class="label">油门转矩:</text>
              <text class="value">{{ currentDetail.driveData.throttleTorque }} Nm</text>
            </view>
          </view>
          
          <view class="detail-section" v-if="currentDetail.motorData">
            <text class="section-title">电机数据</text>
            <view class="detail-row">
              <text class="label">TM1母线电压:</text>
              <text class="value">{{ currentDetail.motorData.tm1BusVoltage }} V</text>
            </view>
            <view class="detail-row">
              <text class="label">TM1交流电流:</text>
              <text class="value">{{ currentDetail.motorData.tm1AcCurrent }} A</text>
            </view>
            <view class="detail-row">
              <text class="label">TM1转矩:</text>
              <text class="value">{{ currentDetail.motorData.tm1Torque }} Nm</text>
            </view>
            <view class="detail-row">
              <text class="label">TM1转速:</text>
              <text class="value">{{ currentDetail.motorData.tm1Rpm }} RPM</text>
            </view>
            <view class="detail-row">
              <text class="label">TM1电机温度:</text>
              <text class="value">{{ currentDetail.motorData.tm1MotorTemp }} °C</text>
            </view>
          </view>
          
          <view class="detail-section" v-if="currentDetail.batteryData">
            <text class="section-title">电池数据</text>
            <view class="detail-row">
              <text class="label">电池电压:</text>
              <text class="value">{{ currentDetail.batteryData.voltage }} V</text>
            </view>
            <view class="detail-row">
              <text class="label">电池电流:</text>
              <text class="value">{{ currentDetail.batteryData.current }} A</text>
            </view>
            <view class="detail-row">
              <text class="label">电池温度:</text>
              <text class="value">{{ currentDetail.batteryData.temperature }} °C</text>
            </view>
          </view>
        </scroll-view>
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
      currentVehicle: {
        vin: 'LSVNV133X111111111',
        name: '电动叉车-01',
        vcuVersion: 'v2.1.3',
        pumpVersion: 'v1.5.2',
        driveVersion: 'v3.0.1'
      },
      selectedDate: '',
      selectedLevel: { value: 'all', text: '全部' },
      faultLevels: [
        { value: 'all', text: '全部' },
        { value: 1, text: '严重' },
        { value: 2, text: '中等' },
        { value: 3, text: '轻微' }
      ],
      showDetailPopup: false,
      currentDetail: {},
      faultList: [
        {
          code: 'P0172',
          level: 1,
          levelText: '严重',
          description: '电机过热保护',
          time: '2023-10-01 12:30',
          mileage: 1200,
          status: 1,
          statusText: '已处理',
          driveData: {
            insulationResistance: 500,
            throttleOpening: 50,
            brakeOpening: 30,
            speed: 20,
            throttleTorque: 100
          },
          motorData: {
            tm1BusVoltage: 600,
            tm1AcCurrent: 10,
            tm1Torque: 150,
            tm1Rpm: 2000,
            tm1MotorTemp: 50
          },
          batteryData: {
            voltage: 400,
            current: 20,
            temperature: 30
          }
        },
        {
          code: 'P0420',
          level: 2,
          levelText: '中等',
          description: '电池温度过高',
          time: '2023-09-28 14:15',
          mileage: 1150,
          status: 0,
          statusText: '未处理',
          batteryData: {
            voltage: 380,
            current: 25,
            temperature: 45
          }
        },
        {
          code: 'B0021',
          level: 3,
          levelText: '轻微',
          description: '通讯信号不稳定',
          time: '2023-09-25 09:45',
          mileage: 1100,
          status: 1,
          statusText: '已处理'
        }
      ]
    }
  },
  computed: {
    filteredFaults() {
      return this.faultList.filter(item => {
        // 按车辆筛选
        if (this.currentVehicle.vin !== 'LSVNV133X111111111') return false
        
        // 按日期筛选
        if (this.selectedDate && !item.time.includes(this.selectedDate)) return false
        
        // 按等级筛选
        if (this.selectedLevel.value !== 'all' && item.level !== this.selectedLevel.value) return false
        
        return true
      })
    }
  },
  methods: {
    handleVehicleChange(vehicle) {
      this.currentVehicle = vehicle
      // 这里可以添加加载对应车辆故障记录的API调用
    },
    dateChange(e) {
      this.selectedDate = e.detail.value
    },
    levelChange(e) {
      this.selectedLevel = this.faultLevels[e.detail.value]
    },
    showDetail(item) {
      this.currentDetail = item
      this.showDetailPopup = true
    },
    closeDetail() {
      this.showDetailPopup = false
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

.filter-section {
  @include flex-between;
  margin: map-get($spacing, base) 0;
  
  .filter-item {
    @include card-style;
    flex: 1;
    padding: map-get($spacing, sm);
    margin-right: map-get($spacing, sm);
    display: flex;
    align-items: center;
    
    &:last-child {
      margin-right: 0;
    }
    
    .label {
      @include text-secondary;
      margin-right: map-get($spacing, sm);
    }
    
    .value {
      @include text-primary;
      flex: 1;
    }
    
    .icon {
      @include text-tertiary;
      margin-left: map-get($spacing, sm);
    }
  }
}

.fault-list {
  .fault-item {
    @include card-style;
    padding: map-get($spacing, base);
    margin-bottom: map-get($spacing, base);
    
    &-header {
      @include flex-between;
      margin-bottom: map-get($spacing, sm);
      
      .time-info {
        display: flex;
        align-items: center;
        
        .label {
          @include text-secondary;
          font-size: map-get($font-size, sm);
          margin-right: map-get($spacing, sm);
        }
        
        .time {
          @include text-primary;
          font-size: map-get($font-size, sm);
        }
      }
      
      .level {
        @each $name, $color in ('1': 'error', '2': 'warning', '3': 'primary') {
          &-#{$name} {
            @include tag-style(map-get($theme-colors, $color));
          }
        }
      }
    }
    
    &-content {
      margin-bottom: map-get($spacing, sm);
      
      .code-info, .desc-info {
        display: flex;
        margin-bottom: map-get($spacing, xs);
        
        .label {
          @include text-secondary;
          font-size: map-get($font-size, sm);
          margin-right: map-get($spacing, sm);
          flex-shrink: 0;
        }
        
        .code {
          @include text-primary;
          font-weight: bold;
        }
        
        .description {
          @include text-secondary;
          flex: 1;
        }
      }
    }
    
    &-footer {
      @include flex-between;
      
      .mileage-info, .status-info {
        display: flex;
        align-items: center;
        
        .label {
          @include text-tertiary;
          font-size: map-get($font-size, xs);
          margin-right: map-get($spacing, sm);
        }
        
        .mileage, .status {
          @include text-tertiary;
          font-size: map-get($font-size, sm);
        }
      }
    }
  }
  
}
// 故障等级颜色定义
$level-colors: (
  1: ( // 严重
    bg: rgba(map-get($theme-colors, 'error'), 0.1),
    text: map-get($theme-colors, 'error'),
    border: rgba(map-get($theme-colors, 'error'), 0.5)
  ),
  2: ( // 中等
    bg: rgba(map-get($theme-colors, 'warning'), 0.1),
    text: map-get($theme-colors, 'warning'),
    border: rgba(map-get($theme-colors, 'warning'), 0.5)
  ),
  3: ( // 轻微
    bg: rgba(map-get($theme-colors, 'primary'), 0.1),
    text: map-get($theme-colors, 'primary'),
    border: rgba(map-get($theme-colors, 'primary'), 0.5)
  )
);

// 故障项整体样式
.fault-item {
  @each $level, $colors in $level-colors {
    &.level-#{$level} {
      border-left-color: map-get($colors, text);
      // background-color: map-get($colors, bg);
      
      .level-tag {
        background-color: map-get($colors, bg);
        border: 1px solid map-get($colors, border);
        color: map-get($colors, text);
        
        .level-icon {
          color: map-get($colors, text);
        }
      }
    }
  }
}

// 等级标签样式
.level-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: map-get($font-size, 'sm');
  font-weight: bold;
  
  .level-icon {
    margin-right: 4px;
    font-size: map-get($font-size, 'base');
  }
}

// 图标样式（需要引入图标字体）
// .iconfont {
//   font-family: "iconfont" !important;
//   font-style: normal;
  
//   &.icon-warning:before {
//     content: "⚠️"; /* 使用emoji或实际图标 */
//   }
//   &.icon-alert:before {
//     content: "❗";
//   }
//   &.icon-info:before {
//     content: "ℹ️";
//   }
// }
/* 详情弹窗样式 */
.detail-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &.show {
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
  max-height: 80vh;
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

.detail-scroll {
  max-height: calc(80vh - 60px);
}

.detail-section {
  margin-bottom: map-get($spacing, 'lg');
  
  .section-title {
    @include text-primary;
    font-weight: bold;
    display: block;
    margin-bottom: map-get($spacing, 'base');
    padding-bottom: map-get($spacing, 'sm');
    border-bottom: 1px solid map-get($theme-colors, 'border');
  }
}

.detail-row {
  @include flex-between;
  margin-bottom: map-get($spacing, 'sm');
  
  .label {
    @include text-secondary;
    flex: 1;
  }
  
  .value {
    @include text-primary;
    flex: 2;
    text-align: right;
    
    &.level-1 {
      color: map-get($theme-colors, 'error');
    }
    &.level-2 {
      color: map-get($theme-colors, 'warning');
    }
    &.level-3 {
      color: map-get($theme-colors, 'primary');
    }
  }
}
</style>