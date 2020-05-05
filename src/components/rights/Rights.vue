<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table
        :data="rightList"
        style="width: 100%"
        border
        stripe
        max-height="425"
        :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
        :loading="true"
      >
        <el-table-column type="index" label="#" width="40" fixed></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="150"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /卡片视图 -->
  </div>
</template>
<script>
export default {
  name: 'Rights',
  data() {
    return {
      rightList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      const rightsResult = await this.$axios.get('rights/list')
      if (rightsResult.meta.status !== 200) {
        return this.$message.error(rightsResult.meta.msg)
      }
      this.rightList = rightsResult.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
