<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 输入框和添加按钮 -->
      <!-- 这里已经将一行全部占满了 所以要换另外一种方法 ===> 使用element-ui提供的栅格布局 实现 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="paramsInfo.query"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" stripe border>
        <!-- 添加索引页 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="duty" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 根据状态值来设置开关的情况 -->
          <!-- 作用域插槽 -->
          <!-- scope.row可以获得这一行所有的信息 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
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
                @click="editUser(scope.row.id)"
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
                @click="delUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <AddUser :show-dialog.sync="addUserDialog" @addUser="getUserList"></AddUser>
    <!-- 编辑用户对话框 -->
    <EditUser
      :show-dialog.sync="editUserDialog"
      ref="editUserRef"
      @editUser="getUserList"
    ></EditUser>
  </div>
</template>

<script>
import AddUser from "./components/addUser.vue";
import EditUser from "./components/editUser.vue";
export default {
  components: {
    AddUser,
    EditUser,
  },

  data() {
    return {
      userlist: [],
      addUserDialog: false,
      editUserDialog: false,
      total: 0,
      // 发送请求用户请求时携带的数据
      paramsInfo: {
        // 查询参数
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
    };
  },

  created() {
    this.getUserList();
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const { data } = await this.$http.get("/users/user", {
        params: this.paramsInfo,
      });
      // console.log(data);
      this.userlist = data;
      this.total = data[0].count;
    },
    // 更改用户状态
    userStateChange(newState) {
      // console.log(newState);
      this.$http
        .get(`/users/state/${newState.id}/${newState.state}`)
        .then((response) => {
          let res = response.data;
          if (res.status != 200) {
            // newState.state = !newState.state;
            return this.$message.error("更新状态失败！");
          } else {
            this.$message.success("更新状态成功！");
            // this.getUserList()
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 根据id删除对应的用户
    async delUser(id) {
      // 01.弹框出来询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      /*02.如果用户确认了删除，则返回值为字符串 confirm,
           如果用户取消了删除, 则返回字符串  cancel
      */
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除！");
      }
      // 03.执行删除操作
      this.$http.get(`/users/del/${id}`).then((response) => {
        let res = response.data;
        // 03-1.判断是否删除成功
        if (res.status != 200) {
          this.$message.error("删除用户失败！");
        }
        this.$message.success("删除用户成功！");
        // 03-2-2、更新用户列表
        this.getUserList();
      });
    },
    // 根据id编辑对应的用户
    editUser(id) {
      this.editUserDialog = true;
      // 父组件调用子组件上的方法
      this.$refs.editUserRef.editUser(id);
    },
    // 分页====>pagesize改变
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize;
      this.getUserList();
    },
    // 分页====>pagenum改变
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage;
      this.getUserList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>