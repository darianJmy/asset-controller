<template>
  <div class="app-container">
    <asset-header-button :tableData="tableData" @refresh-assets="assetList" :refreshLoading="refreshLoading"
      :multipleSelection="multipleSelection"></asset-header-button>

    <asset-table :tableData="tableData" :listLoading="listLoading" :listQuery="listQuery"
      @data-updated="handleDataUpdated"></asset-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="assetList" />

  </div>
</template>

<script>
import AssetHeaderButton from '@/components/AssetHeaderButton'
import AssetTable from '@/components/AssetTable'
import Pagination from '@/components/Pagination'
import { getAssetList } from '@/api/physical'
export default {
  components: { AssetHeaderButton, AssetTable, Pagination },
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
        this.tableData = response.data.data
        this.total = response.data.total
        this.refreshLoading = false
        this.listLoading = false
      })
    },
    handleDataUpdated(data) {
      this.multipleSelection = data
    }
  },
}
</script>