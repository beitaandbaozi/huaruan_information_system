<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>师资队伍</el-breadcrumb-item>
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
            @clear="getTeachersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getTeachersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addTeacherDialog = true"
            >添加教师</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table stripe border :data="teachersList">
        <!-- 添加索引页 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <div class="headImg">
              <img
                v-if="scope.row.picURL.indexOf('http') != -1"
                :src="scope.row.picURL"
                alt=""
              />
              <img v-else :src="httpRequestUrl + scope.row.picURL" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="summary" label="职位"></el-table-column>
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
                size="medium"
                @click="editTeacher(scope.row.id)"
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
                size="medium"
                @click="delTeacher(scope.row.id)"
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

    <!-- 编辑用户的对话框 -->
    <EditTeacher
      :show-dialog.sync="editTeacherDialog"
      ref="editTeacherRef"
      @editTeacher="getTeachersList"
    ></EditTeacher>
  </div>
</template>

<script>
// 引入编辑老师的组件
import EditTeacher from "./components/editTeacher.vue";

export default {
  components: {
    EditTeacher,
  },

  data() {
    return {
      teachersList: [],
      paramsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      editTeacherDialog: false,
      httpRequestUrl: "http://localhost:3000/",
    };
  },
  created() {
    this.getTeachersList();
  },

  methods: {
    async getTeachersList() {
      const { data } = await this.$http.get("/teachers/teacher", {
        params: this.paramsInfo,
      });
      // console.log(data);
      this.teachersList = data;
      this.total = data[0].count;
    },
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize;
      this.getTeachersList();
    },
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage;
      this.getTeachersList();
    },

    async delTeacher(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该教师, 是否继续?",
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
      await this.$http.get(`/teachers/del/${id}`);
      this.$message.success("删除该教师成功！");
      this.getTeachersList();
    },
    editTeacher(id) {
      /**
       * 打开编辑学生的对话框
       * 调用接口,将数据渲染到表单对应的值上
       */
      this.editTeacherDialog = true;
      this.$refs.editTeacherRef.editTeacher(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.headImg {
  float: left;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #999;
  img {
    width: 100%;
    height: 100%;
    border-radius: 7%;
  }
}

.el-button {
  margin-right: 20px;
}
</style>