<template>
  <view class="container">
    <view class="header">
      <text class="title">历史故障记录</text>
    </view>
    
    <view class="filter">
      <picker mode="date" @change="dateChange">
        <view class="picker">选择日期: {{selectedDate}}</view>
      </picker>
      <picker @change="vehicleChange" :range="vehicles" range-key="name">
        <view class="picker">选择车辆: {{selectedVehicle.name}}</view>
      </picker>
    </view>
    
    <view class="fault-list">
      <view class="fault-item" v-for="(item, index) in faultList" :key="index">
        <view class="fault-header">
          <text class="code">{{item.code}}</text>
          <text class="level" :class="'level-'+item.level">{{item.levelText}}</text>
        </view>
        <text class="description">{{item.description}}</text>
        <view class="fault-footer">
          <text class="time">{{item.time}}</text>
          <text class="mileage">{{item.mileage}} km</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: '全部',
      selectedVehicle: {id: 'all', name: '全部车辆'},
      vehicles: [
        {id: 'all', name: '全部车辆'},
        {id: '001', name: '京A12345'},
        {id: '002', name: '京B56789'}
      ],
      faultList: [
        {
          code: 'P0172',
          level: 1,
          levelText: '严重',
          description: '燃油系统过浓 - 系统过浓 (第1排)',
          time: '2023-05-15 14:23',
          mileage: 12345
        },
        {
          code: 'P0420',
          level: 2,
          levelText: '中等',
          description: '催化转换器系统效率低于阈值 (第1排)',
          time: '2023-05-10 09:12',
          mileage: 12200
        },
        {
          code: 'B0021',
          level: 3,
          levelText: '轻微',
          description: '左侧安全气囊展开控制 - 电阻过高',
          time: '2023-04-28 16:45',
          mileage: 11800
        }
      ]
    }
  },
  methods: {
    dateChange(e) {
      this.selectedDate = e.detail.value || '全部'
    },
    vehicleChange(e) {
      this.selectedVehicle = this.vehicles[e.detail.value]
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


.fault-list {
  margin-top: map-get($spacing, 'base');

  .fault-item {
    @include card-style;
    padding: map-get($spacing, 'base');

    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: map-get($spacing, 'sm');

      .code {
        color: map-get($theme-colors, 'text-primary');
        font-weight: bold;
      }

      .level {
        @each $name, $color in ('1': 'error', '2': 'warning', '3': 'primary') {
          &-#{$name} {
            @include tag-style(map-get($theme-colors, $color));
          }
        }
      }
    }

    .description {
      color: map-get($theme-colors, 'text-secondary');
      margin-bottom: map-get($spacing, 'sm');
      font-size: 14px;
    }

    &-footer {
      @include flex-between;
      color: map-get($theme-colors, 'text-tertiary');
      font-size: 12px;
    }
  }
}

.filter {
  @include flex-between;
  margin-bottom: map-get($spacing, 'base');

  .picker {
    flex: 1;
    background: map-get($theme-colors, 'content-bg');
    padding: map-get($spacing, 'sm');
    border-radius: map-get($border-radius, 'sm');
    text-align: center;
    margin-right: map-get($spacing, 'sm');
    color: map-get($theme-colors, 'text-primary');
  }
}
</style>
