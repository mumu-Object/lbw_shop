<template>
  <div class="loginBox">
    <section class="logo"></section>
    <el-form
      :model="loginForm"
      :rules="loginFormrules"
      ref="loginFormRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label-width="0" prop="username">
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="warning" @click="resetLoginForm">重置</el-button>
        <el-button type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度在6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.loginBox {
  width: 450px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
  .logo {
    width: 150px;
    height: 150px;
    background-color: red;
    position: absolute;
    left: 50%;
    top: -75px;
    transform: translate(-50%, 0);
    border-radius: 50%;
    border: 10px solid #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: url('../assets/logo.png') no-repeat;
    background-size: 100% 100%;
    background-color: #eee;
  }
  .el-form {
    margin: 120px 20px 0 20px;
    .el-button {
      float: right;
      margin-left: 20px;
    }
  }
}
@media screen and (max-width: 540px) {
  .loginBox {
    width: 350px;
  }
}
</style>
