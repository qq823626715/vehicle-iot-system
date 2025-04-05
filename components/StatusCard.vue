<!--
 * @Description: 
-->
<template>
  <view class="status-card">
    <view class="card-header">
      <text class="title">{{ title }}</text>
      <view class="refresh-rate">
        <uni-icons type="refresh" size="14" color="#8E8E93" />
        <text>{{ refreshRate }}ms</text>
      </view>
    </view>
    
    <view class="data-grid">
      <view 
        v-for="(item, key) in data" 
        :key="key"
        class="data-item"
        :class="[item.status, item.trend, { 'updated': updateFlags[key] }]"
      >
        <text class="label">{{ key }}</text>
        <text class="value">
          {{ item.value }}
          <text v-if="item.unit" class="unit">{{ item.unit }}</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: '',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    refreshRate: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      updateFlags: {}
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        if (!oldVal) {
          // 初始化所有字段为未更新状态
          this.updateFlags = Object.keys(newVal).reduce((acc, key) => {
            acc[key] = false
            return acc
          }, {})
          return
        }

        Object.keys(newVal).forEach(key => {
          if (newVal[key].value !== oldVal[key]?.value) {
            this.$set(this.updateFlags, key, true)
            setTimeout(() => this.$set(this.updateFlags, key, false), 500)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.status-card {
  @include card-style;
  margin-bottom: map-get($spacing, 'base');

  .card-header {
    @include flex-between;
    margin-bottom: map-get($spacing, 'base');
    border-bottom: 1px solid map-get($theme-colors, 'border');
    padding-bottom: map-get($spacing, 'sm');

    .title {
      @include text-primary;
      font-weight: bold;
    }

    .refresh-rate {
      @include flex-align-center;
      @include text-tertiary;

      text {
        margin-left: map-get($spacing, 'sm');
      }
    }
  }

  .data-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: map-get($spacing, 'base');

    .data-item {
      &.warning {
        .value {
          color: map-get($theme-colors, 'warning');
        }
      }

      &.error {
        .value {
          color: map-get($theme-colors, 'error');
        }
      }

      &.up::after {
        content: '↑';
        color: map-get($theme-colors, 'success');
      }

      &.down::after {
        content: '↓';
        color: map-get($theme-colors, 'error');
      }

      .label {
        @include text-secondary;
        margin-bottom: 4px;
      }

      .value {
        @include text-primary;
        font-size: 18px;

        .unit {
          @include text-tertiary;
          margin-left: 2px;
        }
      }
    }
  }
}

.data-item {
  transition: all 0.3s ease;

  .value {
    position: relative;
    
    &.updated {
      animation: pulse 0.5s;
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>