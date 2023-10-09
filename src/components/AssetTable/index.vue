<template>
  <div>
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
          {{ scope.row.brand }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="型号" width="100">
        <template slot-scope="scope">
          {{ scope.row.model_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="140" prop="status">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.collection_status)" size="small">
            {{ scope.row.collection_status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采集时间" width="140" prop="status">
        <template slot-scope="scope">
          {{ scope.row.end_time }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <!-- 按钮 -->
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="collectorAsset(scope.row.id)">
            采集
          </el-button>
          <el-button type="text" size="small" @click="changeDialog = true">
            修改
          </el-button>
          <el-button type="text" size="small"
            @click.native.prevent="addDeleteData(scope.row.id, scope.row.host_ip, scope.$index)">
            删除
          </el-button>
          <el-button type="text" size="small">
            升级
          </el-button>
          <el-button type="text" size="small">
            远程安装
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改 -->
    <el-drawer title="修改主机数据!" :before-close="handleClose" :visible.sync="changeDialog" direction="ltr"
      custom-class="demo-drawer" ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="活动名称" label-width="80px">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" label-width="80px">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- Dialog 删除单个数据 -->
    <el-dialog :visible.sync="deleteDialog" width="30%" height="3%" center>
      <div style="text-align: center; padding: 20px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ deleteData.host }} 吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="closeDeleteDialog" size="small">取消</el-button>
        <el-button type="danger" @click="removeAsset" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteAsset, collectorAsset } from '@/api/physical'
export default {
  data() {
    return {
      deleteData: {
        host: null,
        index: null,
        ids: {
          ids: []
        }
      },
      collectorData: {
        ids: {
          ids: []
        }
      },
      multipleSelection: [],
      deleteDialog: false,
      changeDialog: false,
      loading: false,
      timer: null,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  props: {
    listLoading: Boolean,
    tableData: {
      type: Array,
      default: () => []
    },
    listQuery: Object
  },
  created() {
    this.clearMultipleSelection();
  },
  methods: {
    selectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
      this.$emit('data-updated', this.multipleSelection);
    },
    clearMultipleSelection() {
      this.multipleSelection = []
    },
    statusTagType(status) {
      switch (status) {
        case '成功':
          return 'success';
        case '未采集':
          return 'info';
        default:
          return 'danger';
      }
    },
    gotoDetailPage(host) {
      this.$router.push({ path: '/physical/detail', query: { id: host } })
    },
    collectorAsset(id) {
      this.collectorData.ids.ids.push(id)
      collectorAsset(this.collectorData.ids).then(response => {
        if (response.code == 0) {
          this.$message({ message: '执行成功', type: 'success' });
          this.clearCollectorData()
        } else {
          this.closeDeleteDialog()
          this.$message({ message: '执行失败', type: 'error' });
          this.clearCollectorData()
        }
      })
    },
    clearCollectorData() {
      this.collectorData.ids.ids = []
    },
    removeAsset() {
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
    },
    closeDeleteDialog() {
      this.clearDeleteData()
      this.deleteDialog = false
    },
    addDeleteData(id, host, index) {
      this.deleteData.ids.ids.push(id)
      this.deleteData.host = host
      this.deleteData.index = index
      this.deleteDialog = true
    },
    clearDeleteData() {
      this.deleteData.host = ''
      this.deleteData.index = -2
      this.deleteData.ids.ids = []
    },
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch(_ => { });
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    }
  }
}

</script>