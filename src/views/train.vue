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
        <el-form-item label="训练集占比">
          <el-slider
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

    <el-table
      v-loading="loading"
      :data="data"
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
          label="测试集"
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
      <el-table-column label="操作" align="center" fixed="right" width="200px">
        <template #default="scope">
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
            >导出模型</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="hyperParams" title="超参数"> </el-dialog>
  </div>
</template>

<script>
import * as instance from "@/api/instance";
import { selectedData } from "@/views/data.vue";
import axios from "axios";

export default {
  //   name: "table",
  data() {
    return {
      loading: false,
      addInstance: false,
      hyperParams: false,
      data: [],
      hyper_params: [],
      status_type: {
        0: "info",
        1: "warning",
        2: "primary",
        3: "danger",
        4: "success",
      },
      status_name: {
        0: "未开始",
        1: "训练中",
        2: "测试中",
        3: "已暂停",
        4: "训练完成",
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
        this.data = response;
        this.loading = false;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatTooltip(val) {
      return val / 100;
    },
    showHyperParams(row) {},
  },
  computed: {
    DData() {},
  },
};
</script>

<style scoped>
.mt20 {
  margin-top: 20px;
}
</style>
