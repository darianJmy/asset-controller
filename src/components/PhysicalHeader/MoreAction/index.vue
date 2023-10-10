<template>
  <div>
    <!-- 更多功能  -->
    <el-dropdown trigger="click" @command="dropdownClick">
      <el-button size="small" type="primary">
        <span>更多操作</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="isItemDisabled">批量编辑</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled" command="delete">批量删除</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">批量采集</el-dropdown-item>
        <el-dropdown-item>同步优维</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">批量修改</el-dropdown-item>
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
export default {
  data() {
    return {
      isItemDisabled: true,
      ids: {
        ids: []
      }
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
        console.log(this.multipleSelection)
        this.isItemDisabled = newArray.length === 0;
      },
      deep: true,
    },
  },
  methods: {
    dropdownClick(command) {
      if (command == 'delete') {
        this.deleteDialog = true
      }
    },
    confirmBatchDelete() {
      // 遍历选中的行，执行删除操作
      this.multipleSelection.forEach(selectedItem => {
        this.ids.ids.push(multipleSelection.id)
      }
      );
      deleteAsset(this.ids).then(response => {
        this.closeDeleteDialog()
        this.$message({ message: '删除成功', type: 'success' });
      }).catch(error => {
        this.ids.ids = []
      })
      this.closeDeleteDialog()
    },
  }
}

</script>