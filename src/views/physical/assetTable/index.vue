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
import { getPhysicalList } from '@/api/physical'
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
        host: undefined,
        sort: '+status'
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
      getPhysicalList(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.refreshLoading = false
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleDataUpdated(data) {
      this.multipleSelection = data
    }
  },
}

</script>