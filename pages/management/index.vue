<template>
  <view class="container">
    <!-- 顶部车辆选择器 -->
    <vehicle-selector 
      @change="handleVehicleSwitch"
    />

    <!-- 车辆列表卡片容器 -->
    <view class="vehicle-cards-container">
      <!-- 空状态提示 -->
      <view v-if="filteredVehicles.length === 0" class="empty-state">
        <image src="/static/icons/empty-vehicle.png" class="empty-icon"></image>
        <text class="empty-text">暂无车辆数据</text>
        <button type="primary" @click="showAddDialog" class="add-button">添加车辆</button>
      </view>
      
      <!-- 独立卡片布局 -->
      <view 
        class="vehicle-card" 
        v-for="vehicle in vehicles" 
        :key="vehicle.id"
        @click="viewVehicleDetail(vehicle)"
      >
        <view class="card-header">
          <text class="vehicle-name">{{vehicle.name}}</text>
          <view class="vehicle-status" :class="{'online': vehicle.online}">
            {{vehicle.online ? '在线' : '离线'}}
          </view>
        </view>
        
        <view class="card-content">
          <image :src="vehicle.image || '/static/icons/car-default.png'" class="vehicle-image"></image>
          
          <view class="vehicle-info">
            <view class="info-row">
              <text class="label">车辆编号:</text>
              <text class="value">{{vehicle.id}}</text>
            </view>
            <view class="info-row">
              <text class="label">VIN码:</text>
              <text class="value">{{vehicle.vin}}</text>
            </view>
            <view class="info-row">
              <text class="label">权限:</text>
              <text class="value" :class="{
                'admin': vehicle.permission === 1,
                'operator': vehicle.permission === 2,
                'readonly': vehicle.permission === 3
              }">
                {{getPermissionText(vehicle.permission)}}
              </text>
            </view>
          </view>
        </view>
        <view class="card-footer">
          <button size="mini" @click.stop="editVehicle(vehicle)" class="edit-btn">编辑</button>
          <button size="mini" @click.stop="showMoreActions(vehicle)" class="more-btn">更多</button>
        </view>
      </view>
      
      <!-- 添加车辆浮动按钮 -->
      <view class="add-float-btn" @click="showAddDialog">
        <text class="icon">+</text>
      </view>
    </view>
    
    <!-- 添加/编辑车辆弹窗 -->
    <uni-popup ref="vehicleDialog" type="dialog">
      <uni-popup-dialog 
        :title="isEditing ? '编辑车辆' : '添加车辆'" 
        mode="input"
        :value="currentVehicle.name"
        placeholder="请输入车辆名称"
        @confirm="confirmVehicle"
      >
        <view class="form-fields">
          <view class="form-item">
            <text class="label">VIN码:</text>
            <input 
              v-model="currentVehicle.vin" 
              placeholder="请输入17位VIN码" 
              maxlength="17"
            />
          </view>
          <view class="form-item">
            <text class="label">车辆编号:</text>
            <input 
              v-model="currentVehicle.id" 
              placeholder="请输入车辆编号" 
            />
          </view>
          <view class="form-item">
            <text class="label">权限级别:</text>
            <picker 
              @change="onPermissionChange" 
              :value="permissionIndex" 
              :range="permissionOptions"
              range-key="text"
            >
              <view class="picker">
                {{permissionOptions[permissionIndex].text}}
              </view>
            </picker>
          </view>
        </view>
      </uni-popup-dialog>
    </uni-popup>
    
    <PageBg />
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      isEditing: false,
      currentVehicle: {
        id: '',
        name: '',
        vin: '',
        permission: 1,
        image: ''
      },
      permissionIndex: 0,
      permissionOptions: [
        { value: 1, text: '管理员权限' },
        { value: 2, text: '操作员权限' },
        { value: 3, text: '只读权限' }
      ],
      vehicles: [
        {
          id: 'VH001',
          name: '电动叉车-01',
          vin: 'LSVNV133X111111111',
          permission: 1,
          image: '/static/icons/car-default.png'
        },
        {
          id: 'VH002',
          name: '物流运输车',
          vin: 'LSVNV133X222222222',
          permission: 2,
          image: '/static/icons/car-default.png'
        },
        {
          id: 'VH003',
          name: '工程作业车',
          vin: 'LSVNV133X333333333',
          permission: 3,
          image: '/static/icons/car-default.png'
        }
      ]
    }
  },
  computed: {
    filteredVehicles() {
      const query = this.searchText.toLowerCase()
      if(!query) return this.vehicles
      return this.vehicles.filter(vehicle => 
        vehicle.name.toLowerCase().includes(query) || 
        vehicle.vin.toLowerCase().includes(query) ||
        vehicle.id.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    handleVehicleSwitch(vehicle) {
      // 可以在这里处理车辆切换逻辑
      console.log('切换车辆:', vehicle)
    },
    handleSearch() {
      // 搜索功能已在computed中实现
    },
    showAddDialog() {
      this.isEditing = false
      this.currentVehicle = {
        id: '',
        name: '',
        vin: '',
        permission: 1,
        image: ''
      }
      this.permissionIndex = 0
      this.$refs.vehicleDialog.open()
    },
    editVehicle(vehicle) {
      this.isEditing = true
      this.currentVehicle = {...vehicle}
      this.permissionIndex = this.permissionOptions.findIndex(
        item => item.value === vehicle.permission
      )
      this.$refs.vehicleDialog.open()
    },
    onPermissionChange(e) {
      this.permissionIndex = e.detail.value
      this.currentVehicle.permission = this.permissionOptions[this.permissionIndex].value
    },
    confirmVehicle(name) {
      if (!name || !this.currentVehicle.vin) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      this.currentVehicle.name = name
      
      if (this.isEditing) {
        // 更新车辆
        const index = this.vehicles.findIndex(v => v.id === this.currentVehicle.id)
        if (index !== -1) {
          this.vehicles.splice(index, 1, {...this.currentVehicle})
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
        }
      } else {
        // 添加车辆
        this.vehicles.unshift({
          ...this.currentVehicle,
          id: this.currentVehicle.id || 'VH' + (100 + this.vehicles.length + 1)
        })
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
      }
      
      this.$refs.vehicleDialog.close()
    },
    viewVehicleDetail(vehicle) {
      uni.navigateTo({
        url: `/pages/management/detail?id=${vehicle.id}`
      })
    },
    showMoreActions(vehicle) {
      uni.showActionSheet({
        itemList: ['查看详情', '删除车辆', '取消'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0: // 查看详情
              this.viewVehicleDetail(vehicle);
              break;
            case 1: // 删除车辆
              this.deleteVehicle(vehicle);
              break;
          }
        }
      });
    },
    
    deleteVehicle(vehicle) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除车辆 ${vehicle.name} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 实际项目中这里应该是调用API删除
            this.setData({
              vehicles: this.vehicles.filter(v => v.id !== vehicle.id)
            });
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    },
    getPermissionText(permission) {
      const option = this.permissionOptions.find(item => item.value === permission)
      return option ? option.text : '未知权限'
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

.vehicle-cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: map-get($spacing, base);
  margin-top: map-get($spacing, base);
}

.empty-state {
  @include flex-center;
  flex-direction: column;
  padding: map-get($spacing, xl) 0;
  
  .empty-icon {
    width: 120px;
    height: 120px;
    margin-bottom: map-get($spacing, base);
    opacity: 0.6;
  }
  
  .empty-text {
    @include text-secondary;
    margin-bottom: map-get($spacing, base);
  }
  
  .add-button {
    width: 60%;
  }
}

.vehicle-card {
  @include card-style;
  padding: map-get($spacing, base);
  
  .card-header {
    @include flex-between;
    margin-bottom: map-get($spacing, base);
    padding-bottom: map-get($spacing, sm);
    border-bottom: 1px solid map-get($theme-colors, border);
    
    .vehicle-name {
      @include text-primary;
      font-weight: bold;
      font-size: map-get($font-size, lg);
    }
    
    .vehicle-status {
      @include tag-style(map-get($theme-colors, text-tertiary));
      
      &.online {
        @include tag-style(map-get($theme-colors, success));
      }
    }
  }
  
  .card-content {
    @include flex-align-center;
    
    .vehicle-image {
      @include square(80px);
      margin-right: map-get($spacing, base);
      border-radius: map-get($border-radius, sm);
    }
    
    .vehicle-info {
      flex: 1;
      
      .info-row {
        @include flex-align-center;
        margin-bottom: map-get($spacing, xs);
        
        .label {
          @include text-secondary;
          width: 60px;
          font-size: map-get($font-size, sm);
        }
        
        .value {
          @include text-primary;
          font-size: map-get($font-size, sm);
          
          &.admin {
            color: map-get($theme-colors, error);
          }
          &.operator {
            color: map-get($theme-colors, warning);
          }
          &.readonly {
            color: map-get($theme-colors, primary);
          }
        }
      }
    }
  }
  
  .card-footer {
    @include flex-between;
    margin-top: map-get($spacing, base);
    padding-top: map-get($spacing, sm);
    border-top: 1px solid map-get($theme-colors, border);
    
    button {
      flex: 1;
      margin: 0 map-get($spacing, xs);
      
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.add-float-btn {
  @include circle(60px);
  @include flex-center;
  position: fixed;
  right: 30px;
  bottom: 30px;
  background-color: map-get($theme-colors, primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  .icon {
    color: #fff;
    font-size: 28px;
    font-weight: bold;
  }
}
</style>