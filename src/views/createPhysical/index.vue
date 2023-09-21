<template>
  <div class="app-container">
    <el-form ref="form" :model="ruleForm" :rules="formRules" label-width="65px">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="主机IP" prop="host">
            <el-input v-model="ruleForm.host" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" :type="passwordVisible ? 'text' : 'password'" style="width: 100%;">
              <template slot="suffix">
                <i :class="passwordVisible ? 'el-icon-minus' : 'el-icon-view'" @click="togglePasswordVisibility"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="厂商" prop="selectOption">
            <el-select v-model="ruleForm.selectOption" placeholder="请选择" style="width: 100%;">
              <el-option label="烽火" value="option1"></el-option>
              <el-option label="联想" value="option2"></el-option>
              <!-- 添加更多选项 -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="品牌" prop="selectOption">
            <el-select v-model="ruleForm.selectOption" placeholder="请选择" style="width: 100%;">
              <el-option label="R2280 V5" value="option1"></el-option>
              <el-option label="选项2" value="option2"></el-option>
              <!-- 添加更多选项 -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="validateAndSubmit">添加</el-button>
            <el-button @click="clearForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" style="width: 100%; margin: 0 auto; text-align: center;">
      <el-table-column label="带外IP" width="180">
        <template slot-scope="scope">
          {{ scope.row.host }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <!-- 按钮 -->
        <template slot-scope="scope">
          <el-button @click.native.prevent="removeRow(scope.row, tableData)" type="text" size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data() {
    return {
      ruleForm: {
        host: '',
        username: '',
        password: '',
      },
      formRules: {
        host: [
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
      tableData: [],
      passwordVisible: false,

    }
  },
  methods: {
    validateIPAddress(rule, value, callback) {
      const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      if (!ipPattern.test(value)) {
        callback(new Error('请输入有效的IP地址'));
      } else {
        callback();
      }
    },
    validateAndSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.onSubmit(); // 只有在验证通过时才触发提交
        }
      });
    },
    onSubmit() {
      this.tableData.push({ ...this.ruleForm });
      this.clearForm()
    },
    clearForm() {
      this.ruleForm.host = '';
      this.ruleForm.username = '';
      this.ruleForm.password = '';
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    removeRow(row, data) {
      const index = data.indexOf(row);
      if (index !== -1) {
        data.splice(index, 1);
      }
    },
  },
  computed: {
    iconRefresh() {
      return 'el-icon-refresh';
    },
    buttonTextRefresh() {
      return '刷新';
    },
  }
}
</script>

<style>
.required-label {
  color: red;
  margin-left: 5px;
}
</style>