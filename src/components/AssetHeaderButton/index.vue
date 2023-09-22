<template>
  <!-- 头部功能 -->
  <div style="margin-bottom: 10px;">
    <!-- 刷新 -->
    <el-button size="small" type="primary" icon="el-icon-refresh" :loading="refreshLoading" @click="refreshAssets" />

    <!-- 新建数据 -->
    <el-button size="small" type="primary" icon="el-icon-plus" @click="createAssets">新增资产</el-button>

    <!-- 导入 -->
    <el-button size="small" type="primary" icon="el-icon-upload2" @click="importpDialogVisible = true">导入</el-button>

    <!-- 导出 -->
    <el-button size="small" type="primary" icon="el-icon-download" :loading="exportLoading"
      @click="exportAssets">导出</el-button>

    <!-- 更多功能  -->
    <el-dropdown trigger="click" @command="dropdownItemClick">
      <el-button size="small" type="primary" style="margin-left: 10px;">
        <span>更多操作</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="isItemDisabled">批量编辑</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled" command="batchDelete">批量删除</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">批量采集</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">同步到优维</el-dropdown-item>
        <el-dropdown-item :disabled="isItemDisabled">批量修改用户名密码</el-dropdown-item>
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


    <!-- 批量删除 -->
    <el-dialog :visible.sync="deleteGroupDialogVisible" width="30%" height="3%" center>
      <div style="text-align: center; padding: 10px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ multipleSelection.length }} 条数据吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="deleteGroupDialogVisible = false" size="small">取消</el-button>
        <el-button type="danger" size="small" @click="confirmBatchDelete">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog :visible.sync="importpDialogVisible" width="30%" center>
      <div style="text-align: center; padding: 5px;">
        <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple ref="upload"
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
export default {
  data() {
    return {
      isItemDisabled: true,
      deleteGroupDialogVisible: false,
      importpDialogVisible: false,
      exportLoading: false,
      fileList: []
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
    createAssets() {
      this.$router.push('/physical/create')
    },
    exportTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['资产编号', '带外IP', '用户名', '密码']
        const data = [['xxxx', '192.168.1.1', 'admin', 'admin']]
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
    dropdownItemClick(command) {
      if (command == 'batchDelete') {
        this.deleteGroupDialogVisible = true
      }
    },
    confirmBatchDelete() {
      // 遍历选中的行，执行删除操作
      this.multipleSelection.forEach(selectedItem => {
        const index = this.tableData.indexOf(selectedItem);
        if (index !== -1) {
          this.tableData.splice(index, 1); // 从表格数据中删除选中的行
        }
      });
      this.deleteGroupDialogVisible = false
    },
  }
}
</script>

<style scoped>
.el-input .custom-button {
  border-radius: 0 4px 4px 0;
  background-color: #409eff;
  border: 1px solid #409eff;
  /* 按钮的背景颜色 */
  color: #fff;
  /* 按钮的文字颜色 */
}
</style>