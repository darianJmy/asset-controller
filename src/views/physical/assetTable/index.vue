<template>
  <div class="app-container">

    <physical-header></physical-header>

    <asset-table :tableData="tableData" :listLoading="listLoading" :listQuery="listQuery"
      @data-updated="handleDataUpdated"></asset-table>

    <pagination v-show="total > 0" :multipleSelection="multipleSelection" :page.sync="listQuery.page"
      :limit.sync="listQuery.limit" @pagination="assetList" />

  </div>
</template>

<script>
import PhysicalHeader from '@/components/PhysicalHeader'
import AssetHeaderButton from '@/components/AssetHeaderButton'
import AssetTable from '@/components/AssetTable'
import Pagination from '@/components/Pagination'
import { getAssetList } from '@/api/physical'
export default {
  components: { PhysicalHeader, AssetHeaderButton, AssetTable, Pagination },
  data() {
    return {
      refreshLoading: false,
      listLoading: false,
      tableData: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
      },
      multipleSelection: [],
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
        this.tableData = response.data
        this.total = response.count
        this.refreshLoading = false
        this.listLoading = false
      })
    },
    handleDataUpdated(data) {
      this.multipleSelection = data
    },
  },
}
</script>