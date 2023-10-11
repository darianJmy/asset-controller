<template>
  <!-- 刷新 -->
  <div>
    <el-button size="small" type="primary" icon="el-icon-refresh" :loading="refreshLoading" @click="refresh" />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    refreshLoading: Boolean,
  },
  methods: {
    refresh() {
      this.$emit('taskCompleted');
    }
  }
}
</script>