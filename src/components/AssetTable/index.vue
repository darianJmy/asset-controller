<template>
  <div>
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列号" width="200">
        <template slot-scope="scope">
          {{ scope.row.serial_number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="带外IP" width="200">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看主机详细信息" placement="top">
            <span @click="gotoDetailPage" style="color: #409eff;">
              {{ scope.row.ipmi_host }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="厂商" width="120">
        <template slot-scope="scope">
          {{ scope.row.firm }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌" width="100">
        <template slot-scope="scope">
          {{ scope.row.brand }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="架构" width="60">
        <template slot-scope="scope">
          {{ scope.row.tecarc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="CPUs" width="80">
        <template slot-scope="scope">
          {{ scope.row.cpus }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Memorys" width="100">
        <template slot-scope="scope">
          {{ scope.row.memory }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最近一次采集" width="140" prop="status">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <!-- 按钮 -->
        <template slot-scope="scope">
          <el-button type="text" size="small">
            采集
          </el-button>
          <el-button type="text" size="small" @click="dialog = true">
            修改
          </el-button>

          <el-button type="text" size="small" @click.native.prevent="removeAsset(scope.row.ipmi_host, scope.$index)">
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

    <!-- Dialog 删除单个数据 -->
    <el-dialog :visible.sync="deleteDialogVisible" width="30%" height="3%" center>
      <div style="text-align: center; padding: 20px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ deleteData.host }} 吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="deleteDialogVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="deleteAsset" size="small">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 -->
    <el-drawer title="修改主机数据!" :before-close="handleClose" :visible.sync="dialog" direction="ltr"
      custom-class="demo-drawer" ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      deleteData: {
        host: null,
        index: -2
      },
      deleteDialogVisible: false,
      multipleSelection: [],
      dialog: false,
      loading: false,
      formLabelWidth: '80px',
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
    removeAsset(host, index) {
      this.deleteData.host = host
      this.deleteData.index = index
      this.deleteDialogVisible = true
    },
    deleteAsset() {
      this.tableData.splice(this.deleteIndex, 1)
      this.deleteData.host = null
      this.deleteData.index = -2
      this.deleteDialogVisible = false
    },
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
    gotoDetailPage() {
      this.$router.push('/physical/detail')
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