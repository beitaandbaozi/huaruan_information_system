<template>
  <div class="dashboard-container">
    <!-- 头部内容 -->
    <el-card class="header-card">
      <div>
        <div class="fl headL">
          <div class="headImg">
            <img src="../../assets/dog.png" />
          </div>
          <div class="headInfoTip">
            <p class="firstChild">
              <span v-if="getHourse < 12">早上好</span>
              <span v-else-if="getHourse >= 12 && getHourse <= 17">中午好</span>
              <span v-else>晚上好</span>
              ,{{ name }},祝你开心每一天！
            </p>
            <p class="lastChild">广州软件学院,{{ duty }}</p>
          </div>
        </div>
        <div class="fr" />
      </div>
    </el-card>
    <!-- 主要内容 -->
    <el-row type="flex" justify="space-between">
      <!-- 左侧内容 -->
      <el-col :span="13" style="padding-right: 26px">
        <!-- 工作日历 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>工作日历</span>
          </div>
          <!-- 放置日历组件 -->
          <WorkCalender></WorkCalender>
        </el-card>
        <!-- 公告 -->
        <el-card class="box-card">
          <div class="advContent">
            <div class="title">公告</div>
            <div class="contentItem">
              <ul class="noticeList">
                <li v-for="item in messageList" :key="item.id">
                  <div class="item">
                    <img src="../../assets/message.png" alt="" />
                    <div>
                      <p>
                        <span class="col">{{ item.title }}</span>
                      </p>
                      <p>
                        <span style="color: lightblue">{{ item.author }}</span>
                        <span>{{ item.publishTime }}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="11">
        <el-card class="box-card">
          <div class="header headTit">
            <span>页面浏览</span>
          </div>
          <div class="sideNav">
            <el-button class="sideBtn" @click="$router.push('/students')"
              >学生管理</el-button
            >
            <el-button class="sideBtn" @click="$router.push('/teachers')"
              >教师管理</el-button
            >
            <el-button class="sideBtn" @click="$router.push('/class')"
              >选课管理</el-button
            >
          </div>
        </el-card>

        <!-- 绩效指数 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>绩效指数</span>
          </div>
          <!-- 放置雷达图 -->
          <Radar></Radar>
        </el-card>
        <!-- 轮播图 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>校园一角</span>
          </div>

          <el-carousel
            :interval="2000"
            type="card"
            height="200px"
            arrow="hover"
          >
            <el-carousel-item
              v-for="(item, index) in scrollImageList"
              :key="index"
            >
              <img :src="item.url" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WorkCalender from "./components/WorkCalender.vue";
import Radar from "./components/Radar.vue";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["userId"]),
    getHourse() {
      return new Date().getHours();
    },
  },
  components: {
    WorkCalender,
    Radar,
  },
  created() {
    this.getUserInformation();
    this.getMessage();
  },

  data() {
    return {
      name: "",
      duty: "",
      messageList: [],
      scrollImageList: [
        {
          url: "http://attach.sise.edu.cn/attachment/core/label/2020_10/22_14/8b6be371e189fee2.jpg",
        },
        {
          clickUrl: "#",
          url: "http://attach.sise.edu.cn/attachment/core/label/2020_10/22_14/1a700f6c093c9668.jpg",
        },
        {
          clickUrl: "#",
          url: "http://attach.sise.edu.cn/attachment/core/label/2020_10/22_14/0226d21804216567.jpg",
        },
        {
          url: "http://attach.sise.edu.cn/attachment/core/label/2021_04/01_09/a9cdebaf881c7e4e.jpg",
        },
        {
          url: "http://attach.sise.edu.cn/attachment/core/label/2021_04/01_09/6e3dbcd411e54090.jpg",
        },
        {
          url: "http://attach.sise.edu.cn/attachment/core/label/2020_12/15_11/63675f40f426b457.jpg",
        },
      ],
    };
  },
  methods: {
    async getUserInformation() {
      const { data } = await this.$http.get(`/users/user/${this.userId}`);
      this.name = data[0].name;
      this.duty = data[0].duty;
    },
    async getMessage() {
      const { data } = await this.$http.get("/messages/message");
      this.messageList = data;
      console.log(this.messageList);
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;
  li {
    list-style: none;
  }
  .headImg {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #999;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .headInfoTip {
    padding: 25px 0 0;
    margin-left: 120px;
    p {
      padding: 0 0 15px;
      margin: 0;
      &.firstChild {
        font-size: 24px;
      }
      &.lastChild {
        font-size: 20px;
        color: #7f8c8d;
      }
    }
  }
}

.box-card {
  padding: 5px 10px;
  margin-top: 20px;
  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }
    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }
  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
  .el-carousel__item img {
    width: 100%;
    height: 95%;
  }
}
.header-card {
  position: relative;
  .header {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
}

.advContent {
  background: #fff;
  border-radius: 5px 5px 0px 0px;
  .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }
  .contentItem {
    padding: 0 30px;
    min-height: 350px;
    .item {
      display: flex;
      padding: 18px 0 10px;
      border-bottom: solid 1px #ccc;
      .col {
        color: #8a97f8;
      }
      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 10px;
      }
      p {
        padding: 0 0 8px;
      }
    }
  }
}
.noticeList {
  margin: 0;
  padding: 0;
}
.sideNav,
.sideLink {
  padding: 30px 0 12px;
  .sideBtn {
    padding: 16px 26px;
    font-size: 16px;
    margin: 10px 5px;
  }
}
.sideLink {
  text-align: center;
  .icon {
    display: inline-block;
    width: 76px;
    height: 76px;
    background: url("../../assets/icon.png") no-repeat;
  }
  .iconGuide {
    background-position: 0 0;
  }
  .iconHelp {
    background-position: -224px 0;
  }
  .iconTechnology {
    background-position: -460px 0;
  }
}
</style>
