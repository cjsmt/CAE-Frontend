<template>
  <div class="app-container">
    <el-card class="mt20">
      <el-row>
        <el-button type="primary" @click="addInstance = true"
          >创建实例</el-button
        >
      </el-row>
    </el-card>

    <el-dialog v-model="addInstance" title="创建训练实例">
      <el-form :model="form" label-width="120px" label-position="right">
        <el-form-item label="迭代次数">
          <el-input-number v-model="form.epoch" :step="5" min="0" />
        </el-form-item>
        <el-form-item label="训练集比例">
          <el-slider
            show-tooltip
            v-model="form.train_test_rate"
            :format-tooltip="formatTooltip"
          />
        </el-form-item>
        <el-form-item label="batch_size">
          <el-input v-model="form.batch_size"></el-input>
        </el-form-item>
        <el-form-item label="learning_rate">
          <el-input v-model="form.learning_rate"></el-input>
        </el-form-item>
        <el-form-item label="decay_rate">
          <el-input v-model="form.decay_rate"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addInstance = false">取消</el-button>
          <el-button type="primary" @click="handleAppend">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="addDatasets" title="添加数据集">
      <el-row>
        <el-col :span="16">
          <el-select
            plain
            v-model="datasetType"
            style="margin: 0 10px"
            placeholder="请选择数据集类别"
          >
            <el-option label="训练集" value="0"></el-option>
            <el-option label="测试集" value="1"></el-option>
          </el-select>
          <el-select
            plain
            v-model="filterType"
            style="margin: 0 10px"
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
        </el-col>
        <el-col :span="8">
          <el-button plain type="success" @click="handleSelect"
            >确认选择</el-button
          >
          <!-- <el-button
            plain
            type="warning"
            @click="selectVisible = true"
            >查看选择</el-button
          > -->
          <el-button plain type="danger" @click="clearSelect"
            >清空选择</el-button
          >
        </el-col>
      </el-row>
      <el-table
        ref="data_table"
        :data="filtedData"
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="height: 300px; margin-top: 10px"
      >
        <el-table-column type="selection" width="50px"></el-table-column>
        <el-table-column property="id" label="序号" align="center">
        </el-table-column>
        <el-table-column property="name" label="载荷文件" align="center">
        </el-table-column>
        <el-table-column
          property="shape_3d_name"
          label="所属3D结构"
          align="center"
        ></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="addDatasets = false">关闭</el-button>
          <el-button plain type="primary" @click="handleAddDatasets"
            >添加</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-table
      v-loading="loading"
      :data="instance"
      highlight-current-row
      @selection-change="handleSelectionChange"
      class="mt20"
    >
      <el-table-column
        prop="id"
        label="实例id"
        align="center"
        width="80px"
        fixed="left"
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        align="center"
        width="180px"
      >
        <template v-slot="scope">
          {{ parseTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="数据集样本数量" align="center">
        <el-table-column
          prop="train_dataset_num"
          label="训练集"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="test_dataset_num"
          label="验证集"
          align="center"
          width="100px"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="超参数" align="center">
        <el-table-column
          prop="epoch"
          label="Epoch Number"
          align="center"
          width="135px"
        ></el-table-column>
        <el-table-column
          prop="batch_size"
          label="Batch Size"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="learning_rate"
          label="Learning Rate"
          align="center"
          width="135px"
        ></el-table-column>
        <el-table-column
          prop="decay_rate"
          label="Decay Rate"
          align="center"
          width="120px"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100px" fixed="right">
        <template #default="scope">
          <el-tag :type="status_type[scope.row.status]" round effect="dark">
            {{ status_name[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="progress"
        label="训练进度"
        align="center"
        width="200px"
      ></el-table-column>
      <el-table-column
        prop="loss"
        label="损失值"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300px">
        <template #default="scope">
          <el-button
            :disabled="
              scope.row.status == 1 ||
              scope.row.status == 4 ||
              scope.row.status == 5
                ? true
                : false
            "
            size="small"
            @click="appendDatasets(scope.row.id)"
            >添加数据集</el-button
          >
          <el-button
            :disabled="scope.row.status == 4 ? true : false"
            :type="button_type[scope.row.status]"
            size="small"
            @click="handleTrain"
            >{{ button_name[scope.row.status] }}</el-button
          >
          <el-button
            :disabled="scope.row.status == 4 ? false : true"
            type="warning"
            size="small"
            plain
            >开始测试</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as instance from "@/api/instance";
import * as mises from "@/api/mises";
import * as structure from "@/api/structure";
// import {  } from "@/views/data.vue";
import axios from "axios";
import { range } from "lodash";

export default {
  //   name: "table",
  data() {
    return {
      loading: false,
      addInstance: false,
      addDatasets: false,
      instance: [],
      structures: [],
      data: [],
      addTo: 0,
      filterType: "",
      datasetType: "",
      hyper_params: [],
      status_type: {
        0: "info",
        1: "warning",
        2: "primary",
        3: "danger",
        4: "success",
        5: "success",
      },
      status_name: {
        0: "未开始",
        1: "训练中",
        2: "测试中",
        3: "已暂停",
        4: "训练完成",
        5: "测试完成",
      },
      button_type: {
        0: "success",
        1: "danger",
        2: "danger",
        3: "warning",
        4: "info",
      },
      button_name: {
        0: "开始训练",
        1: "暂停训练",
        2: "暂停训练",
        3: "恢复训练",
        4: "训练完成",
      },
      form: {
        epoch: 5,
        batch_size: 256,
        train_test_rate: 70,
        learning_rate: 1e-3,
        decay_rate: 5e-5,
        train_dataset: [],
        test_dataset: [],
        status: false,
        create_time: null,
      },
      multipleSelection: [],
      selectedData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      this.form.epoch = 5;
      this.form.batch_size = 256;
      this.form.train_test_rate = 70;
      this.form.learning_rate = 1e-3;
      this.form.decay_rate = 5e-5;
      this.form.train_dataset = [];
      this.form.test_dataset = [];
      this.form.status = false;
      this.form.create_time = null;
    },
    getList() {
      this.loading = true;
      instance.list().then((response) => {
        this.instance = response;
        this.loading = false;
      });
    },
    getData() {
      structure.list().then((response) => {
        this.structures = response;
      });
      mises.list().then((response) => {
        this.data = response;
      });
    },
    handleAppend() {
      if (selectedData.length != 0) {
        // console.log(selectedData);
        let datasets = [];
        for (let i = 0; i < selectedData.length; i++) {
          datasets.push(selectedData[i].id);
        }
        this.form.train_test_rate = this.formatTooltip(
          this.form.train_test_rate
        );
        let k = Math.round(datasets.length * this.form.train_test_rate);
        datasets.sort(function () {
          return 0.5 - Math.random();
        });
        this.form.train_dataset = datasets.slice(0, k);
        this.form.test_dataset = datasets.slice(k);

        this.form.status = 0;
        this.form.create_time = this.getTime();

        // let fd = FormData();
        // fd.append("epoch", this.form.epoch);
        // fd.append("batch_size", this.form.batch_size);
        // fd.append("learning_rate", this.form.learning_rate);
        // fd.append("decay_rate", this.form.decay_rate);
        // fd.append("status", false);
        // fd.append("train_dataset", this.form.train_dataset);
        // fd.append("test_dataset", this.form.test_dataset);
        // fd.append("create_time", this.getTime());

        instance.add(this.form).then((response) => {
          if (response) {
            this.$notify({
              title: "成功",
              message: "创建实例成功！",
              type: "success",
              duration: 2000,
            });
            // console.log(response);
          }
          this.getList();
          this.clearForm();
          this.addInstance = false;
        });
      } else {
        this.$notify({
          title: "失败",
          message: "请先选择载荷数据作为数据集。",
          type: "error",
          duration: 1500,
        });
      }
    },
    appendDatasets(id) {
      this.addTo = id;
      console.log(this.addTo);
      this.getData();
      this.addDatasets = true;
    },
    handleAddDatasets() {
      if (this.datasetType != "0" && this.datasetType != "1") {
        this.$notify({
          message: "请选择添加数据集类别。",
          type: "error",
          duration: 1500,
        });
        return;
      }
      this.handleSelect();
      let form = {};
      form.id = this.addTo;
      form.train_dataset = [];
      form.test_dataset = [];
      if (this.datasetType == "0") {
        for (let i = 0; i < this.selectedData.length; i++) {
          form.train_dataset.push(this.selectedData[i].id);
        }
      } else if (this.datasetType == "1") {
        for (let i = 0; i < this.selectedData.length; i++) {
          form.test_dataset.push(this.selectedData[i].id);
        }
      }
      instance.add_datasets(form).then((response) => {
        if (response) {
          this.$notify({
            title: "成功",
            message: "添加数据集成功！",
            type: "success",
            duration: 2000,
          });
        }
        //   this.addDatasets = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatTooltip(val) {
      return val / 100;
    },
    showHyperParams(row) {},

    handleSelect() {
      if (this.multipleSelection.length != 0) {
        this.selectedData = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.selectedData.push(this.multipleSelection[i]);
        }
        // this.$refs.data_table.clearSelection();
        this.$notify({
          message: "选择成功！",
          type: "success",
          duration: 1500,
        });
      } else {
        this.$notify({
          message: "尚未勾选载荷数据！",
          type: "error",
          duration: 1500,
        });
      }
    },
    clearSelect() {
      if (this.selectedData.length != 0) {
        this.selected_data = [];
        this.$refs.data_table.clearSelection();
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
  },
  computed: {
    filtedData() {
      return this.data.filter((item) => {
        return this.filterType === "" || item.shape_3d === this.filterType;
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
