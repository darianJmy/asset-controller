<template>
  <div>
    <el-upload class="upload-demo" drag action="#" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
    </el-upload>

    <!-- 表格组件 -->
    <el-table :data="tableData" v-if="tableData.length > 0">
      <!-- 表格列定义 -->
      <!-- 例如： -->
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <!-- 其他表格列 -->
    </el-table>
  </div>
</template>

<script>
import XLSX from 'xlsx'; // 引入解析Excel的库

export default {
  data() {
    return {
      tableData: [] // 存放解析后的数据
    };
  },
  methods: {
    beforeUpload(file) {
      // 判断上传的文件类型是否是xlsx
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        this.$message.error('只能上传xlsx文件');
        return false;
      }
    },
    handleUploadSuccess(response, file) {
      const reader = new FileReader();

      // 读取上传的Excel文件
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);

        // 解析Excel文件
        const workbook = XLSX.read(data, { type: 'array' });

        // 获取第一个工作表
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // 将工作表数据转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // 更新表格数据
        this.tableData = jsonData;
      };

      // 读取文件内容
      reader.readAsArrayBuffer(file.raw);
    }
  }
};
</script>
