<template>
  <!-- 头部区域 -->
  <el-container class="home-container">
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <el-menu
          background-color="rgb(7, 7, 7)"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :collapse="iscollapse"
          :collapse-transition="false"
        >
          <el-menu-item index="/home">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <template v-slot:title> <span>主页</span></template>
          </el-menu-item>

          <!-- <el-sub-menu index="/data">
            <template v-slot:title>
              <el-icon><DataAnalysis /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item-group title="数据管理">
              <el-menu-item index="/data-structure">3d结构数据管理</el-menu-item>
              <el-menu-item index="/data">应力数据管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu> -->

          <el-menu-item index="/data">
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <template v-slot:title> <span>数据管理</span></template>
          </el-menu-item>

          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <LocationFilled />
              </el-icon>
              <span>训练与测试</span>
            </template>
            <el-menu-item-group title="训练与测试">
              <el-menu-item index="/train">训练</el-menu-item>
              <el-menu-item index="/test">测试</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-menu-item index="/virtual">
            <el-icon>
              <HelpFilled />
            </el-icon>
            <template v-slot:title> <span>应力场可视化</span></template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- </el-aside> -->
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Data from "./data.vue";
export default {
  name: "Home",
  setup() {},
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      // 是否折叠
      iscollapse: true,
    };
  },
  methods: {
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
  },
  components: { Data },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 700px;
}

.el-header {
  // background-color: #55626b;
  background-color: #004e90;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

  .reshape_img {
    height: 40px;
    // width: 20px;
  }
}

.el-aside {
  background-color: rgb(7, 7, 7);
}

.el-main {
  background-color: #e5e6e8;
  padding-top: 0%;
  padding-left: 3%;
}
.navi {
  width: 500px;
  padding-right: 10%;
}
.toggle-button {
  color: white;
  text-align: center;
  line-height: 34px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
a {
  text-decoration: none;
  color: #fff;
  font-size: 15px;
}
</style>
