<template>
  <el-container class="home-container">
    <!-- head -->
    <el-header>
      <div>
        <img src="" alt="">
        <h2>
          <i class="el-icon-help"></i>
          <span>可视化平台</span>
        </h2>axios
      </div>

    </el-header>

    <el-header style="  justify-content: right;">
      <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
        background-color="#303133" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">section1</el-menu-item>
          <el-menu-item index="2-2">section2</el-menu-item>
          <el-menu-item index="2-3">section3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">section4</template>
            <el-menu-item index="2-4-1">section1</el-menu-item>
            <el-menu-item index="2-4-2">section2</el-menu-item>
            <el-menu-item index="2-4-3">section3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="1">进程管理</el-menu-item>
        <el-menu-item index="3">消息中心</el-menu-item>
        <el-menu-item index="4">处理中心</el-menu-item>
        <el-menu-item index="5">文件管理</el-menu-item>
      </el-menu>
    </el-header>
    <!-- body -->
    <el-container>
      <!-- aside -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :router="true"
          :collapse="iscollapse" :collapse-transition="false">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group>
              <template slot="title">3D模型文件</template>
              <el-menu-item index="ElSubmenu.path" @click="update">上传</el-menu-item>
              <el-menu-item index="1-2">下载</el-menu-item>
              <el-menu-item index="1-3">浏览</el-menu-item>
              <el-menu-item index="1-4">删除</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="应力数据文件">
              <el-menu-item index="1-5">批量上传</el-menu-item>
              <el-menu-item index="1-6">批量删除</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-s-opportunity"></i>
            <span slot="title">训练与测试</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">应力场可视化</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">统计结果绘制</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- main -->

      <el-main>

        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
          :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="10" :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">单个文件不超过500kb</div>
        </el-upload>

        <div>
          <img src="./assets/test.png" alt="" height="1000px">
        </div>

      </el-main>

    </el-container>
  </el-container>

</template>

<script>

export default {
  name: 'app',

  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      //是否折叠
      iscollapse: true,

      //上传文件
      fileList: []
    };
  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    //点击按钮，切换菜单折叠
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    },
    update() {

    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  }

}
</script>


<style  scoped>
.home-container {
  height: 700px;

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
  background-color: rgb(255, 255, 255);
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
