<template>
  <view class="container">
    <view class="header">
      <text class="title">车辆管理</text>
    </view>
    
    <view class="search">
      <input placeholder="搜索车辆" v-model="searchText" @input="searchVehicles" />
      <button size="mini" @click="addVehicle">添加车辆</button>
    </view>
    
    <view class="vehicle-list">
      <view class="vehicle-item" v-for="(vehicle, index) in vehicles" :key="index" @click="viewVehicle(vehicle)">
        <image :src="vehicle.image || '/static/icons/car-default.png'" class="vehicle-image"></image>
        <view class="vehicle-info">
          <text class="name">{{vehicle.name}}</text>
          <text class="plate">{{vehicle.plate}}</text>
          <text class="status" :class="{'online': vehicle.online}">
            {{vehicle.online ? '在线' : '离线'}}
          </text>
        </view>
        <view class="vehicle-actions">
          <button size="mini" @click.stop="editVehicle(vehicle)">编辑</button>
        </view>
      </view>
    </view>
    
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog mode="input" title="添加车辆" :value="currentVehicle.name" 
        placeholder="请输入车辆名称" @confirm="confirmAdd"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      currentVehicle: {
        id: '',
        name: '',
        plate: '',
        image: ''
      },
      vehicles: [
        {
          id: '001',
          name: '公司商务车',
          plate: '京A12345',
          online: true,
          image: '/static/icons/car1.png'
        },
        {
          id: '002',
          name: '物流运输车',
          plate: '京B56789',
          online: false,
          image: '/static/icons/car2.png'
        },
        {
          id: '003',
          name: '员工通勤车',
          plate: '京C34567',
          online: true
        }
      ]
    }
  },
  methods: {
    searchVehicles() {
      // 实际项目中这里应该是API调用
      console.log('搜索:', this.searchText)
    },
    addVehicle() {
      this.currentVehicle = {
        id: '',
        name: '',
        plate: '',
        image: ''
      }
      this.$refs.popup.open()
    },
    editVehicle(vehicle) {
      this.currentVehicle = {...vehicle}
      this.$refs.popup.open()
    },
    confirmAdd(value) {
      if (!value) return
      
      if (this.currentVehicle.id) {
        // 更新现有车辆
        const index = this.vehicles.findIndex(v => v.id === this.currentVehicle.id)
        if (index !== -1) {
          this.vehicles[index].name = value
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
        }
      } else {
        // 添加新车辆
        this.vehicles.unshift({
          id: '00' + (this.vehicles.length + 1),
          name: value,
          plate: '新牌照',
          online: false
        })
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
      }
      this.$refs.popup.close()
    },
    viewVehicle(vehicle) {
      uni.navigateTo({
        url: `/pages/management/detail?id=${vehicle.id}`
      })
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


.search {
  @include flex-between;
  margin-bottom: map-get($spacing, 'base');

  input {
    @include input-style;
    flex: 1;
    margin-right: map-get($spacing, 'sm');
  }
}

.vehicle-list {
  .vehicle-item {
    @include card-style;
    @include flex-align-center;
    padding: map-get($spacing, 'sm');

    &-image {
      @include square(50px);
      margin-right: map-get($spacing, 'base');
    }

    .vehicle-info {
      flex: 1;

      .name {
        color: map-get($theme-colors, 'text-primary');
        font-weight: bold;
      }

      .plate {
        @include text-secondary;
      }

      .status {
        @include text-tertiary;
        
        &.online {
          color: map-get($theme-colors, 'primary');
        }
      }
    }

    &-actions {
      margin-left: map-get($spacing, 'sm');
    }
  }
}
</style>
