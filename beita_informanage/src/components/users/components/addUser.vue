<template>
  <div>
    <el-dialog
      title="添加用户"
      :visible="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="duty">
          <el-input v-model="addUserForm.duty"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // 定义自定义规则
    // 验证邮箱的自定义规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    return {
      addUserForm: {
        name: "",
        password: "",
        email: "",
        duty: "",
      },
      addUserRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        duty: [{ required: true, message: "请输入角色", trigger: "blur" }],
      },
    };
  },
  methods: {
    btnCancel() {
      // 清除表单
      (this.addUserForm = {
        name: "",
        password: "",
        email: "",
        duty: "",
      }),
        // 清除校验规则
        this.$refs.addUserRef.resetFields();
      // 通知父组件关闭弹框
      this.$emit("update:showDialog", false);
    },
    btnOk() {
      /**
       * 01.检验表单的填写是否符合要求
       * 02.连接接口
       * 03.通知父组件更新数据
       * 04.关闭窗口
       */
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        // this.$http
        //   .post("users/add", {
        //     name: this.addUserForm.name,
        //     password: this.addUserForm.password,
        //     email: this.addUserForm.email,
        //     duty: this.addUserForm.duty,
        //   })
        //   .then((response) => {
        //     let res = response.data;
        //     if (res.stauts == 200) {
        //       return this.$message.success(res.msg);
        //     }
        //     this.$message.success(res.msg);
        //   })
        //   .catch((err) => err);
        await this.$http.post("users/add", {
          name: this.addUserForm.name,
          password: this.addUserForm.password,
          email: this.addUserForm.email,
          duty: this.addUserForm.duty,
        });
        this.$message.success('添加用户成功！');
        this.$emit("addUser");
        this.$emit("update:showDialog", false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>