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
        <el-dropdown-item :disabled="isItemDisabled" command="change">批量修改</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled" command="collector">批量采集</el-dropdown-item>
        <el-dropdown-item command="sync">同步优维</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 批量修改 -->
    <el-dialog title="批量修改" :visible.sync="changeDialog" width="600px" height="auto" @close="clearChangeData">
      <el-form ref="changeData" :model="changeData" :rules="changeDataRules">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="changeData.username" style="width: 95%;"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="changeData.password" :type="passwordVisible ? 'text' : 'password'" style="width: 95%;">
            <template slot="suffix">
              <i :class="passwordVisible ? 'el-icon-minus' : 'el-icon-view'" @click="togglePasswordVisibility"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchChange">确 定</el-button>
      </div>
    </el-dialog>

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
import { deleteAsset, updateAsset, collectorAsset } from '@/api/physical'
export default {
  data() {
    return {
      isItemDisabled: true,
      deleteDialog: false,
      changeDialog: false,
      passwordVisible: false,
      changeData: {
        username: null,
        password: null
      },
      changeDataRules: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ]
      },
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
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    dropdownClick(command) {
      switch (command) {
        case 'delete':
          this.deleteDialog = true
          break
        case 'collector':
          this.thisFirmBatchCollector()
          break
        case 'change':
          this.changeDialog = true
          break
        case 'sync':
          this.$message({ showClose: true, message: '功能没做呢~', type: 'warning' });
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
        this.$message({ showClose: true, message: '删除成功', type: 'success' })
        this.$emit('taskCompleted');
      }).catch(error => {
        this.$message({ showClose: true, message: '删除失败', type: 'success' })
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
        this.$message({ showClose: true, message: '执行成功', type: 'success' });
      }).catch(error => {
        this.$message({ showClose: true, message: '执行失败', type: 'error' });
      })
    },
    confirmBatchChange() {
      this.multipleSelection.forEach(selectedItem => {
        const asset = {
          id: selectedItem.id,
          username: this.changeData.username,
          password: this.changeData.password
        }
        updateAsset(asset).then(response => {
          this.$message({ showClose: true, message: '更新成功', type: 'success' })
        }).catch(error => {
          this.$message({ showClose: true, message: '更新失败', type: 'success' })
        })
      })
      this.$emit('taskCompleted');
      this.changeDialog = false
    },
    clearChangeData() {
      this.changeData = {
        username: null,
        password: null
      }
    }
  }
}

</script>