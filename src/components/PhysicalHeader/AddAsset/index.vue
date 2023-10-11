<template>
  <!-- 新建数据 -->
  <div>
    <el-button size="small" type="primary" icon="el-icon-plus" @click="addAssetDialog = true">新增资产</el-button>

    <!-- 新增 -->
    <el-dialog title="新增资产" :visible.sync="addAssetDialog" width="600px" height="auto" @close="clearAddData">
      <el-form ref="addData" :model="addData" :rules="addDataRules">
        <el-form-item label="资产编号" label-width="80px" prop="asset_number">
          <el-input v-model="addData.asset_number" style="width: 95%;"></el-input>
        </el-form-item>
        <el-form-item label="带外地址" label-width="80px" prop="host_ip">
          <el-input v-model="addData.host_ip" style="width: 95%;"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="addData.username" style="width: 95%;"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="addData.password" :type="passwordVisible ? 'text' : 'password'" style="width: 95%;">
            <template slot="suffix">
              <i :class="passwordVisible ? 'el-icon-minus' : 'el-icon-view'" @click="togglePasswordVisibility"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="厂商" label-width="80px">
          <el-input v-model="addData.firm" style="width: 95%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAssetDialog = false">取消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createAsset } from '@/api/physical'
export default {
  data() {
    return {
      addAssetDialog: false,
      addData: {
        asset_number: '',
        host_ip: '',
        username: '',
        password: '',
        firm: '',
      },
      addDataRules: {
        asset_number: [
          { required: true, message: '请输入资产编号', trigger: 'blur' },
        ],
        host_ip: [
          { required: true, message: '请输入主机IP', trigger: 'blur' },
          { validator: this.validateIPAddress, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      passwordVisible: false,
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    validateIPAddress(rule, value, callback) {
      const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
      if (!ipPattern.test(value)) {
        callback(new Error('请输入有效的IP地址'))
      } else {
        callback()
      }
    },
    create() {
      this.$refs.addData.validate(async (valid) => {
        if (valid) {
          await createAsset(this.addData).then(response => {
            this.$message({ message: '新建数据成功', type: 'success' })
            this.$emit('taskCompleted');
          }).catch(error => {
            this.$message({ message: '新建数据失败', type: 'error' })
          })
          this.addAssetDialog = false
        }
      });
    },
    clearAddData() {
      this.addData = {
        asset_number: '',
        host_ip: '',
        username: '',
        password: '',
        firm: '',
      };
    },
  },
}

</script>