<template>
  <div class="app-container">
    <el-descriptions title="详细信息" direction="vertical" :column="7" border>
      <el-descriptions-item label="带外IP">kooriookami</el-descriptions-item>
      <el-descriptions-item label="资产编号">18100000000</el-descriptions-item>
      <el-descriptions-item label="CPU数量" :span="5">苏州市</el-descriptions-item>
      <el-descriptions-item label="CPU内核">
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="内存数量"></el-descriptions-item>
      <el-descriptions-item label="内存总容量"></el-descriptions-item>
      <el-descriptions-item label="硬盘容量"></el-descriptions-item>
      <el-descriptions-item label="硬盘数量"></el-descriptions-item>
      <el-descriptions-item label="风扇数量"></el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="3"></el-descriptions-item>
      <el-descriptions-item label="电源数量"></el-descriptions-item>
      <el-descriptions-item label="电源瓦数"></el-descriptions-item>
      <el-descriptions-item label="是否持续采集" :span="4"></el-descriptions-item>
      <el-descriptions-item label="采集状态"></el-descriptions-item>
      <el-descriptions-item label="UUID"></el-descriptions-item>
      <el-descriptions-item label="序列号" :span="2"></el-descriptions-item>
      <el-descriptions-item label="主机名"></el-descriptions-item>
    </el-descriptions>
  </div>
</template>


<script>
export default {
  data() {
    return {
      size: ''
    }
  },
  methods: {
    goBack() {
      console.log('go back');
    },
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>
