<template>
  <view class="container">
    <view class="header">
      <text class="title">车辆状态监控</text>
    </view>
    <!-- <InfoCard /> -->
    <vehicle-selector 
      @change="handleVehicleSwitch"
    />
    <!-- 整车状态 -->
    <status-card 
      title="整车状态" 
      :data="vehicleStatus" 
      refresh-rate="1000"
    />
    
    <!-- 作业系统 -->
    <status-card
      title="作业系统"
      :data="operationSystem"
      refresh-rate="1000"
    />
    
    <!-- 动力电池 -->
    <status-card
      title="动力电池"
      :data="batterySystem"
      refresh-rate="1000"
    />
    
    <!-- 热管理系统 -->
    <status-card
      title="热管理系统"
      :data="thermalSystem"
      refresh-rate="1000"
    />
    
    <view class="card">
      <view class="card-header">
        <text>位置信息</text>
      </view>
      <map :latitude="location.latitude" :longitude="location.longitude" class="map"></map>
    </view>
    <PageBg />
  </view>
</template>

<script>
import InfoCard from '@/components/InfoCard.vue'
import StatusCard from '@/components/StatusCard.vue'
import mockService from '@/utils/mockService'
export default {
  components: {
    InfoCard,
    StatusCard
  },
  data() {
    return {
      currentTime: '',
      status: {
        speed: 60,
        rpm: 2200,
        temperature: 85,
        fuel: 45
      },
      vehicleStatus: {},
      operationSystem: {},
      batterySystem: {},
      thermalSystem: {},
      updateInterval: null,
      location: {
        latitude: 39.909,
        longitude: 116.397
      }
    }
  },
  filters: {
    fixedTwo(num) {
      return num && typeof num === 'number' ? num.toFixed(2) : num 
    }
  },
  mounted() {
    this.initData()
    this.startMockUpdate()
  },
  methods: {
    initData() {
      const initialData = mockService.getMockData()
      console.log(initialData)
      this.vehicleStatus = this.formatData(initialData.vehicle, 'vehicle')
      this.operationSystem = this.formatData(initialData.operation, 'operation')
      this.batterySystem = this.formatData(initialData.battery, 'battery')
      this.thermalSystem = this.formatData(initialData.thermal, 'thermal')
    },
    formatData(rawData, systemType) {
    // 系统字段映射表
    const fieldMaps = {
      vehicle: {
        batteryVoltage: '蓄电池电压',
        lockStatus: '解锁状态',
        readyStatus: 'READY状态',
        parkingBrake: '手刹状态',
        gear: '档位状态',
        brake: '制动状态',
        speed: '车速',
        mileage: '总里程',
        ops: 'OPS状态',
        coolantTemp: '冷却水温',
        fan: '散热风扇状态',
        powerMode: '动力模式',
        fault: '故障状态'
      },
      operation: {
        lift: '举升状态',
        tilt: '倾斜状态',
        shift: '侧移状态',
        flip: '翻转状态',
        pumpRpm: '油泵电机转速',
        pumpTorque: '油泵电机扭矩',
        pumpCurrent: '油泵电机电流',
        pumpVoltage: '油泵电机电压',
        hydraulicPressure: '液压系统压力'
      },
      battery: {
        voltage: '电压',
        current: '电流',
        soc: 'SOC'
      },
      thermal: {
        compressor: '压缩机状态',
        expansionValve: '电子膨胀阀状态',
        coolingPump: '冷却水泵状态',
        circulationPump: '循环泵状态',
        ptc: 'PTC状态'
      }
    }

    const formattedData = {}
    
    Object.keys(rawData).forEach(key => {
      // 跳过系统内部字段
      if (key.startsWith('_')) return
      
      // 获取中文显示名称
      const displayName = fieldMaps[systemType]?.[key] || key
      
      // 处理数值精度
      let displayValue = rawData[key].value
      if (typeof displayValue === 'number') {
        displayValue = this.$options.filters.fixedTwo(displayValue)
      }

      formattedData[displayName] = {
        ...rawData[key],
        value: displayValue,
        // 增强异常状态显示
        status: rawData[key].status || 'normal',
        class: rawData[key].status === 'error' ? 'error-text' : ''
      }
    })

    return formattedData
  },
    startMockUpdate() {
      // 初始化首次数据
      const initialData = mockService.getMockData()
      this.vehicleStatus = this.formatData(initialData.vehicle, 'vehicle')
      this.operationSystem = this.formatData(initialData.operation, 'operation')
      this.batterySystem = this.formatData(initialData.battery, 'battery')
      this.thermalSystem = this.formatData(initialData.thermal, 'thermal')

      // 启动定时更新
      this.updateInterval = setInterval(() => {
        const newData = mockService.getMockData({
          vehicle: this.vehicleStatus,
          operation: this.operationSystem,
          battery: this.batterySystem,
          thermal: this.thermalSystem
        })

        // 带过渡效果的数据更新
        this.$set(this, 'vehicleStatus', this.formatData(newData.vehicle, 'vehicle'))
        this.$set(this, 'operationSystem', this.formatData(newData.operation, 'operation'))
        this.$set(this, 'batterySystem', this.formatData(newData.battery, 'battery'))
        this.$set(this, 'thermalSystem', this.formatData(newData.thermal, 'thermal'))

        // 触发数据更新动画
        this.$forceUpdate()
      }, 5000)
    },
    handleVehicleSwitch() {
      uni.alert('切换车辆')
    }
  },
   beforeDestroy() {
    clearInterval(this.updateInterval)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

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

.card {
  @include card-style;
  
  &-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: map-get($spacing, small);
    font-weight: bold;
    
    .time {
      color: map-get($theme-colors, text-tertiary);
      font-size: 12px;
    }
  }
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: map-get($spacing, base);
  
  &-item {
    background: rgba(40, 40, 40, 0.5);
    padding: map-get($spacing, small);
    border-radius: map-get($border-radius, small);
    
    .label {
      @include text-ellipsis;
      font-size: 12px;
      color: map-get($theme-colors, text-secondary);
    }
    
    .value {
      font-size: 18px;
      font-weight: bold;
    }
  }
}

.map-container {
  filter: brightness(0.8) contrast(1.2);
  height: 200px;
  border-radius: map-get($border-radius, small);
  overflow: hidden;
}
</style>
