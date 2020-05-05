<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- /卡片试图 -->
  </div>
</template>
<script>
export default {
  name: 'Roles'
}
</script>
<style lang="less" scoped>
</style>
