<template>
  <div>
    <el-button size="small" type="primary" icon="el-icon-download" @click="exportAssets">导出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    exportAssets() {
      fetch('http://10.250.49.78:8081/api/assetconfig/export', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
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
        })
        .catch(error => {
          this.$message({ message: '下载文件失败', type: 'error' })
        });
    }
  }
}

</script>