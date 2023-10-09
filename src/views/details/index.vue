<template>
  <div class="app-container">
    <el-descriptions title="详细信息" direction="vertical" :column="7" border>
      <el-descriptions-item label="带外IP">{{ detailData.host }}</el-descriptions-item>
      <el-descriptions-item label="资产编号">{{ detailData.serial_number }}</el-descriptions-item>
      <el-descriptions-item label="CPU数量" :span="5">{{ detailData.cpu_number }}</el-descriptions-item>
      <el-descriptions-item label="CPU内核">
        <el-tag size="small">{{ detailData.cpu_cores }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="内存数量">{{ detailData.memory_number }}</el-descriptions-item>
      <el-descriptions-item label="内存总容量">{{ detailData.memory_capacity_GiB }}</el-descriptions-item>
      <el-descriptions-item label="硬盘容量"></el-descriptions-item>
      <el-descriptions-item label="硬盘数量"></el-descriptions-item>
      <el-descriptions-item label="风扇数量">{{ detailData.memory_capacity_GiB }}</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="3"></el-descriptions-item>
      <el-descriptions-item label="电源数量"></el-descriptions-item>
      <el-descriptions-item label="电源瓦数"></el-descriptions-item>
      <el-descriptions-item label="是否持续采集" :span="4"></el-descriptions-item>
      <el-descriptions-item label="采集状态"></el-descriptions-item>
      <el-descriptions-item label="UUID">{{ detailData.uuid }}</el-descriptions-item>
      <el-descriptions-item label="序列号" :span="2"></el-descriptions-item>
      <el-descriptions-item label="主机名">{{ detailData.memory_capacity_GiB }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>


<script>
import { detailAsset } from '@/api/physical'
export default {
  data() {
    return {
      detailData: null,
      query: {
        host: ''
      }
    }
  },
  created() {
    this.query.host = this.$route.query.id;
    this.getDetail()
  },
  methods: {
    getDetail() {
      detailAsset(this.query).then(response => {
        if (response.code == 0) {
          this.detailData = response.data
        }
      })
    }
  }
}
</script>
