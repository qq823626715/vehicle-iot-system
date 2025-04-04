<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>
<style lang="scss">
@import '@/styles/variables.scss';

page {
  background-color: map-get($theme-colors, background) !important;
  color: map-get($theme-colors, text-primary);
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

// 全局过渡效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// 滚动条样式（H5有效）
::-webkit-scrollbar {
  width: 6px;
  &-track {
    background: rgba(0, 0, 0, 0.2);
  }
  &-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
}
</style>