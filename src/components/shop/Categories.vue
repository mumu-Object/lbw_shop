<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="ejectAddCateDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表表格 -->
      <tree-table
        border
        show-index
        :columns="columns"
        :data="cateList"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        :shop-row-hover="false"
      >
        <template slot="isOk" slot-scope="scope">
          <i style="color:red;" class="el-icon-error" v-if="scope.row.cat_deleted"></i>
          <i style="color:green" class="el-icon-success" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == '1'">二级</el-tag>
          <el-tag type="info" v-else>三级</el-tag>
        </template>
        <template slot="edit" slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="ejectModCate(scope.row)"
          ></el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="delCate(scope.row)"></el-button>
        </template>
      </tree-table>
      <!-- /分类列表表格 -->

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCateInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryCateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- /分页 -->
    </el-card>
    <!-- 卡片视图区域 -->

    <!-- 添加分类dialog -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible">
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="click"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectKeys"
            @change="cascaderChange"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="info" @click="resetAddCateDialog('addCateFormRef')">重 置</el-button>
        <el-button type="primary" @click="addCate('addCateFormRef')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加分类dialog -->

    <!-- 添加分类dialog -->
    <el-dialog title="修改分类" :visible.sync="modCateVisible">
      <el-form ref="modCateFormRef" :model="modCateForm" :rules="addCateFormRules" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="modCateForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="modCateVisible = false">取 消</el-button>
        <el-button type="info" @click="modCateFormReset('modCateFormRef')">重 置</el-button>
        <el-button type="primary" @click="modCate('modCateFormRef')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加分类dialog -->
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      columns: [
        {
          width: '200',
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          width: '130',
          label: '操作',
          type: 'template',
          template: 'edit'
        }
      ],
      queryCateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      addCateVisible: false,
      modCateVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, message: '最小长度为 2 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKeys: [],
      modCateForm: {
        id: 0,
        cat_name: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类处理函数
    async getCateList() {
      const cateResult = await this.$axios.get('categories', {
        params: this.queryCateInfo
      })
      if (cateResult.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = cateResult.data.result
      this.total = cateResult.data.total
    },
    // 页数发生改变时处理函数
    handleSizeChange(newSize) {
      this.queryCateInfo.pagesize = newSize
      this.getCateList()
    },
    // 页码发送改变处理函数
    handleCurrentChange(newNum) {
      this.queryCateInfo.pagenum = newNum
      this.getCateList()
    },
    ejectAddCateDialog() {
      this.getParentCateList()
      this.addCateVisible = true
    },
    // 获取父级分类
    async getParentCateList() {
      const parentCateResult = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (parentCateResult.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = parentCateResult.data
    },
    // 级联选择器改变事件
    cascaderChange() {
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类处理函数
    addCate(name) {
      this.$refs[name].validate(async valid => {
        if (!valid) return
        const addCateResult = await this.$axios.post(
          'categories',
          this.addCateForm
        )
        if (addCateResult.meta.status !== 201) {
          return this.$message.error(addCateResult.meta.msg)
        }
        this.getCateList()
        this.addCateVisible = false
      })
    },
    // 重置表单
    resetAddCateDialog(name) {
      this.$refs[name].resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 弹出修改分类dialog
    ejectModCate(cate) {
      this.modCateForm.id = cate.cat_id
      this.modCateForm.cat_name = cate.cat_name
      this.modCateVisible = true
    },
    // 修改分类
    async modCate(name) {
      const modCateResult = await this.$axios.put(
        'categories/' + this.modCateForm.id,
        this.modCateForm
      )
      if (modCateResult.meta.status !== 200) {
        this.modCateVisible = false
        return this.$message.error(modCateResult.meta.msg)
      }
      this.$refs[name].resetFields()
      this.getCateList()
      this.modCateVisible = false
    },
    // 重置修改分类表单
    modCateFormReset(name) {
      this.$refs[name].resetFields()
    },
    delCate(cate) {
      this.$confirm('此操作会永久删除此分类,是否继续？', '删除分类', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const delCateResult = await this.$axios.delete(
            'categories/' + cate.cat_id
          )
          if (delCateResult.meta.status !== 200) {
            return this.$message.error(delCateResult.mate.msg)
          }
          this.getCateList()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
  max-height: 350px;
  overflow-y: scroll;
}
.zk-table::-webkit-scrollbar {
  display: none;
}
.el-cascader {
  width: 100%;
}
</style>
