<template>
  <div>
    <el-button type="text" size="small" @click="deleteDialog = true">
      删除
    </el-button>

    <el-dialog :visible.sync="deleteDialog" width="30%" height="3%" center :modal="false" :modal-append-to-body="false">
      <div style=" text-align: center; padding: 20px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ host }} 吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="deleteDialog = false" size="small">取消</el-button>
        <el-button type="danger" @click="removeAsset" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteAsset } from '@/api/physical'
export default {
  data() {
    return {
      deleteDialog: false
    }
  },
  props: {
    id: Number,
    host: String,
  },
  methods: {
    removeAsset() {
      this.deleteDialog = false
      const ids = {
        ids: [this.id]
      }
      deleteAsset(ids).then(response => {
        this.$message({ showClose: true, message: '删除成功', type: 'success' });
        this.$emit('taskCompleted');
      }).catch(error => {
        this.$message({ showClose: true, message: '删除失败', type: 'error' });
      })

    },
  }
}
</script>