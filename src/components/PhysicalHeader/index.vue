<template>
  <div style="margin-bottom: 10px;">
    <span class="child-wrapper"><refresh-asset :refreshLoading="refreshLoading" @taskCompleted="taskCompleted" /></span>
    <span class="child-wrapper"><add-asset @taskCompleted="taskCompleted" /></span>
    <span class="child-wrapper"><import-asset @taskCompleted="taskCompleted" /></span>
    <span class="child-wrapper"><export-asset /></span>
    <span class="child-wrapper"><more-action :multipleSelection="multipleSelection"
        @taskCompleted="taskCompleted" /></span>
    <span class="child-wrapper search">
      <search @searchText="watchSearchText" />
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
    }
  },
  props: {
    refreshLoading: Boolean,
    multipleSelection: Array,
    taskCompleted: {
      type: Function,
      required: true
    }
  },
  methods: {
    watchSearchText(data) {
      this.$emit('searchText', data);
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