<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/dog.png" alt="LOGO" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 验证码(2021-6-21) -->
        <el-form-item prop="verifyCode" class="verifyCodeItemCss">
          <el-row :span="24">
            <el-col :span="14">
              <el-input
                class="verify_css"
                placeholder="请输入4位验证码"
                v-model="loginForm.verifyCode"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-col>
            <!--关键 ↓-->
            <el-col :span="10">
              <div id="v_container"></div>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入验证码组件
import { GVerify } from "../assets/js/verifyCode";
import { mapMutations, mapState } from "vuex";
export default {
  computed: { ...mapState(["userId"]) },
  mounted() {
    this.verifyCode = new GVerify("v_container");
  },
  data() {
    return {
      userToken: "",
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "beita",
        password: "123456",
        verifyCode: "",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 验证码
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations(["changeLogin", "changeUserId"]),
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      (this.loginForm = {
        username: "",
        password: "",
      }),
        this.$refs.loginFormRef.resetFields();
    },
    login() {
      var that = this;

      // 获取验证码
      var verifyCode = this.loginForm.verifyCode;
      var verifyFlag = this.verifyCode.validate(verifyCode);
      if (!verifyFlag) {
        that.$message.error("验证码错误！");
        return;
      }
      // 提交表单时，都要预先验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        this.$http
          .post("/users/login", {
            username: this.loginForm.username,
            password: this.loginForm.password,
          })
          .then((response) => {
            let res = response.data;
            //console.log(response)
            console.log(res);
            this.changeUserId(res.id);
            // console.log(this.userId);
            if (res.status != 200) {
              this.$message.error("登录失败！");
              return;
            } else {
              this.userToken = "Bearer " + res.token;
              // 将用户token保存到vuex中
              this.changeLogin({ Authorization: this.userToken });
              this.$message.success("登录成功！");
              setTimeout(() => {
                this.$router.push("/home");
              }, 1000);
              //location.href='/user'
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  // background-color: lightpink;
  background-image: linear-gradient(to top, #a7a8bd,#d8e3e7, #87cfff);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: -17px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
