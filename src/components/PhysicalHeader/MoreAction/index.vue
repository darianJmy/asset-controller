<template>
  <div>
    <!-- 更多功能  -->
    <el-dropdown trigger="click" @command="dropdownClick">
      <el-button size="small" type="primary">
        <span>更多操作</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="isItemDisabled" command="delete">批量删除</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled" command="collector">批量采集</el-dropdown-item>
        <el-dropdown-item command="sync">同步优维</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 批量删除 -->
    <el-dialog :visible.sync="deleteDialog" width="30%" height="3%" center>
      <div style="text-align: center; padding: 10px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ multipleSelection.length }} 条数据吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="deleteDialog = false" size="small">取消</el-button>
        <el-button type="danger" size="small" @click="confirmBatchDelete">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteAsset, collectorAsset } from '@/api/physical'
export default {
  data() {
    return {
      isItemDisabled: true,
      deleteDialog: false,
    }
  },
  props: {
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    multipleSelection: {
      handler(newArray) {
        this.isItemDisabled = newArray.length === 0;
      },
      deep: true,
    },
  },
  methods: {
    dropdownClick(command) {
      switch (command) {
        case 'delete':
          this.deleteDialog = true
          break
        case 'collector':
          this.thisFirmBatchCollector()
          break
        case 'sync':
          this.$message({ message: '功能没做呢~', type: 'warning' });
      }
    },
    confirmBatchDelete() {
      const ids = {
        ids: []
      }
      this.multipleSelection.forEach(selectedItem => {
        ids.ids.push(selectedItem.id)
      })
      deleteAsset(ids).then(response => {
        this.$message({ message: '删除成功', type: 'success' })
        this.$emit('taskCompleted');
      }).catch(error => {
        this.$message({ message: '删除失败', type: 'success' })
      })
      this.deleteDialog = false
    },
    thisFirmBatchCollector() {
      const ids = {
        ids: []
      }
      this.multipleSelection.forEach(selectedItem => {
        ids.ids.push(selectedItem.id)
      })
      collectorAsset(ids).then(response => {
        this.$message({ message: '批量采集成功', type: 'success' });
      }).catch(error => {
        this.$message({ message: '批量采集失败', type: 'error' });
      })
    }
  }
}

</script>