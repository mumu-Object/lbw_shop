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
          <el-button type="primary" @click="addRoleVisiblle = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table
        :data="roleList"
        style="width: 100%"
        max-height="380"
        border
        stripe
        :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
      >
        <el-table-column type="expand" label="展开" width="50">
          <template slot-scope="scope">
            <h1 style="color: #F56C6C;" v-if="scope.row.children.length === 0">
              <i class="el-icon-warning"></i>
              <span>没有权限!</span>
            </h1>
            <!-- /一级权限 -->
            <el-row
              v-else
              :class="['rightsBDTop',i1 == 0 ? 'rightsBDBottom' : '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- /二级权限 -->
                <el-row
                  :class="['rightsBDTop',i2 == 0 ? 'rightsBDBottom' : '','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" class="roleListTagBox">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="info"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50" fixed></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" min-width="300"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="ejectModRoleDialog(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row)"
            ></el-button>
            <el-tooltip :enterable="false" content="分配角色权限" placement="top">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="ejectAssignRolesRightsDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- /角色列表 -->
    </el-card>
    <!-- /卡片试图 -->

    <!-- 添加角色dialog -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisiblle" :width="isXYS ? '300' : '50%'">
      <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="addRoleFormRules" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="addRoleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="addRoleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addRoleVisiblle = false">取 消</el-button>
        <el-button type="info" @click="resetFormRules('addRoleFormRef')">重置</el-button>
        <el-button type="primary" @click="addRole" :loading="addRoleBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加角色dialog -->

    <!-- 修改角色dialog -->
    <el-dialog title="修改角色" :visible.sync="modRoleVisiblle" :width="isXYS ? '300' : '50%'">
      <el-form ref="modRoleFormRef" :model="modRoleForm" :rules="addRoleFormRules" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="modRoleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="modRoleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="modRoleVisiblle = false">取 消</el-button>
        <el-button type="info" @click="resetFormRules('modRoleFormRef')">重置</el-button>
        <el-button type="primary" @click="modRole" :loading="modRoleBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /修改角色dialog -->

    <!-- 分配角色权限dialog -->
    <el-dialog @close="treeDefaultKeys = []" title="分配角色" :visible.sync="assgnRoleRightsVisible">
      <el-tree
        :default-expand-all="isXYS ? false : true"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="treeDefaultKeys"
        ref="treeRef"
      ></el-tree>
      <div slot="footer">
        <el-button @click="assgnRoleRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="assgnRoleRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /分配角色权限dialog -->
  </div>
</template>
<script>
export default {
  name: 'Roles',
  data() {
    return {
      roleList: [],
      rightsList: [],
      treeDefaultKeys: [],
      addRoleVisiblle: false,
      modRoleVisiblle: false,
      assgnRoleRightsVisible: false,
      isXYS: false,
      addRoleBtnLoading: false,
      modRoleBtnLoading: false,
      roleId: 0,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      modRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        roleDesc: [{ min: 2, message: '最小长度为 2 个字符', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取角色列表
    if (window.innerWidth < 768) {
      this.isXYS = true
    } else {
      this.isXYS = false
    }
    this.getRoleList()
    this.getRightList()
  },
  methods: {
    // 获取角色列表处理函数
    async getRoleList() {
      const roleResult = await this.$axios.get('roles')
      if (roleResult.meta.status !== 200) {
        return this.$message.error(roleResult.meta.msg)
      }
      this.roleList = roleResult.data
      console.log(this.roleList)
    },
    // 添加角色处理函数
    async addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (valid) {
          this.addRoleBtnLoading = true
          const roleResult = await this.$axios.post('roles', this.addRoleForm)
          if (roleResult.meta.status !== 201) {
            this.addRoleBtnLoading = false
            return this.$message.error('添加角色失败!')
          }
          this.getRoleList()
          this.$message.success('添加角色成功!')
          this.addRoleVisiblle = false
          this.addRoleBtnLoading = false
          this.$refs.addRoleFormRef.resetFields()
        }
      })
    },
    // 弹出修改角色对话框处理函数
    ejectModRoleDialog(Role) {
      this.modRoleForm = Role
      this.modRoleVisiblle = true
    },
    // 修改角色处理函数
    modRole() {
      this.$refs.modRoleFormRef.validate(async valid => {
        if (valid) {
          this.modRoleBtnLoading = true
          const modRoleResult = await this.$axios.put(
            'roles/' + this.modRoleForm.id,
            this.modRoleForm
          )
          if (modRoleResult.meta.status !== 200) {
            this.modRoleBtnLoading = false
            return this.$message.error('更改角色失败')
          }
          this.getRoleList()
          this.$message.success('更改角色成功')
          this.modRoleVisiblle = false
          this.modRoleBtnLoading = false
        }
      })
    },
    // 删除角色处理函数
    deleteRole(role) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const deleteroleResult = await this.$axios.delete('roles/' + role.id)
          if (deleteroleResult.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          }
          this.$message.success('删除角色成功')
          this.getRoleList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 重置表单处理函数
    resetFormRules(name) {
      this.$refs[name].resetFields()
    },
    // 删除角色权限处理函数
    removeRightById(role, rightId) {
      this.$confirm('此操作会永久删除角色权限,是否继续', '删除权限', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const delRightResult = await this.$axios.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (delRightResult.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          role.children = delRightResult.data
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 弹出分配角色对话框
    ejectAssignRolesRightsDialog(role) {
      this.roleId = role.id
      console.log(this.roleId)
      this.getRightList()
      this.getTreeDefaultKeys(role, this.treeDefaultKeys)
      this.assgnRoleRightsVisible = true
    },
    // 获取所有权限数据
    async getRightList() {
      const rightsResult = await this.$axios.get('rights/tree')
      if (rightsResult.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightsList = rightsResult.data
    },
    // 获取三级权限id
    getTreeDefaultKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getTreeDefaultKeys(item, arr)
      })
    },
    // 分配角色权限处理函数
    async assgnRoleRights() {
      // 获取半选和全选的key
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      const idStr = keys.join(',')
      const assgnRoleResult = await this.$axios.post(
        'roles/' + this.roleId + '/rights',
        { rids: idStr }
      )
      if (assgnRoleResult.meta.status !== 200) {
        return this.$message.error('分配角色权限失败')
      }
      this.getRoleList()
      this.$message.success('分配角色权限成功')
      this.assgnRoleRightsVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-table td,
.el-table th {
  text-align: left;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
