<template>
  <view class="bind-car-page">
    <view class="form-card">
      <uni-forms :model="formData">
        <uni-forms-item label="车牌号">
          <uni-easyinput 
            v-model="formData.plateNumber" 
            placeholder="请输入车牌号"
          />
        </uni-forms-item>
        
        <uni-forms-item label="车辆识别码">
          <uni-easyinput 
            v-model="formData.vin" 
            placeholder="请输入VIN码"
          />
        </uni-forms-item>
        
        <button 
          type="primary" 
          @click="handleSubmit"
        >
          立即绑定
        </button>
      </uni-forms>
    </view>
    
    <view class="scan-tip">
      <text>或通过</text>
      <text class="scan-btn" @click="handleScan">扫码绑定</text>
    </view>
    <PageBg />
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        plateNumber: '',
        vin: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      uni.showToast({
        title: '绑定成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    },
    handleScan() {
      uni.scanCode({
        success: (res) => {
          this.formData.vin = res.result
        }
      })
    }
  }
}
</script>