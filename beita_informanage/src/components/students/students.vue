<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 输入框和添加按钮 -->
      <!-- 这里已经将一行全部占满了 所以要换另外一种方法 ===> 使用element-ui提供的栅格布局 实现 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="paramsInfo.query"
            @clear="getStudentsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getStudentsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addStuDialog = true"
            >添加学生</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table stripe border :data="studentsList">
        <!-- 添加索引页 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="num" label="学号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="class" label="班级"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="teacher" label="辅导员"></el-table-column>
        <el-table-column prop="duty" label="系别"></el-table-column>
        <!-- 操作按钮 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editStu(scope.row.num)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="del(scope.row.num)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加学生的对话框 -->
    <AddStudent
      :show-dialog.sync="addStuDialog"
      @addStudent="getStudentsList"
    ></AddStudent>
    <!-- 编辑用户的对话框 -->
    <EditStudent
      :show-dialog.sync="editStuDialog"
      ref="editStudentRef"
      @editStudent="getStudentsList"
    ></EditStudent>
  </div>
</template>

<script>
// 引入添加学生的组件
import AddStudent from "./components/addStudent.vue";
import EditStudent from "./components/editStudent.vue";
export default {
  components: {
    AddStudent,
    EditStudent,
  },

  data() {
    return {
      studentsList: [],
      paramsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      addStuDialog: false,
      editStuDialog: false,
    };
  },
  created() {
    this.getStudentsList();
  },

  methods: {
    async getStudentsList() {
      const { data } = await this.$http.get("/students/student", {
        params: this.paramsInfo,
      });
      // console.log(data);
      this.studentsList = data;
      this.total = data[0].count;
    },
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize;
      this.getStudentsList();
    },
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage;
      this.getStudentsList();
    },
    async del(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该学生, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除！");
      }
      await this.$http.get(`/students/del/${id}`);
      this.$message.success("删除该学生成功！");
      this.getStudentsList();
    },
    editStu(id) {
      /**
       * 打开编辑学生的对话框
       * 调用接口,将数据渲染到表单对应的值上
       */
      this.editStuDialog = true;
      this.$refs.editStudentRef.editStudent(id);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>