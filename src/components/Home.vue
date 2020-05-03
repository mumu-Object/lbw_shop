<template>
  <div class="home_container">
    <el-container style="height:100%;">
      <el-header>
        <el-row type="flex" justify="space-between" style="height:60px;">
          <el-col class="hidden-sm-and-up" :span="8">
            <el-button
              class="left"
              type="info"
              icon="el-icon-s-unfold"
              plain
            ></el-button>
          </el-col>
          <el-col :span="8">
            <img :class="isXYScpt" src="../assets/images/logo2.png" alt="" />
          </el-col>
          <el-col :span="8">
            <el-button
              @click="logoutVisible = true"
              class="right"
              type="info"
              icon="el-icon-caret-right"
              plain
            >
              {{ logoutText }}
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" class="hidden-xs-only">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
    <!-- 退出登录对话框 -->
    <el-dialog
      title="退出登录"
      :visible.sync="logoutVisible"
      :width="isXYS ? '300px' : '30%'"
    >
      <span>确认要退出当前账号吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutVisible = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isXYS: false,
      logoutVisible: false
    }
  },
  created() {
    if (window.innerWidth < 768) {
      this.isXYS = true
    }
  },
  computed: {
    isXYScpt() {
      return this.isXYS ? 'logoXYS' : 'logo'
    },
    logoutText() {
      return this.isXYS ? '退出' : '退出登录'
    }
  },
  mounted() {
    window.onresize = () => {
      if (window.innerWidth < 768) {
        this.isXYS = true
      } else {
        this.isXYS = false
      }
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
      this.$message({
        message: '已退出当前账号',
        type: 'success'
      })
      this.logoutVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  transition: all 0.4s;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.left {
  float: left;
  margin-top: 10px;
}
.right {
  float: right;
  margin-top: 10px;
}
.logoXYS {
  width: 60px;
}
.logo {
  height: 60px;
  width: 200px;
  float: left;
  margin-left: -20px;
}
</style>
