<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>选课管理</el-breadcrumb-item>
      <el-breadcrumb-item>开设课程</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 输入框和添加按钮 -->
      <!-- 这里已经将一行全部占满了 所以要换另外一种方法 ===> 使用element-ui提供的栅格布局 实现 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入课程代码"
            clearable
            v-model="paramsInfo.query"
            @clear="getClassList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getClassList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加课程</el-button>
        </el-col>
      </el-row>
      <!-- 课程信息区域 -->
      <el-table stripe border :data="classList">
        <!-- 添加索引页 -->
        <el-table-column prop="c_id" label="课程代码"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="credit" label="学分"></el-table-column>
        <el-table-column prop="assess" label="考察方式"></el-table-column>
        <el-table-column prop="duty" label="系别"></el-table-column>
        <el-table-column prop="offer" label="上课方式"></el-table-column>
        <el-table-column prop="intro" label="简介"  width="500"></el-table-column>
        <!-- 操作按钮 -->
        <el-table-column label="操作" fixed="right">
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
                @click="delClass(scope.row.c_id)"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      classList: [],
      paramsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
    };
  },
  created() {
    this.getClassList();
  },

  methods: {
    async getClassList() {
      const { data } = await this.$http.get("/class/classes", {
        params: this.paramsInfo,
      });
      // console.log(data);
      this.classList = data;
      this.total = data[0].count;
    },
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize;
      this.getClassList();
    },
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage;
      this.getClassList();
    },
    async delClass(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该课程, 是否继续?",
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
      // id = id.trim();
      await this.$http.get(`/class/del/${id}`);
      this.$message.success("删除课程成功！");
      this.getClassList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>