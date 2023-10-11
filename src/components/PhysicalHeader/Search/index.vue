<template>
  <div>
    <!-- 搜索 -->
    <el-input size="small" v-model="searchText" placeholder="模糊搜索" @keyup.native.enter="search">
      <template #append>
        <el-button size="small" icon="el-icon-search" @click="search">
          搜索
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script>

export default {
  data() {
    return {
      searchText: ''
    }
  },

  methods: {
    search() {
      this.$emit('searchText', this.searchText);
    }
  }
}
</script>