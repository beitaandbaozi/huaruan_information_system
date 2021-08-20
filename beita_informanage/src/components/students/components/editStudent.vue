<template>
  <div>
    <el-dialog
      title="编辑学生"
      :visible="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <el-form
        :model="editStudentForm"
        :rules="editStudentRules"
        ref="editStudentRef"
        label-width="80px"
      >
        <el-form-item label="学号" prop="num" >
          <el-input v-model="editStudentForm.num" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editStudentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="editStudentForm.class"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editStudentForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="辅导员">
          <el-select v-model="teacher" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系别" prop="duty">
          <el-input v-model="editStudentForm.duty"></el-input>
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
    // 验证手机号的自定义规则
    var checkMobile = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      editStudentForm: {
        num: "",
        name: "",
        class: "",
        mobile: "",
        duty: "",
      },
      options: [
        {
          value: "吴彦宇",
          label: "吴彦宇",
        },
        {
          value: "朱永杰",
          label: "朱永杰",
        },
        {
          value: "周洁银",
          label: "周洁银",
        },
        {
          value: "王淑晓",
          label: "王淑晓",
        },
        {
          value: "方惠豹",
          label: "方惠豹",
        },
        {
          value: "曾慧琳",
          label: "曾慧琳",
        },
        {
          value: "纪聪慧",
          label: "纪聪慧",
        },
      ],
      teacher: "",
      editStudentRules: {
    
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 4,
            message: "姓名的长度为3-4个字符",
            trigger: "blur",
          },
        ],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        duty: [{ required: true, message: "请输入所属系", trigger: "blur" }],
      },
    };
  },
  methods: {
    btnCancel() {
      //清除表单
      this.editStudentForm = {
        num: "",
        name: "",
        class: "",
        mobile: "",
        duty: "",
      };
      this.teacher = "";
      //清除表单校验
      this.$refs.editStudentRef.resetFields();
      //关闭对话框
      this.$emit("update:showDialog", false);
    },
    async editStudent(id) {
      const { data } = await this.$http.get(`/students/update/${id}`);
      // console.log(data);
      this.editStudentForm = data[0];
      this.teacher = data[0].teacher;
    },
    btnOk() {
      /**
       * 表单校验
       * 连接接口
       * 通知消息
       * 更新数据
       * 通知父组件关闭表单
       */
      this.$refs.editStudentRef.validate((valid) => {
        if (!valid) return;
        this.$http.post(`/students/update/${this.editStudentForm.num}`, {
          num: this.editStudentForm.num,
          name: this.editStudentForm.name,
          classNum: this.editStudentForm.class,
          mobile: this.editStudentForm.mobile,
          teacher: this.teacher,
          duty: this.editStudentForm.duty,
        });
        this.$message.success('更改学生信息成功');
        this.$emit('editStudent');
        this.$emit('update:showDialog', false);
        
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>