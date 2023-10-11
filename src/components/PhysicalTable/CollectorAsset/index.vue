<template>
  <div>
    <el-button type="text" size="small" @click="run">
      采集
    </el-button>
  </div>
</template>


<script>
import { collectorAsset } from '@/api/physical'
export default {
  data() {
    return {}
  },
  props: {
    id: Number
  },
  methods: {
    run() {
      const ids = {
        ids: [this.id]
      }
      collectorAsset(ids).then(response => {
        this.$message({ message: '执行成功', type: 'success' });
      }).catch(error => {
        this.$message({ message: '执行失败', type: 'error' });
      })
    }
  }
}
</script>