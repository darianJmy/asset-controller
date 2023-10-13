<template>
  <div class="app-container">
    <el-form :model="rackData" :rules="rackDataRules" ref="rackData" label-width="50px">
      <el-form-item label="机柜行数" prop="cabinet_row" label-width="80px" class="form-item-inline">
        <el-input v-model="rackData.cabinet_row"></el-input>
      </el-form-item>

      <el-form-item label="机柜列数" prop="cabinet_column" label-width="80px" class="form-item-inline">
        <el-input v-model="rackData.cabinet_column"></el-input>
      </el-form-item>

      <el-form-item label="机柜U位" prop="rack_unit" label-width="80px" class="form-item-inline">
        <el-input v-model="rackData.rack_unit"></el-input>
      </el-form-item>
      <el-button @click="clearRackData">取消</el-button>
      <el-button type="primary" @click="handleUpload">确 定</el-button>
    </el-form>

    <div style="text-align: center; padding: 5px;">
      <el-upload drag ref="upload" action="" :auto-upload="false" :before-upload="beforeUpload" :limit="1"
        :http-request="customHttpRequest">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，点击此处<a href="#" @click="exportTemplate"
            style="color: #409eff;">下载模板</a></div>
      </el-upload>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      rackData: {
        cabinet_row: null,
        cabinet_column: null,
        rack_unit: null,
      },
      rackDataRules: {
        cabinet_row: [
          { required: true, message: '请输入数字', trigger: 'blur' },
          { validator: this.validateNumber, trigger: 'blur' }
        ],
        cabinet_column: [
          { required: true, message: '请输入数字', trigger: 'blur' },
          { validator: this.validateNumber, trigger: 'blur' }
        ],
        rack_unit: [
          { required: true, message: '请输入数字', trigger: 'blur' },
          { validator: this.validateNumber, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    validateNumber(rule, value, callback) {
      if (!isNaN(value)) {
        callback()
      } else {
        callback(new Error('必须为数字值'))
      }
    },
    beforeUpload(file) {
      // 判断上传的文件类型是否是xlsx
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXLSX) {
        this.$message.error('只能上传xlsx文件')
        return false
      }
      return true
    },
    exportTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '机柜行坐标', '机柜列坐标', '机柜名', 'U数', '设备名', '填充颜色']
        const data = [['1', '1', '2', 'B1', '28-29', 'KFC-XXX-yy', '绿'], ['2', '2', '1', 'A2', '8', 'KFC-XXX-yy', '蓝']]
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "template",
          autoWidth: "true",
          bookType: "xlsx",

        })
      })
    },

    customHttpRequest(file) {
      const formData = new FormData();
      formData.append('file', file.file)
      formData.append('cabinet_row', this.rackData.cabinet_row)
      formData.append('cabinet_column', this.rackData.cabinet_column)
      formData.append('rack_unit', this.rackData.rack_unit)
      fetch('http://10.250.49.78:8081/api/cabinet/convert', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'exporter.xlsx');
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          this.$message({ showClose: true, message: '下载文件成功', type: 'success' })
        }).catch(error => { })
    },
    handleUpload() {
      this.$refs.upload.submit()
      this.$refs.upload.clearFiles();
      this.clearRackData()
    },
    clearRackData() {
      this.rackData = {
        cabinet_row: null,
        cabinet_column: null,
        rack_unit: null,
      }
    }
  }
}
</script>


<style>
.form-item-inline {
  display: inline-block;
  margin-right: 20px;
}
</style>