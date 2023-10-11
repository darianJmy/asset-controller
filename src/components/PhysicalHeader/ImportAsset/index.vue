<template>
  <div>
    <el-button size="small" type="primary" icon="el-icon-upload2" @click="importAssetDialog = true">导入</el-button>

    <!-- 导入 -->
    <el-dialog :visible.sync="importAssetDialog" width="30%" center @close="clearFileList">
      <div style="text-align: center; padding: 5px;">
        <el-upload drag action="http://10.250.49.78:8081/api/assetconfig/upload" multiple ref="upload"
          :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :before-upload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件，点击此处<a href="#" @click="exportTemplate"
              style="color: #409eff;">下载模板</a></div>
        </el-upload>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="importAssetDialog = false" size="small">取消</el-button>
        <el-button type="danger" @click="handleUpload" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      importAssetDialog: false,
      fileList: [],
    }
  },
  methods: {
    handleRemove(file, fileList) {
      const targetFileIdentifier = file.name;
      this.fileList = fileList.filter(item => item.name !== targetFileIdentifier);
    },
    beforeUpload(file) {
      // 判断上传的文件类型是否是xlsx
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXLSX) {
        this.$message.error('只能上传xlsx文件')
        return false
      }
      this.fileList.push(file)
      return true
    },
    exportTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['资产编号', '带外地址', '用户名', '密码', '厂商']
        const data = [['xxxx', '192.168.1.1', 'admin', 'admin', 'FiberHome']]
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "template",
          autoWidth: "true",
          bookType: "xlsx"
        })
      })
    },
    handleUpload() {
      this.$refs.upload.submit()
      setTimeout(() => {
        this.$emit('taskCompleted');
      }, 500)
      this.importAssetDialog = false
    },
    clearFileList() {
      this.fileList = []
    }
  }
}

</script>