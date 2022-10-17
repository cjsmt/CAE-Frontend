<template>
  <div class="app-container">
    <el-row :gutter="20" v-for="i in Math.round(count / n)" :key="i">
      <el-col
        :span="6"
        v-for="j in i === Math.round(count / n) ? count % n : n"
        :key="j"
      >
        <el-card class="card-box">
          <template #header>
            <span>{{ data[(i - 1) * n + (j - 1)].name }}</span>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as structure from "@/api/structure";

export default {
  name: "structure",
  data() {
    return {
      count: 0,
      n: 4,
      data: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      structure.list().then((response) => {
        this.data = response;
        this.count = response.length;
      });
    },
  },
};
</script>

<style scoped>
.card-box {
  margin: 10px 0 10px 0;
  height: 200px;
}
</style>
