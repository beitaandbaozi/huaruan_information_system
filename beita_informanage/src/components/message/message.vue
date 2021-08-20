<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>发布公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form
        :model="addMessageFrom"
        :rules="addMessageRules"
        ref="addMessageRef"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="addMessageFrom.title"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="author">
          <el-input v-model="addMessageFrom.author"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="time">
          <el-input v-model="addMessageFrom.time"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor v-model="addMessageFrom.content"></quill-editor>
        </el-form-item>
      </el-form>
      <span class="btn">
        <el-button type="danger" @click="reset">重置</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addMessageFrom: {
        title: "",
        author: "",
        time: "",
        content: "",
      },
      addMessageRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        author: [
          { required: true, message: "请输入发布者名称", trigger: "blur" },
        ],
        time: [
          { required: true, message: "请输入发布者时间", trigger: "blur" },
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    reset() {
      /**
       * 清除表单验证
       * 清除表单内容
       */
      this.$refs.addMessageRef.resetFields();
      this.addMessageFrom = {
        title: "",
        author: "",
        time: "",
        content: "",
      };
    },
    btnOk() {
      this.$refs.addMessageRef.validate(async (valid) => {
        if (!valid) return;
        /**
         * 链接发布链接的接口
         * 发布通知
         * 清空文本
         */
        await this.$http.post("/messages/message", {
          title: this.addMessageFrom.title,
          author: this.addMessageFrom.author,
          time: this.addMessageFrom.time,
          content: this.addMessageFrom.content,
        });
        this.$message.success("发布公告成功！");
        this.$refs.addMessageRef.resetFields();
        this.addMessageFrom = {
          title: "",
          author: "",
          time: "",
          content: "",
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>