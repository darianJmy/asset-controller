<template>
  <div class="app-container">
    <!-- 头部功能 -->
    <div style="margin-top: 20px; margin-bottom: 20px;">
      <!-- 刷新 -->
      <el-button type="primary" icon="el-icon-refresh" @click="handleFilter"></el-button>

      <!-- 新建数据 -->
      <el-button type="primary">新建设备</el-button>

      <el-button class="filter-item" type="primary" icon="el-icon-upload2">
        导入
      </el-button>

      <el-button class="filter-item" type="primary" icon="el-icon-download">
        导出
      </el-button>

      <!-- 更多功能 -->
      <el-button style="margin-left: 10px" type="primary">
        <el-dropdown trigger="click">
          <div>
            <span style="color: white;">
              更多操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="isItemDisabled">批量编辑</el-dropdown-item>
            <el-dropdown-item :disabled="isItemDisabled">批量删除</el-dropdown-item>
            <el-dropdown-item :disabled="isItemDisabled">批量采集</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button>

      <!-- 搜索 -->
      <el-input v-model="listQuery.host" placeholder="please input host"
        style="position: absolute;right:40px;width: 320px;" @keyup.enter.native="handleFilter">
        <template #append>
          <el-button class="custom-button" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- Table 表格 -->
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
      border @sort-change="sortChange">
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
            <span @click="goToOtherPage" style="color: #409eff;">
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
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            采集
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            修改
          </el-button>
          <el-button @click="deleteDialogVisible = true" type="text" size="small">
            移除
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            升级
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            远程安装
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />


    <!-- Dialog 删除 -->
    <el-dialog :visible.sync="deleteDialogVisible" width="20%" center>
      <span>您确定要删除此信息嘛？</span>
      <span slot="footer">
        <el-button @click="deleteDialogVisible = false" size="small">取 消</el-button>
        <el-button type="danger" @click="deleteDialogVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 修改 -->
    <el-dialog title="提示" :visible.sync="dialogFormVisible">

    </el-dialog>


  </div>
</template>

<script>
import { getPhysicalList } from '@/api/physical'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      isItemDisabled: true,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        host: undefined,
        sort: '+status'
      },
      tableData: null,
      multipleSelection: [],
      deleteDialogVisible: false,
      dialogFormVisible: false,
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
    deleteRow(index, rows) {
      rows.splice(index, 1);
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
      console.log(this.multipleSelection)
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
    goToOtherPage() {
      this.$router.push('/details/index')
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