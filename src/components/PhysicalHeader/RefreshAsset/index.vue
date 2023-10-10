<template>
  <!-- 刷新 -->
  <div>
    <el-button size="small" type="primary" icon="el-icon-refresh" :loading="refreshLoading" @click="refreshAssets" />
  </div>
</template>

<script>
import { getAssetList } from '@/api/physical'
export default {
  data() {
    return {
      refreshLoading: false,
    }
  },
  methods: {
    refreshAssets() {
      const listQuery = {
        page: 1,
        limit: 20
      }
      this.refreshLoading = true
      getAssetList(listQuery).then(response => {
        this.refreshLoading = false
        this.$emit("refresh-event", response.data);
        this.$message({ message: '刷新成功', type: 'success' })
      })
    }
  },
}
</script>