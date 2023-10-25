<template>
  <div>
    <el-button type="text" size="small" @click="changeDialog = true">
      更新
    </el-button>

    <!-- 批量修改 -->
    <el-dialog title="修改" :visible.sync="changeDialog" width="400px" height="auto" @close="clearChangeData" :modal="false"
      :modal-append-to-body="false">
      <el-form ref="changeData" :model="changeData" :rules="changeDataRules">
        <el-form-item label="资产编号" label-width="80px">
          <el-input v-model="changeData.asset_number" style="width: 95%;"></el-input>
        </el-form-item>
        <el-form-item label="厂商" label-width="80px">
          <el-input v-model="changeData.firm" style="width: 95%;"></el-input>
        </el-form-item>
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
        <el-form-item label="节点类型" label-width="80px">
          <el-input v-model="changeData.nodeType" style="width: 95%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取消</el-button>
        <el-button type="primary" @click="change">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { updateAsset } from '@/api/physical'
export default {
  data() {
    return {
      passwordVisible: false,
      changeDialog: false,
      changeData: {
        asset_number: null,
        firm: null,
        password: null,
        username: null,
        node_type: null
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
    data: Object
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    change() {
      if (this.changeData.asset_number === null) {
        this.changeData.asset_number = this.data.asset_number
      }
      if (this.changeData.firm === null) {
        this.changeData.firm = this.data.firm
      }
      if (this.changeData.node_type === null) {
        this.changeData.node_type = this.data.node_type
      }
      const data = {
        id: this.data.id,
        password: this.changeData.password,
        username: this.changeData.username
      }
      updateAsset(data).then(response => {
        this.$message({ showClose: true, message: '更新成功', type: 'success' });
      }).catch(error => {
        this.$message({ showClose: true, message: '更新失败', type: 'success' });
      })
      this.changeDialog = false
    },
    clearChangeData() {
      this.changeData = {
        asset_number: null,
        firm: null,
        password: null,
        username: null,
        node_type: null
      }
    }
  }
}
</script>