<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/manage.png" alt="logo" />
        <span>电子系信息管理后台</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_menu" @click="toggle_menu">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级导航 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级导航模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <!-- Vue绑定属性时，记得加冒号！ -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <!-- 二级导航模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    //如果要操作data中的数据，或使用methods中的函数，最早，只能在created函数中执行
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  data() {
    return {
      // 左侧菜单列表
      menuList: [
        {
          authName: "用户管理",
          id: 125,
          order: 1,
          path: "users",
          children: [
            { authName: "用户列表", id: 110, order: null, path: "users" },
          ],
        },
        {
          authName: "学生管理",
          id: 103,
          order: 1,
          path: "students",
          children: [
            { authName: "学生列表", id: 111, order: null, path: "students" },
          ],
        },
        {
          authName: "教师管理",
          id: 101,
          order: 1,
          path: "teachers",
          children: [
            { authName: "师资队伍", id: 104, order: 1, path: "teachers" },
          ],
        },
        {
          authName: "选课管理",
          id: 102,
          order: 1,
          path: "class",
          children: [
            { authName: "开设课程", id: 107, order: null, path: "class" },
          ],
        },
         {
          authName: "信息管理",
          id: 145,
          order: 1,
          path: "message",
          children: [
            { authName: "发布公告", id: 107, order: null, path: "message" },
          ],
        },
      ],
      // 图标对象
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 折叠开关
      isCollapse: true,
      // 被激活的路径
      activePath: "",
    };
  },
  methods: {
    logout() {
      // 清空token
       localStorage.removeItem('Authorization');
      // 跳转到登录页面
      this.$router.push("/login");
    },

    // 切换左边导航
    toggle_menu() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // 将获取的链接路径保存在sessionStorage中
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  color: #fff;
  font-size: 20px;
  // 为子容器div布局
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0px;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
// 折叠左侧导航
.toggle_menu {
  color: #fff;
  text-align: center;
  line-height: 24px;
  cursor: pointer;
  font-size: 10px;
  background-color: #4a5064;
  // 文字之间的间隔
  letter-spacing: 0.2em;
}
</style>