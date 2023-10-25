<template>
  <el-table v-loading="listLoading" :data="tableData" style="width: 100%" @selection-change="selectionChange">
    <el-table-column type="selection"></el-table-column>
    <el-table-column label="ID" align="center" width="60">
      <template slot-scope="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="资产编号" width="140">
      <template slot-scope="scope">
        {{ scope.row.asset_number }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="带外IP" width="120">
      <template slot-scope="scope">
        <el-tooltip effect="dark" content="点击查看主机详细信息" placement="top">
          <span @click="gotoDetailPage(scope.row.host_ip)" style="color: #409eff;">
            {{ scope.row.host_ip }}
          </span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column align="center" label="厂商" width="120">
      <template slot-scope="scope">
        {{ scope.row.firm }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="CPU" width="70">
      <template slot-scope="scope">
        {{ scope.row.info.cpu_cores }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="内存" width="70">
      <template slot-scope="scope">
        {{ scope.row.info.memory_capacity_GiB }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="节点类型" width="150">
      <template slot-scope="scope">
        {{ scope.row.node_type }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="状态" width="90" prop="status">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.collection_status" :type="statusTagType(scope.row.collection_status)" size="small">
          {{ scope.row.collection_status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="采集时间" width="180" prop="last_collection" sortable>
      <template slot-scope="scope">
        {{ scope.row.last_collection }}
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <!-- 按钮 -->
      <template slot-scope="scope">
        <span class="child-wrapper"><collector-asset :id="scope.row.id" /></span>
        <span class="child-wrapper"><change-asset :data="scope.row" /></span>
        <span class="child-wrapper"><delete-asset :id="scope.row.id" :host="scope.row.host_ip"
            @taskCompleted="taskCompleted" /></span>
        <span class="child-wrapper"><log-asset :log="scope.row.collection_log" /></span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import CollectorAsset from './CollectorAsset'
import ChangeAsset from './ChangeAsset'
import DeleteAsset from './DeleteAsset'
import LogAsset from './LogAsset'
export default {
  components: { CollectorAsset, ChangeAsset, DeleteAsset, LogAsset },
  data() {
    return {
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    listLoading: {
      type: Boolean,
      default: () => false
    },
    taskCompleted: {
      type: Function,
      required: true
    }
  },
  methods: {
    selectionChange(val) {
      this.$emit('multipleSelection', val);
    },
    statusTagType(status) {
      switch (status) {
        case '采集成功':
          return 'success';
        case '采集中':
          return 'info';
        default:
          return 'danger';
      }
    },
    assetList(data) {
      this.tableData = data
    },
    gotoDetailPage(host) {
      this.$router.push({ path: '/physical/detail', query: { id: host } })
    },
  }
}
</script>

<style>
.child-wrapper {
  display: inline-block;
  margin-right: 5px;
}
</style>