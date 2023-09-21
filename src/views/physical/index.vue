<template>
  <div class="app-container" style="background-color: #f3f3f4;">
    <!-- 头部功能 -->
    <div style="margin-bottom: 10px;">
      <!-- 刷新 -->
      <el-button size="small" type="primary" icon="el-icon-refresh" @click="handleRefreshAssets" />

      <!-- 新建数据 -->
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreateAssets">新增资产</el-button>

      <!-- 导入 -->
      <el-button size="small" type="primary" icon="el-icon-upload2" @click="handleImportAssets">导入</el-button>

      <!-- 导出 -->
      <el-button size="small" type="primary" icon="el-icon-download" :loading="exportLoading"
        @click="handleExportAssets">导出</el-button>

      <!-- 更多功能  -->
      <el-dropdown trigger="click" @command="handleDropdownItemClick">
        <el-button size="small" type="primary" style="margin-left: 10px;">
          <span>更多操作</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="isItemDisabled">批量编辑</el-dropdown-item>
          <el-dropdown-item :disabled="isItemDisabled" command="batchDelete">批量删除</el-dropdown-item>
          <el-dropdown-item :disabled="isItemDisabled">批量采集</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 搜索 -->
      <el-input size="small" placeholder="please input host" style="position: absolute;right:40px;width: 320px;">
        <template #append>
          <el-button size="small" class="custom-button" type="primary" icon="el-icon-search">
            搜索
          </el-button>
        </template>
      </el-input>
    </div>


    <!-- Table 表格 -->
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
      @sort-change="sortChange">
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
      <el-table-column align="center" label="最近一次采集" width="140" prop="status" sortable="custom"
        :class-name="getSortClass('status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '成功' ? 'success' : 'danger'">
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
          <el-button type="text" size="small">
            修改
          </el-button>

          <el-button type="text" size="small" @click.native.prevent="deleteAssetData(scope.row.ipmi_host, scope.$index)">
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

    <!-- Pagination 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />


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

    <!-- Dialog 删除一组数据 -->
    <el-dialog :visible.sync="deleteGroupDialogVisible" width="30%" height="3%" center>
      <div style="text-align: center; padding: 10px;">
        <i class="el-icon-info" style="font-size: 36px; color: red;"></i>
        <p style="font-size: 18px; margin-top: 10px;">您确定要删除 {{ multipleSelection.length }} 条数据吗？</p>
      </div>
      <span slot="footer" style="text-align: center;">
        <el-button @click="deleteGroupDialogVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="confirmBatchDelete" size="small">确定</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 导入数据 -->
    <el-dialog :visible.sync="importpDialogVisible" width="30%" center>
      <div style="text-align: center; padding: 5px;">
        <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple ref="upload"
          :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :before-upload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件，点击此处<a href="#" @click="handleExportTemplate"
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
import Pagination from '@/components/Pagination'
import { getList } from '@/api/table'
import { getPhysicalList } from '@/api/physical'

export default {
  components: { Pagination, },
  data() {
    return {
      exportLoading: false,
      isItemDisabled: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        host: undefined,
        sort: '+status'
      },
      total: 0,
      tableData: null,
      multipleSelection: [],
      deleteDialogVisible: false,
      deleteGroupDialogVisible: false,
      importpDialogVisible: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      deleteData: {
        host: null,
        index: -2
      },
      fileList: []
    }
  },
  created() {
    this.getList();
    this.clearMultipleSelection();
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
    handleRefreshAssets() {
      this.getList();
    },
    handleCreateAssets() {
      this.$router.push('/physical/create')
    },
    handleImportAssets() {
      this.importpDialogVisible = true
    },
    handleExportAssets() {
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
    handleExportTemplate() {
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
    deleteAssetData(host, index) {
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
    getList() {
      this.listLoading = true
      getPhysicalList(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearMultipleSelection() {
      this.multipleSelection = []
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'status') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+status'
      } else {
        this.listQuery.sort = '-status'
      }
      this.handleFilter()
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    gotoDetailPage() {
      this.$router.push('/details/index')
    },
    handleDropdownItemClick(command) {
      if (command == 'batchDelete') {
        // 在这里执行批量删除的逻辑
        this.openBatchDeleteDialog();
      }
    },
    openBatchDeleteDialog() {
      this.deleteGroupDialogVisible = true
    },
    confirmBatchDelete() {
      // 遍历选中的行，执行删除操作
      this.multipleSelection.forEach(selectedItem => {
        const index = this.tableData.indexOf(selectedItem);
        if (index !== -1) {
          this.tableData.splice(index, 1); // 从表格数据中删除选中的行
        }
      });
      // 清空选中的行
      this.clearMultipleSelection();
      this.deleteGroupDialogVisible = false
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

    }
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