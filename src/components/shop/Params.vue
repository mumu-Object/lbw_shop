<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->

    <!-- 卡片 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 级联选择器区域 -->
      <label>
        <span v-if="!isXYS" style="font-size: 16px;margin-right:10px;">选择商品分类:</span>
        <el-cascader
          placeholder="请选择商品分类"
          v-model="selectKeys"
          :options="cateList"
          :props="{ expandTrigger: 'hover',label:'cat_name',value: 'cat_id' }"
          @change="handleChange"
        ></el-cascader>
      </label>
      <!-- /级联选择器区域 -->

      <!-- 标签页 -->
      <el-tabs disabled v-model="activeName" @tab-click="tagHandleClick">
        <!-- 动态参数 -->
        <el-tab-pane lazy label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                :disabled="selectKeys.length > 0 ? false : true"
                type="primary"
                size="mini"
                @click="addParamsOrAttrVisible = true"
              >添加参数</el-button>
            </el-col>
          </el-row>
          <el-table stripe border :data="cateParamList" style="width: 100%" max-height="250">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="shopInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" min-width="180"></el-table-column>
            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="ejectModMaryAttrDialog(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="mini"
                  @click="delMaryAttr(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- /动态参数 -->

        <!-- 静态属性区域 -->
        <el-tab-pane lazy label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                :disabled="selectKeys.length > 0 ? false : true"
                type="primary"
                size="mini"
                @click="addParamsOrAttrVisible = true"
              >添加属性</el-button>
            </el-col>
          </el-row>
          <el-table stripe border :data="cateParamList" style="width: 100%" max-height="250">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="shopInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" min-width="180"></el-table-column>
            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="ejectModMaryAttrDialog(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="mini"
                  @click="delMaryAttr(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性区域 -->
      </el-tabs>
      <!-- /标签页 -->
    </el-card>
    <!-- /卡片 -->

    <!-- 添加参数或者属性dialog -->
    <el-dialog
      :title="activeName == 'only' ? '添加属性' : '添加参数'"
      :visible.sync="addParamsOrAttrVisible"
    >
      <el-form
        ref="addParamsOrAttrFormRef"
        :model="addParamsOrAttrForm"
        :rules="addParamsOrAttrFormRules"
        status-icon
      >
        <el-form-item prop="attr_name" :label="activeName == 'only' ? '静态属性' : '动态参数'">
          <el-input v-model.trim="addParamsOrAttrForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;justify-content: flex-end;">
          <el-button @click="addParamsOrAttrVisible = false">取 消</el-button>
          <el-button type="info" @click="resetForm('addParamsOrAttrFormRef')">重 置</el-button>
          <el-button
            :loading="addParamsOrAttrloading"
            type="primary"
            @click="addParamsOrAttr('addParamsOrAttrFormRef')"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /添加参数或者属性dialog -->

    <!-- 修改参数或者属性dialog -->
    <el-dialog
      :title="activeName == 'only' ? '修改属性' : '修改参数'"
      :visible.sync="modParamsOrAttrVisible"
    >
      <el-form
        ref="modParamsOrAttrFormRef"
        :model="modParamsOrAttrForm"
        :rules="addParamsOrAttrFormRules"
        status-icon
      >
        <el-form-item prop="attr_name" :label="activeName == 'only' ? '静态属性' : '动态参数'">
          <el-input v-model.trim="modParamsOrAttrForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;justify-content: flex-end;">
          <el-button @click="modParamsOrAttrVisible = false">取 消</el-button>
          <el-button type="info" @click="resetForm('modParamsOrAttrFormRef')">重 置</el-button>
          <el-button :loading="modParamsOrAttrloading" type="primary" @click="modParamsOrAttr">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /修改参数或者属性dialog -->
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      cateList: [],
      selectKeys: [],
      cateParamList: [],
      activeName: 'many',
      isXYS: false,
      addParamsOrAttrVisible: false,
      modParamsOrAttrVisible: false,
      addParamsOrAttrloading: false,
      modParamsOrAttrloading: false,
      addParamsOrAttrForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      modParamsOrAttrForm: {},
      addParamsOrAttrFormRules: {
        attr_name: [
          { required: true, message: '此字段不能为空!', trigger: 'blur' },
          { min: 2, message: '此字段最小长度为 2 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (window.innerWidth < 768) {
      this.isXYS = true
    } else {
      this.isXYS = false
    }
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表处理函数
    async getCateList() {
      const cateResult = await this.$axios.get('categories')
      if (cateResult.meta.status !== 200) {
        return this.$message.error(cateResult.meta.msg)
      }
      this.cateList = cateResult.data
    },
    // 级联选择器改变事件处理函数
    handleChange() {
      this.cascaderAndTabsChange()
    },
    // 标签页点击事件处理函数
    tagHandleClick() {
      this.cascaderAndTabsChange()
    },
    // 获取分类参数处理函数
    async getCateParams(id, sel) {
      const cateParamsResult = await this.$axios.get(
        'categories/' + id + '/attributes',
        { params: { sel: sel } }
      )
      if (cateParamsResult.meta.status !== 200) {
        return this.$message.error(cateParamsResult.mata.msg)
      }
      cateParamsResult.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      this.cateParamList = cateParamsResult.data
      console.log(this.cateParamList)
    },
    // 级联选择框发生改变或标签页发生改变处理函数
    cascaderAndTabsChange() {
      if (this.selectKeys.length < 3) {
        this.selectKeys = []
        this.cateParamList = []
        return
      }
      this.getCateParams(
        this.selectKeys[this.selectKeys.length - 1],
        this.activeName
      )
    },
    // 重置表单
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    // 添加动态参数或者静态属性处理函数
    addParamsOrAttr(name) {
      if (this.selectKeys.length < 3) return
      this.$refs[name].validate(async valid => {
        if (!valid) return
        const selectCateId = this.selectKeys[this.selectKeys.length - 1]
        this.addParamsOrAttrForm.attr_sel = this.activeName
        this.addParamsOrAttrloading = true
        const addParamsOrAttrResult = await this.$axios.post(
          'categories/' + selectCateId + '/attributes',
          this.addParamsOrAttrForm
        )
        if (addParamsOrAttrResult.meta.status !== 201) {
          return this.$message.error(addParamsOrAttrResult.meta.msg)
        }
        this.getCateParams(selectCateId, this.addParamsOrAttrForm.attr_sel)
        this.addParamsOrAttrloading = false
        this.addParamsOrAttrVisible = false
        this.addParamsOrAttrForm.attr_name = ''
        this.$message.success(addParamsOrAttrResult.meta.msg)
        console.log(addParamsOrAttrResult)
      })
    },
    // 弹出修改对话框
    ejectModMaryAttrDialog(attrParms) {
      this.modParamsOrAttrForm = attrParms
      this.modParamsOrAttrVisible = true
      console.log(this.modParamsOrAttrForm)
    },
    // 更新参数或属性处理函数
    async modParamsOrAttr(name) {
      const cateId = this.selectKeys[this.selectKeys.length - 1]
      const attrId = this.modParamsOrAttrForm.attr_id
      const modParamsOrAttrResult = await this.$axios.put(
        'categories/' + cateId + '/attributes/' + attrId,
        {
          attr_name: this.modParamsOrAttrForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.modParamsOrAttrForm.attr_vals
        }
      )
      if (modParamsOrAttrResult.meta.status !== 200) {
        return this.$message.error(modParamsOrAttrResult.meta.msg)
      }
      this.$message.success('更新成功')
      this.modParamsOrAttrForm = modParamsOrAttrResult
      this.modParamsOrAttrVisible = false
    },
    // 删除参数或属性处理函数
    delMaryAttr(data) {
      console.log(data)
      const sel = this.activeName === 'only' ? '属性' : '参数'
      const cateId = this.selectKeys[this.selectKeys.length - 1]
      this.$confirm('此操作将永久删除该' + sel + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const delResult = await this.$axios.delete(
            'categories/' + cateId + '/attributes/' + data.attr_id
          )
          if (delResult.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          const index = this.cateParamList.findIndex(item => {
            return item.attr_id === data.attr_id
          })
          this.cateParamList.splice(index, 1)
          this.$message.success('删除成功！')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除标签
    async handleClose(row, tag) {
      const index = row.attr_vals.findIndex(item => {
        return item === tag
      })
      row.attr_vals.splice(index, 1)
      const vals = row.attr_vals.join(' ')
      const cateId = this.selectKeys[this.selectKeys.length - 1]
      const modAttrResult = await this.$axios.put(
        'categories/' + cateId + '/attributes/' + row.attr_id,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: vals
        }
      )
      if (modAttrResult.meta.status !== 200) {
        return this.$message.error('删除标签失败')
      }
    },
    shopInput(row) {
      row.inputVisible = true
      console.log(row)
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 发送请求
    async handleInputConfirm(row) {
      if (row.inputValue === '') {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)
      const vals = row.attr_vals.join(' ')
      const cateId = this.selectKeys[this.selectKeys.length - 1]
      const modAttrResult = await this.$axios.put(
        'categories/' + cateId + '/attributes/' + row.attr_id,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: vals
        }
      )
      console.log(modAttrResult)
      if (modAttrResult.meta.status !== 200) {
        return this.$message.error('添加标签失败')
      }
      row.inputVisible = false
      row.inputValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
</style>
