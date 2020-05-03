<template>
  <div class="home_container">
    <el-container style="height:100%;">
      <el-header>
        <el-row type="flex" justify="space-between" style="height:60px;">
          <!-- 点击展开侧边栏 -->
          <el-col class="hidden-sm-and-up" :span="8">
            <el-button
              @click="openaside"
              class="left"
              type="info"
              :icon="isOpen ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
              plain
            ></el-button>
          </el-col>
          <!-- logo -->
          <el-col :span="8">
            <img :class="isXYScpt" src="../assets/images/logo2.png" alt="" />
          </el-col>
          <el-col class="hidden-sm-and-down logo-text" :span="8">
            <h1>电商后台管理系统</h1>
          </el-col>
          <!-- 退出登录按钮 -->
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
        <!-- 侧边栏 -->
        <el-aside
          :width="isCollapse ? '65px' : '200px'"
          class="hidden-xs-only"
          :class="{ open: isOpen }"
        >
          <!-- 侧边栏菜单 -->
          <el-menu
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            model="vertical"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            :default-active="menuSelectedIndex"
          >
            <section
              @click="handleCollapse"
              style="height:30px;border-bottom:1px solid #eee;line-height:30px"
            >
              <i class="el-icon-s-operation" style="color:#ffd04b"></i>
            </section>
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="(item, index) in menuList"
              :key="item.id"
              style="text-align: left;"
            >
              <template slot="title">
                <i :class="menuIconList[index]"></i>
                <span>
                  {{ item.authName }}
                </span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                v-for="menuItem in item.children"
                :index="'/' + menuItem.path"
                :key="menuItem.id"
                @click="openMenuIndex('/' + menuItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-s-grid"></i>
                  <span>{{ menuItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
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
      // 判断是否是响应式
      isXYS: false,
      // 退出登录dialog控制
      logoutVisible: false,
      isOpen: false,
      isCollapse: false,
      menuList: [],
      menuIconList: [
        'el-icon-user',
        'el-icon-box',
        'el-icon-shopping-bag-1',
        'el-icon-tickets',
        'el-icon-pie-chart'
      ],
      menuSelectedIndex: ''
    }
  },
  async created() {
    if (window.innerWidth < 768) {
      this.isXYS = true
    }
    const menus = await this.$axios.get('/menus')
    this.menuList = menus.data
    this.menuSelectedIndex = window.sessionStorage.getItem('menuSelectedIndex')
    console.log(this.menuSelectedIndex)
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
        if (this.isOpen) {
          this.isOpen = false
        }
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
    },
    openaside() {
      this.isOpen = !this.isOpen
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    openMenuIndex(i) {
      window.sessionStorage.setItem('menuSelectedIndex', i)
      this.menuSelectedIndex = window.sessionStorage.getItem(
        'menuSelectedIndex'
      )
      console.log(this.menuSelectedIndex)
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
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
  transition: all 0.4s;
}

.el-main {
  background-color: #e9eef3; /*#e9eef3*/
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
.open {
  display: block !important;
  position: absolute;
  height: calc(100% - 60px);
  left: 0px !important;
  top: 60px !important;
  width: 200px;
}
.logo-text h1 {
  line-height: 15px;
  color: #fff;
}
.el-menu {
  border: none;
}
</style>
