<template>
  <div class="app-container">
    <el-card class="mt20">
      <el-row>
        <el-col :span="14">
          <el-button plain type="primary" @click="append3DVisible = true"
            >新增3D结构数据</el-button
          >
          <el-button plain type="primary" @click="appendVisible = true"
            >新增载荷数据</el-button
          >
        </el-col>
        <el-col :span="10" style="float: right">
          <el-select
            plain
            v-model="filterType"
            style="margin: 0 15px"
            placeholder="请选择所属3D结构"
          >
            <el-option label="All" value=""></el-option>
            <el-option
              v-for="item in structures"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            plain
            type="success"
            @click="handleSelect"
            v-if="filterType.length != 0"
            >确认选择</el-button
          >
          <el-button
            plain
            type="warning"
            @click="selectVisible = true"
            v-if="filterType.length != 0"
            >查看选择</el-button
          >
          <el-button
            plain
            type="danger"
            @click="clearSelect"
            v-if="filterType.length != 0"
            >清空选择</el-button
          >
        </el-col>
      </el-row>

      <el-dialog v-model="append3DVisible" title="新增3D结构数据">
        <el-form :model="form_3D" label-width="80px" label-position="right">
          <el-form-item>
            <el-upload
              v-model:file-list="shapeList"
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
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="append3DVisible = false">取消</el-button>
            <el-button type="primary" @click="handleAppend3D">确认</el-button>
          </span>
        </template>
      </el-dialog>

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

      <el-dialog v-model="selectVisible" title="已选择载荷数据">
        <el-table
          ref="selected_table"
          v-loading="loading"
          :data="selected_data"
          @selection-change="handleSelectedSelectionChange"
        >
          <el-table-column type="selection" width="50px"></el-table-column>
          <el-table-column property="id" label="序号" align="center">
          </el-table-column>
          <el-table-column property="name" label="载荷文件" align="center">
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              plain
              type="danger"
              @click="cancelSelect"
              v-if="multipleSelectedSelection.length > 0"
              >取消选择</el-button
            >
            <el-button @click="selectVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

    <el-table
      ref="table"
      v-loading="loading"
      :data="filtedData"
      highlight-current-row
      @selection-change="handleSelectionChange"
      class="mt20"
      style="height: 500px"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="filterType.length != 0"
      ></el-table-column>
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
          <!-- <el-button
            size="small"
            plain
            type="success"
            @click="handleDownload(scope.row.id)"
            >下载</el-button
          > -->
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
  </div>
</template>

<script>
import * as mises from "@/api/mises";
import * as structure from "@/api/structure";
import { thisExpression } from "@babel/types";
import axios from "axios";

let selectedData = [];

export default {
  // name: "table",

  data() {
    return {
      loading: false,
      appendVisible: false,
      append3DVisible: false,
      selectVisible: false,
      editVisible: false,
      data: [],
      selected_data: [],
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
      form_3D: {
        name: null,
        file: null,
        create_time: null,
      },
      structures: [],
      fileList: [],
      shapeList: [],

      filterType: "",
      multipleSelection: [],
      multipleSelectedSelection: [],
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
    clearForm3D() {
      for (let key in this.form_3D) {
        this.form_3D[key] = null;
      }
      this.shapeList = [];
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
    },
    handleAppend3D() {
      this.form_3D.create_time = this.getTime();

      let fd = new FormData();
      let num = this.shapeList.length;
      for (let i = 0; i < num; i++) {
        this.form_3D.file = this.shapeList[i].raw;
        this.form_3D.name = this.form_3D.file.name.split(".")[0];

        fd.append("name", this.form_3D.name);
        fd.append("file", this.form_3D.file);
        fd.append("create_time", this.form_3D.create_time);
      }

      axios({
        url: "http://127.0.0.1:8000/data/add_shape/",
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
        structure.list().then((response) => {
          this.structures = response;
        });
        this.clearForm3D();
        this.append3DVisible = false;
      });
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelect() {
      if (this.multipleSelection.length != 0) {
        selectedData = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          selectedData.push(this.multipleSelection[i]);
        }
        this.$refs.table.clearSelection();
        this.selected_data = selectedData;
        this.$notify({
          title: "成功",
          message: "选择成功！",
          type: "success",
          duration: 1500,
        });
      } else {
        this.$notify({
          title: "失败",
          message: "尚未勾选载荷数据！",
          type: "error",
          duration: 1500,
        });
      }
    },
    clearSelect() {
      if (selectedData.length != 0) {
        selectedData = [];
        this.selected_data = [];
        this.$refs.table.clearSelection();
        this.$notify({
          title: "成功",
          message: "成功清空选择！",
          type: "success",
          duration: 1500,
        });
      } else {
        this.$notify({
          title: "失败",
          message: "当前未选择任何载荷数据！",
          type: "error",
          duration: 1500,
        });
      }
    },
    handleSelectedSelectionChange(val) {
      this.multipleSelectedSelection = val;
    },
    cancelSelect() {
      console.log(this.multipleSelectedSelection.length);
      for (let i = 0; i < this.multipleSelectedSelection.length; i++) {
        // console.log(item);
        console.log(this.multipleSelectedSelection[i]);
        console.log(selectedData);
        selectedData.forEach((item, index, arr) => {
          if (item.id === this.multipleSelectedSelection[i].id) {
            arr.splice(index, 1);
          }
        });
      }
      this.$refs.selected_table.clearSelection();
      this.selected_data = selectedData;
      this.selectVisible = false;
      this.$notify({
        title: "成功",
        message: "取消选择成功！",
        type: "success",
        duration: 1500,
      });
    },
  },
  computed: {
    filtedData() {
      return this.data.filter((item) => {
        return this.filterType === "" || item.shape_3d === this.filterType;
      });
    },
  },
};
export { selectedData };
</script>

<style scoped>
.mt20 {
  margin-top: 20px;
}
</style>
