<template>
  <div class="app-container">

    <physical-header :refreshLoading="refreshLoading" :taskCompleted="refreshassetList"
      :multipleSelection="multipleSelection" @searchText="watchSearchText"></physical-header>

    <physical-table :listLoading="listLoading" :tableData="tableData" @multipleSelection="watchMultipleSelection"
      :taskCompleted="assetList"></physical-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="assetList" />

  </div>
</template>

<script>
import PhysicalHeader from '@/components/PhysicalHeader'
import PhysicalTable from '@/components/PhysicalTable'
import Pagination from '@/components/Pagination'
import { getAssetList } from '@/api/physical'
export default {
  components: { PhysicalHeader, PhysicalTable, Pagination },
  data() {
    return {
      refreshLoading: false,
      listLoading: false,
      tableData: null,
      multipleSelection: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
      },
      data: null
    }
  },
  created() {
    this.assetList();
  },
  methods: {
    assetList() {
      this.refreshLoading = true
      this.listLoading = true
      getAssetList(this.listQuery).then(response => {
        setTimeout(() => {
          console.log(response)
          this.tableData = response.data
          this.total = response.count
          this.refreshLoading = false
          this.listLoading = false
          this.$message({ showClose: true, message: '加载成功', type: 'success' })
        }, 500)
      }).catch(error => {
        this.refreshLoading = false
        this.listLoading = false
        this.$message({ showClose: true, message: '加载失败', type: 'error' })
      })
    },
    refreshassetList() {
      this.refreshLoading = true
      this.listLoading = true
      this.listQuery = {
        page: 1,
        limit: 20
      }
      getAssetList(this.listQuery).then(response => {
        setTimeout(() => {
          this.tableData = response.data
          this.total = response.count
          this.refreshLoading = false
          this.listLoading = false
          this.$message({ showClose: true, message: '刷新成功', type: 'success' })
        }, 500)
      }).catch(error => {
        this.refreshLoading = false
        this.listLoading = false
        this.$message({ showClose: true, message: '刷新失败', type: 'error' })
      })
    },
    watchMultipleSelection(data) {
      this.multipleSelection = data
    },
    watchSearchText(data) {
      this.listQuery = {
        key: data
      }
      getAssetList(this.listQuery).then(response => {
        setTimeout(() => {
          this.tableData = response.data
          this.total = response.count
          this.refreshLoading = false
          this.listLoading = false
          this.$message({ showClose: true, message: '刷新成功', type: 'success' })
        }, 500)
      }).catch(error => {
        this.refreshLoading = false
        this.listLoading = false
        this.$message({ showClose: true, message: '刷新失败', type: 'error' })
      })
    }
  },
}
</script>