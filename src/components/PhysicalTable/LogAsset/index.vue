<template>
  <div>
    <el-popover placement="top-start" width="200" trigger="hover" :content="log">
      <el-button slot="reference" type="text" size="small">日志</el-button>
    </el-popover>
  </div>
</template>


<script>
export default {
  data() {
    return {}
  },
  props: {
    log: String
  }
}
</script>