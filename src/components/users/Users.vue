<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索与添加用户 -->
      <el-row :gutter="10">
        <el-col :xs="18" :sm="16" :md="14" :lg="12" :xl="10">
          <el-input
            placeholder="请输入内容"
            v-model="usersQueryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            style="margin:0px auto"
            type="primary"
            @click="addUserVisible = true"
          >{{ isXYScpt }}</el-button>
        </el-col>
      </el-row>
      <!-- /搜索与添加用户 -->

      <!-- 用户列表表格 -->
      <el-table
        :data="userList"
        style="width: 100%"
        stripe
        max-height="350"
        border
        :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
        :loading="true"
      >
        <el-table-column type="index" width="30" fixed></el-table-column>
        <el-table-column prop="username" label="用户名" width="150">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p
                style="color:#EEB43C"
                v-if="isLoginUserId === scope.row.id"
              >姓名: {{ scope.row.username + '( 当前用户 )' }}</p>
              <p v-else>姓名: {{ scope.row.username }}</p>
              <p>角色: {{ scope.row.role_name }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag
                  :type="isLoginUserId === scope.row.id ? 'warning' : 'info'"
                  size="medium"
                >{{ scope.row.username }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="ejectModifyUserDialog(scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row)"
              size="mini"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="ejectAssignRoles(scope.row)"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- /用户列表表格 -->

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersQueryInfo.pagenum"
        :page-sizes="[1, 2, , 4, 5]"
        :page-size="usersQueryInfo.pagesize"
        :layout="pageLaout"
        :total="total"
      ></el-pagination>
      <!-- /分页 -->
    </el-card>
    <!-- /卡片 -->

    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="addUserVisible">
      <el-form
        :model="addForm"
        status-icon
        :rules="addUserRules"
        ref="addUserFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.number="addForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addUserVisible = false" type="warning">取消</el-button>
          <el-button @click="resetAddForm('addUserFormRef')" type="info">重置</el-button>
          <el-button
            :loading="addUserButtonLoading"
            type="primary"
            @click="addUser('addUserFormRef')"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /添加用户dialog -->

    <!-- 修改用户dialog -->
    <el-dialog
      title="修改用户"
      :visible.sync="modifyUserVisible"
      @close="resetAddForm('modifyFormRef')"
    >
      <el-form
        :model="modifyForm"
        status-icon
        :rules="addUserRules"
        ref="modifyFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="modifyForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="modifyForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="modifyUserVisible = false" type="warning">取消</el-button>
          <el-button @click="resetAddForm('modifyFormRef')" type="info">重置</el-button>
          <el-button
            :loading="modifyUserButtonLoading"
            type="primary"
            @click="midifyUser('modifyFormRef')"
          >修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /修改用户dialog -->

    <!-- 分配角色dialog -->
    <el-dialog
      @close="setRoleDialogClose"
      title="分配角色"
      :visible.sync="assignRolesVisible"
      width="50%"
    >
      <div>
        <p>当前的用户: {{ roleInfo.username }}</p>
        <p>当前的角色: {{ roleInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole" :loading="assignRoleButtonLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- /分配角色dialog -->
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      assignRolesVisible: false,
      addUserVisible: false,
      modifyUserVisible: false,
      addUserButtonLoading: false,
      modifyUserButtonLoading: false,
      assignRoleButtonLoading: false,
      isXYS: false,
      userList: [],
      roleList: [],
      total: 0,
      isLoginUserId: 0,
      usersQueryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      addForm: {
        username: '',
        password: '',
        emai: '',
        mobile: ''
      },
      modifyForm: {},
      roleInfo: {},
      selectedRoleId: '',
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // console.log(this.$root)
    if (window.innerWidth < 768) {
      this.isXYS = true
    }
    // 执行获取用户列表函数
    this.getUserList()
    // 获取当前登录用户的id
    this.getLoginUserId()
    // 获取角色列表
    this.getRoleList()
  },
  methods: {
    // 获取菜单列表
    async getUserList() {
      const data = await this.$axios.get('/users', {
        params: this.usersQueryInfo
      })
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = data.data.users
      this.total = data.data.total
      console.log(this.userList)
    },
    // 获取登录用户的id
    getLoginUserId() {
      this.isLoginUserId =
        window.sessionStorage.getItem('lbw_shop_login-user_id') - 0
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.usersQueryInfo.pagesize = newSize
      this.getUserList()
      console.log(newSize)
    },
    // 监听pagenum改变事件
    handleCurrentChange(newPage) {
      this.usersQueryInfo.pagenum = newPage
      this.getUserList()
    },
    // 重置表单
    resetAddForm(name) {
      this.$refs[name].resetFields()
    },
    // 添加用户处理函数
    addUser(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.addUserButtonLoading = true
          const addUserResult = await this.$axios.post('users', this.addForm)
          if (addUserResult.meta.status !== 201) {
            this.addUserButtonLoading = false
            this.addForm.username = ''
            return this.$message.error(addUserResult.meta.msg)
          }
          this.getUserList()
          this.addUserVisible = false
          this.$message.success(addUserResult.meta.msg)
          this.resetAddForm('addUserFormRef')
        }
        this.addUserButtonLoading = false
      })
    },
    // 删除用户处理函数
    deleteUser(user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const deleteUserResult = await this.$axios.delete('users/' + user.id)
          if (deleteUserResult.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改用户状态
    async userStateChange(user) {
      const changeUserStateReslut = await this.$axios.put(
        'users/' + user.id + '/state/' + user.mg_state
      )
      if (changeUserStateReslut.meta.status !== 200) {
        this.$message.error('设置状态失败')
      } else {
        this.$message.success(changeUserStateReslut.meta.msg)
      }
    },
    // 弹出修改用户dialog
    ejectModifyUserDialog(user) {
      this.modifyForm = user
      this.modifyUserVisible = true
    },
    // 修改用户信息处理函数
    midifyUser(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.modifyUserButtonLoading = true
          const modifyUserResult = await this.$axios.put(
            'users/' + this.modifyForm.id,
            {
              email: this.modifyForm.email,
              mobile: this.modifyForm.mobile
            }
          )
          console.log(modifyUserResult)
          if (modifyUserResult.meta.status !== 200) {
            this.$message.error(modifyUserResult.meta.msg)
            this.modifyUserButtonLoading = false
            return
          }
          this.getUserList()
          this.modifyUserVisible = false
          this.modifyUserButtonLoading = false
          this.$message.success(modifyUserResult.meta.msg)
        }
      })
    },
    // 修改角色列表
    ejectAssignRoles(user) {
      this.roleInfo = user
      this.assignRolesVisible = true
    },
    // 获取角色列表函数
    async getRoleList() {
      const rolesResult = await this.$axios.get('roles')
      if (rolesResult.meta.status !== 200) {
        return this.$message.error(rolesResult.meta.msg)
      }
      this.roleList = rolesResult.data
      console.log(this.roleList)
    },
    // 修改角色
    async saveRole() {
      if (this.selectedRoleId === '') return this.$message.info('请选择角色')
      this.assignRoleButtonLoading = true
      const roleData = await this.$axios.put(`users/${this.roleInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (roleData.meta.status !== 200) {
        return this.$message.error(roleData.meta.msg)
      }
      this.$message.success(roleData.meta.msg)
      this.getUserList()
      this.assignRolesVisible = false
      this.assignRoleButtonLoading = false
    },
    setRoleDialogClose() {
      this.selectedRoleId = ''
      this.roleInfo = {}
    }
  },
  computed: {
    isXYScpt() {
      return this.isXYS ? '添加' : '添加用户'
    },
    // 监听分页layout
    pageLaout() {
      return this.isXYS
        ? 'prev, pager, next, jumper'
        : 'total, sizes, prev, pager, next, jumper'
    }
  }
}
</script>

<style lang="less" scoped></style>
