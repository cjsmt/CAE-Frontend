<template>
  <div class="app-container">
    <el-card class="mt20">
      <el-row>
        <el-button plain type="primary" @click="appendVisible = true"
          >新增</el-button
        >
      </el-row>

      <el-dialog v-model="appendVisible" title="新增载荷数据">
        <el-form :model="form" label-width="120px" label-position="right">
          <el-form-item label="所属3D结构">
            <el-select v-model="form.shape_3d" placeholder="请选择所属3D结构">
              <el-option
                v-for="item in structures"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="应力坐标">
            <el-col :span="8">
              <el-input
                v-model="form.position_x"
                placeholder="X坐标"
                style="width: 95%"
              />
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="form.position_y"
                placeholder="Y坐标"
                style="width: 95%"
              />
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="form.position_z"
                placeholder="Z坐标"
                style="width: 95%"
              />
            </el-col>
          </el-form-item> -->
          <!-- <el-form-item label="应力大小(N)">
            <el-input v-model="form.stress" style="width: 35%" />
          </el-form-item> -->
          <el-form-item label="载荷文件">
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              action="none"
              multiple
              drag
              :auto-upload="false"
              :accept="npy"
            >
              <el-icon class="el-icon--upload" style="width: 500px"
                ><upload-filled
              /></el-icon>
              <div class="el-upload__text">拖拽文件 或 <em>点击上传</em></div>
              <!-- <template #trigger>
                <el-button>选择文件</el-button>
              </template> -->
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="appendVisible = false">取消</el-button>
            <el-button type="primary" @click="handleAppend">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

    <el-table
      v-loading="loading"
      :data="data"
      highlight-current-row
      @current-change="handleCurrentChange"
      class="mt20"
    >
      <el-table-column property="id" label="序号" align="center">
      </el-table-column>
      <el-table-column property="name" label="载荷文件" align="center">
      </el-table-column>
      <el-table-column
        property="shape_3d_name"
        label="所属3D结构"
        align="center"
        
      >
      </el-table-column>
      <el-table-column property="load" label="载荷大小" align="center">
      </el-table-column>
      <!-- <el-table-column label="应力坐标" align="center">
        <template v-slot="scope">
          {{
            parsePosition(
              scope.row.position_x,
              scope.row.position_y,
              scope.row.position_z
            )
          }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column property="stress" label="应力大小(N)" align="center">
      </el-table-column> -->
      <el-table-column label="创建时间" align="center">
        <template v-slot="scope">
          {{ parseTime(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <!-- <el-button
            size="small"
            plain
            type="success"
            @click="handleBeforeEdit(scope.row)"
            >编辑</el-button
          > -->
          <el-button
            size="small"
            plain
            type="success"
            @click="handleDownload(scope.row.id)"
            >下载</el-button
          >
          <el-button
            size="small"
            plain
            type="danger"
            @click="handleRemove(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog v-model="editVisible" title="编辑应力数据">
      <el-form :model="form" label-width="100px" label-position="right">
        <el-form-item label="所属3D结构">
          <el-select
            v-model="form.structure_of_3d"
            placeholder="请选择所属3D结构"
          >
            <el-option
              v-for="item in structures"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应力坐标">
          <el-col :span="8">
            <el-input
              v-model="form.position_x"
              placeholder="X坐标"
              style="width: 95%"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="form.position_y"
              placeholder="Y坐标"
              style="width: 95%"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="form.position_z"
              placeholder="Z坐标"
              style="width: 95%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="应力大小(N)">
          <el-input v-model="form.stress" style="width: 35%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEdit">确认</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script>
import * as mises from "@/api/mises";
import * as structure from "@/api/structure";
import axios from "axios";

export default {
  name: "table",
  data() {
    return {
      loading: false,
      appendVisible: false,
      editVisible: false,
      data: [],
      form: {
        name: null,
        shape_3d: null,
        load: null,
        // position_x: null,
        // position_y: null,
        // position_z: null,
        // stress: null,
        // fea_file: null,
        file: null,
        update_time: null,
      },
      structures: [],
      fileList: [],
    };
  },
  created() {
    structure.list().then((response) => {
      this.structures = response;
    });
    this.getList();
  },
  methods: {
    // parsePosition(x, y, z) {
    //   return "(" + x + "," + y + "," + z + ")";
    // },
    parseTime(time) {
      return time.substring(0, 19).replace("T", " ");
    },
    getTime() {
      let date = new Date();
      let yy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      let hh = date.getHours();
      let mf =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },
    clearForm() {
      for (let key in this.form) {
        this.form[key] = null;
      }
      this.fileList = [];
    },
    getList() {
      this.loading = true;
      mises.list().then((response) => {
        // this.data = response.map((item) => {
        //   return {
        //     id: item.id,
        //     structure_of_3d: item.structure_of_3d,
        //     position: this.parsePosition(
        //       item.position_x,
        //       item.position_y,
        //       item.position_z
        //     ),
        //     stress: item.stress,
        //     update_time: this.parseTime(item.update_time),
        //   };
        // });
        this.data = response;
        this.loading = false;
      });
    },
    handleAppend() {
      this.form.update_time = this.getTime();

      let fd = new FormData();
      let num = this.fileList.length;
      for (let i = 0; i < num; i++) {
        this.form.file = this.fileList[i].raw;
        this.form.name = this.form.file.name.split(".")[0];
        this.form.load = Number(this.form.name.split("_").pop()) * 50;

        fd.append("name", this.form.name);
        fd.append("shape_3d", this.form.shape_3d);
        fd.append("load", this.form.load);
        fd.append("file", this.form.file);
        fd.append("update_time", this.form.update_time);
      }
      // console.log(fd)
      // fd.append("position_x", this.form.position_x);
      // fd.append("position_y", this.form.position_y);
      // fd.append("position_z", this.form.position_z);
      // fd.append("stress", this.form.stress);
      // fd.append("fea_file", this.form.fea_file);

      axios({
        url: "http://127.0.0.1:8000/data/add_mises/",
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        if (response) {
          this.$notify({
            title: "成功",
            message: "新增成功！",
            type: "success",
            duration: 2000,
          });
          console.log(response);
        }
        this.getList();
        this.clearForm();
        this.appendVisible = false;
      });

      // stress.append(this.form).then((response) => {
      //   if (response) {
      //     this.$notify({
      //       title: "成功",
      //       message: "新增成功！",
      //       type: "success",
      //       duration: 2000,
      //     });
      //   }
      //   this.getList();
      //   // this.clearForm();
      //   this.appendVisible = false;
      // });
    },
    // handleBeforeEdit(data) {
    //   this.editVisible = true;
    //   this.form = data;
    // },
    // handleEdit() {
    //   this.form.update_time = this.getTime();
    //   stress.edit(this.form).then((response) => {
    //     if (response) {
    //       console.log(1);
    //       this.$notify({
    //         title: "成功",
    //         message: "编辑成功！",
    //         type: "success",
    //         duration: 2000,
    //       });
    //     }
    //     this.editVisible = false;
    //     this.getList();
    //   });
    // },
    handleDownload(id) {
      console.log(id);
    },
    handleRemove(id) {
      mises.remove(id).then((response) => {
        if (response) {
          this.$notify({
            title: "成功",
            message: "删除成功！",
            type: "success",
            duration: 2000,
          });
        }
        this.getList();
      });
    },
  },
};
</script>

<style scoped>
.mt20 {
  margin-top: 20px;
}
</style>
