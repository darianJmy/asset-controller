<template>
  <div style="margin-bottom: 10px;">
    <span class="child-wrapper"><refresh-asset @refresh-event="refreshEvent"></refresh-asset></span>
    <span class="child-wrapper"><add-asset @add-event="addEvent"></add-asset></span>
    <span class="child-wrapper"><import-asset @import-event="importEvent"></import-asset></span>
    <span class="child-wrapper"><export-asset></export-asset></span>
    <span class="child-wrapper"><more-action :multipleSelection="multipleSelection"></more-action></span>
    <span class="child-wrapper search">
      <search></search>
    </span>
  </div>
</template>


<script>
import RefreshAsset from './RefreshAsset'
import AddAsset from './AddAsset'
import ImportAsset from './ImportAsset'
import ExportAsset from './ExportAsset'
import MoreAction from './MoreAction'
import Search from './Search'
export default {
  components: { RefreshAsset, AddAsset, ImportAsset, ExportAsset, MoreAction, Search },
  data() {
    return {
      data: null,
      multipleSelection: []
    }
  },
  methods: {
    refreshEvent(data) {
      console.log(data, "1")
    },
    addEvent(data) {
      console.log(data, "2")
    },
    importEvent(data) {
      console.log(data, "3")
    }
  }
}
</script>

<style>
.child-wrapper {
  display: inline-block;
  margin-right: 10px;
  /* 子组件之间的水平间隔 */
}

.search {
  position: absolute;
  width: 320px;
  right: 50px;
}
</style>