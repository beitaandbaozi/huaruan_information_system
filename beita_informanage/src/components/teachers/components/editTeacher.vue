<template>
  <div>
    <el-dialog
      title="编辑学生"
      :visible="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <el-form
        :model="editTeacherForm"
        :rules="editTeacherRules"
        ref="editTeacherRef"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editTeacherForm.name"></el-input>
        </el-form-item>

        <el-form-item label="头像">
          <div class="weui-uploader__bd">
            <ul class="weui-uploader__files" id="uploaderFiles">
              <li
                class="weui-uploader__file"
                v-for="(image, index) in images"
                :key="index"
                :style="'background-image:url(' +image + ')'"
              >
                <span @click="del(index)" class="x">&times;</span>
              </li>
            </ul>
            <div
              class="weui-uploader__input-box"
              v-show="images.length < maxCount"
            >
              <input
                @change="change"
                id="uploaderInput"
                class="weui-uploader__input"
                type="file"
                accept="image/*"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editTeacherForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="summary">
          <el-input v-model="editTeacherForm.summary"></el-input>
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
      editTeacherForm: {
        name: "",
        mobile: "",
        summary: "",
      },
      editTeacherRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 4,
            message: "姓名的长度为3-4个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        summary: [{ required: true, message: "请输入所属系", trigger: "blur" }],
      },

      maxSize: 10240000 / 2, //上传图片的大小
      maxCount: 1, //允许上传的文件个数
      filesArr: [], //文件数组
      images: [], // 用来图片预览 base64 图片信息
      piclist: [],
      httpRequestUrl: "http://localhost:3000/",
    };
  },
  methods: {
    btnCancel() {
      //清除表单
      this.editTeacherForm = {
        name: "",
        mobile: "",
        summary: "",
      };
      this.images = [];
      //清除表单校验
      this.$refs.editTeacherRef.resetFields();
      //关闭对话框
      this.$emit("update:showDialog", false);
    },
    async editTeacher(id) {
      const { data } = await this.$http.get(`/teachers/update/${id}`);
      // console.log(data);
      this.editTeacherForm = data[0];
      // this.images = data[0].picURL;
      // console.log(this.images);
    },
    btnOk() {
      /**
       * 表单校验
       * 连接接口
       * 通知消息
       * 更新数据
       * 通知父组件关闭表单
       */
      this.$refs.editTeacherRef.validate(async (valid) => {
        if (!valid) return;

        let param = new FormData();
        let id = this.editTeacherForm.id;
        let name = this.editTeacherForm.name;
        let mobile = this.editTeacherForm.mobile;
        let summary = this.editTeacherForm.summary;
        param.append("id", id);
        param.append("name", name);
        param.append("mobile", mobile);
        param.append("summary", summary);

        this.filesArr.forEach((file) => {
          param.append("pic", file);
        });
        
        await this.$http.post(`/teachers/update/${this.editTeacherForm.id}`,param)
        this.$message.success("更改教师信息成功");
        this.$emit("editTeacher");
        this.$emit("update:showDialog", false);
        
      });
    },
    change(e) {
      let files = e.target.files; // e => event对象  , e.target=>input  ,e.target.files=>所有的上传的文件信息
      //console.log(e.target)
      if (files.length == 0) {
        return;
      }
      let reader, file;
      let images = this.images;
      for (let i = 0; i < files.length; i++) {
        file = files[i];
        this.filesArr.push(file);
        reader = new FileReader(); //读取计算机上的文件或缓存区的数据
        if (file.size > this.maxSize) {
          continue;
        }
        reader.onload = (e) => {
          //当前文件读取完成以后
          let img = new Image(); //document.createElement('img')
          img.onload = function () {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let w = img.width;
            let h = img.height;
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL("image/jpeg");
            images.push(base64);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    // 删除图片时
    del: function (index) {
      this.filesArr.splice(index, 1);
      this.images.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.weui-uploader {
  width: 500px;
  margin: 20px;
}

.weui-uploader__file {
  position: relative;
  margin-top: 6px;
}

.weui-uploader__file .x {
  text-align: center;
  line-height: 23px;
  font-size: 18px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  opacity: 0.7;
  background: #000;
  color: #fff;
  position: absolute;
  right: -5px;
  top: -5px;
}
.list img {
  width: 120px;
  height: 90px;
  float: left;
  margin: 0 3px;
}
</style>