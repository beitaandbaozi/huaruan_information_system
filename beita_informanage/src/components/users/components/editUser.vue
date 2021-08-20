<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input disabled v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="duty">
          <el-input v-model="editForm.duty"></el-input>
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
      editForm: {},
      editFormRules: {
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
    editUser(id) {
      this.$http
        .get(`/users/update/${id}`)
        .then((res) => {
          this.editForm = res.data[0];
          console.log(this.editForm);
        })
        .catch((error) => error);
    },
    btnCancel() {
      // 通知父组件关闭对话框
      this.$emit("update:showDialog", false);
    },
    btnOk() {
      /**
       * 01.表单检验
       * 02.提交
       *
       */
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.$http
          .post(`/users/update/${this.editForm.id}`, {
            id:this.editForm.id,
            name: this.editForm.name,
            password: this.editForm.password,
            email: this.editForm.email,
            duty: this.editForm.duty,
          })
          .then((response) => {
            // console.log(response.data);
            this.$message.success("编辑用户信息成功！");
            if (response.data.affectedRows == 1) {
              // 通知父组件更新用户列表
              this.$emit("editUser");
            }
          })
          .catch((error) => error);
        // 通知父组件关闭对话框
        this.$emit("update:showDialog", false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>