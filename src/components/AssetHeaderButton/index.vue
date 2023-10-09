<template>
  <!-- 头部功能 -->
  <div style="margin-bottom: 10px;">
    <!-- 刷新 -->
    <el-button size="small" type="primary" icon="el-icon-refresh" :loading="refreshLoading" @click="refreshAssets" />

    <!-- 新建数据 -->
    <el-button size="small" type="primary" icon="el-icon-plus" @click="addAssetDialog = true">新增资产</el-button>

    <!-- 导入 -->
    <el-button size="small" type="primary" icon="el-icon-upload2" @click="importpDialogVisible = true">导入</el-button>

    <!-- 导出 -->
    <el-button size="small" type="primary" icon="el-icon-download" :loading="exportLoading"
      @click="exportAssets">导出</el-button>

    <!-- 更多功能  -->
    <el-dropdown trigger="click" @command="dropdownClick">
      <el-button size="small" type="primary" style="margin-left: 10px;">
        <span>更多操作</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="isItemDisabled">批量编辑</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled" command="delete">批量删除</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">批量采集</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">同步优维</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">批量修改</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 搜索 -->
    <el-input size="small" placeholder="模糊搜索" style="position: absolute;right:40px;width: 320px;">
      <template #append>
        <el-button size="small" class="custom-button" type="primary" icon="el-icon-search">
          搜索
        </el-button>
      </template>
    </el-input>

    <!-- 新增 -->
    <el-dialog title="新增资产" :visible.sync="addAssetDialog" width="600px" height="auto">
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
        <el-form-item label="品牌" label-width="80px">
          <el-input v-model="addData.brand" style="width: 95%;"></el-input>
        </el-form-item>
        <el-form-item label="型号" label-width="80px">
          <el-input v-model="addData.model_name" style="width: 95%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAddData">重置</el-button>
        <el-button type="primary" @click="addAsset">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 批量删除 -->
    <el-dialog :visible.sync="deleteDialog" width="30%" height="3%" center>
      <div style="text-align: center; padding: 10px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ multipleSelection.length }} 条数据吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="closeDeleteDialog" size="small">取消</el-button>
        <el-button type="danger" size="small" @click="confirmBatchDelete">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog :visible.sync="importpDialogVisible" width="30%" center>
      <div style="text-align: center; padding: 5px;">
        <el-upload class="upload-demo" drag action="http://10.250.49.78:8081/api/assetconfig/upload" multiple ref="upload"
          :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :before-upload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件，点击此处<a href="#" @click="exportTemplate"
              style="color: #409eff;">下载模板</a></div>
        </el-upload>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="importpDialogVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="handleUpload" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createAsset, deleteAsset } from '@/api/physical'
export default {
  data() {
    return {
      isItemDisabled: true,
      deleteDialog: false,
      importpDialogVisible: false,
      exportLoading: false,
      fileList: [],
      addAssetDialog: false,
      addData: {
        asset_number: '',
        host_ip: '',
        username: '',
        password: '',
        brand: '',
        model_name: '',
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
      deleteData: {
        ids: {
          ids: []
        }
      }
    }
  },
  props: {
    refreshLoading: Boolean,
    multipleSelection: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
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
    refreshAssets() {
      this.$emit('refresh-assets')
    },
    closeDeleteDialog() {
      this.deleteDialog = false
    },
    openDeleteDialog() {
      this.deleteDialog = true
    },
    clearAddData() {
      this.addData.asset_number = '';
      this.addData.host_ip = '';
      this.addData.username = '';
      this.addData.password = '';
      this.addData.brand = '';
      this.addData.model_name = '';
    },
    validateIPAddress(rule, value, callback) {
      const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      if (!ipPattern.test(value)) {
        callback(new Error('请输入有效的IP地址'));
      } else {
        callback();
      }
    },
    addAsset() {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          this.addAssetDialog = false
          createAsset(this.addData).then(response => {
            if (response.code == 0) {
              this.$message({ message: '新建数据成功', type: 'success' });
              this.refreshAssets()
              this.clearAddData()
            } else {
              this.$message({ message: '新建数据失败', type: 'error' });
              this.clearAddData()
            }
          })
        }
      });
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    exportTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['资产编号', '采集主机IP', '用户名', '密码', '厂商', '品牌', '型号']
        const data = [['xxxx', '192.168.1.1', 'admin', 'admin', 'FiberHome', 'R2280 V4', 'FG42X V1-001']]
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "template",
          autoWidth: "true",
          bookType: "xlsx"
        })
      })
    },
    beforeUpload(file) {
      // 判断上传的文件类型是否是xlsx
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        this.$message.error('只能上传xlsx文件');
        return false;
      }
      this.fileList.push(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleUpload() {
      // 在这里处理上传成功的逻辑
      this.$refs.upload.submit();
      this.fileList = []
      this.importpDialogVisible = false
    },
    exportAssets() {
      this.exportLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['SerialNumber', 'IPMIHost']
        const filterVal = ['serial_number', 'ipmi_host']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.exportLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    dropdownClick(command) {
      if (command == 'delete') {
        this.openDeleteDialog()
      }
    },
    confirmBatchDelete() {
      // 遍历选中的行，执行删除操作
      this.multipleSelection.forEach(selectedItem => {
        const index = this.tableData.indexOf(selectedItem);
        if (index !== -1) {
          const selectedData = this.tableData[index];
          this.deleteData.ids.ids.push(selectedData.id)
          this.tableData.splice(index, 1);
        }
      });
      deleteAsset(this.deleteData.ids).then(response => {
        if (response.code == 0) {
          this.closeDeleteDialog()
          this.$message({ message: '删除成功', type: 'success' });
          this.clearDeleteData()
          this.tableData.splice(this.deleteIndex, 1)
        } else {
          this.closeDeleteDialog()
          this.$message({ message: '删除失败', type: 'error' });
          this.clearDeleteData()
        }
      })
      this.closeDeleteDialog()
    },
    clearDeleteData() {
      this.deleteData.ids.ids = []
    }
  }
}
</script>

<style>
.el-input .custom-button {
  border-radius: 0 4px 4px 0;
  background-color: #409eff;
  border: 1px solid #409eff;
  /* 按钮的背景颜色 */
  color: #fff;
  /* 按钮的文字颜色 */
}
</style>