<template>
  <!-- 头部区域 -->
  <el-container class="home-container">
    <el-backtop :visibility-height="200" :right="60" :bottom="60">
      <div>
        <el-icon>
          <ArrowUpBold />
        </el-icon>
      </div>
    </el-backtop>
    <!-- head -->
    <el-header class="bg1">
      <div>
        <img src="" alt="" />
        <div style="font-family: KaiTi;font-size:40px;">

          <!-- <el-icon :size="size" :color="color">
            <Edit />
          </el-icon> -->
          <el-icon><ChromeFilled /></el-icon>
          可视化平台
        </div><br>

      </div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
        background-color="rgba(0,0,0,0)" text-color="#fff" active-text-color="#fff" router="true">

        <el-menu-item index="1">我的工作台</el-menu-item>
        <el-menu-item index="3">进程管理</el-menu-item>
        <el-menu-item index="4">消息中心</el-menu-item>
        <el-menu-item index="5">文件管理</el-menu-item>
      </el-menu>
     <el-dropdown>
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="selfInfo">个人主页</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->

      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

};

</script>

<style lang="less"  scoped>
.home-container {
  height: 100%;
}

.bg1 {
  background-image: url(../assets/bg3.png);
}

.reshape_img {
  margin-top: 10px;
  height: 40px;

}
.el-menu-demo
{
  width:600px;
}

.el-header {
  background-color: #303133;

  display: flex;
  justify-content: space-between;
  align-items: center;
  color: aliceblue;
  font-size: 25px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: rgb(248, 243, 243);
  padding: 0px;
}

.el-menu {
  border: none;

}

.toggle-button {
  color: white;
  text-align: center;
  line-height: 34px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
