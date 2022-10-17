<template>
  <div>
    <br><br>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="grid-content bg"><h3>生成进度</h3>
          <el-row :gutter="10">
            <el-col :span="14">
              <div class="grid-content-small bg">
                <div>
                  <el-progress type="dashboard" :percentage=percentage width=200 stroke-width=15>
                    <template #default="{ percentage }">
                      <span class="percentage-value">{{ percentage }}%</span>
                      <span class="percentage-label">当前数据生成进度</span>
                    </template>
                  </el-progress>
                </div>
              </div>
            </el-col>
            <div class="grid-content-mini bg">
              <el-col :span="12">
                <el-row>
                  <el-button type="success" @click="startCreate"><el-icon><SwitchButton /></el-icon>开始仿真</el-button>
                </el-row>
                <el-row>
                  <el-button type="danger" @click="dialogTableVisible = true"><el-icon><SwitchButton /></el-icon>终止仿真</el-button>
                </el-row>
                <el-row>
                  <el-button type="primary"><el-icon><RefreshRight /></el-icon>刷新进度</el-button>
                </el-row>
              </el-col>
              <el-dialog title="确定要终止仿真吗？" v-model="dialogTableVisible" width="30%">
                <template #footer>
                      <span class="dialog-footer">
                        <el-button type="primary" @click="dialogTableVisible = false, this.$data.percentage = 0;">确认</el-button>
                        <el-button @click="dialogTableVisible = false">取消</el-button>
                      </span>
                </template>
              </el-dialog>
            </div>
            <div class="grid-content-upload bg">
              <el-row :span="16">
                <div class="upload-item">
                  <el-upload class="upload-demo"
                             action="https://jsonplaceholder.typicode.com/posts/"
                             :on-exceed="handleExceed"
                             :file-list="DataFile">
                    <el-button size="large" type="primary"><el-icon><Upload /></el-icon>选择3D模型文件</el-button>
                  </el-upload>
                </div>
                <div class="upload-item">
                  <el-upload class="upload-demo"
                             action="https://jsonplaceholder.typicode.com/posts/"
                             :on-exceed="handleExceed"
                             :file-list="ModelFile">
                    <el-button size="large" type="primary"><el-icon><Upload /></el-icon>选择训练模型文件</el-button>
                  </el-upload>
                </div>
                <div class="download-item">
                  <el-upload class="upload-demo"
                             action="https://jsonplaceholder.typicode.com/posts/"
                             multiple
                             :limit="3" :on-exceed="handleExceed"
                             :file-list="modelFile">
                    <el-button size="large" type="warning" @click="downloadModel"><el-icon><Download /></el-icon>下载生成数据</el-button>
                  </el-upload>
                </div>
              </el-row>
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      tableData: [],
      ReserveData: [
        {
          tag: '00001',
          date: '08-15',
          time: '16:30'
        },
        {
          tag: '00002',
          date: '08-16',
          time: '17:52'
        },
        {
          tag: '00003',
          date: '08-16',
          time: '15:36'
        }
      ],
      value1: '',
      dialogTableVisible: false,
      percentage: 86,
      CurrentPNum: 0,
      DataFile:[],
      ModelFile:[],
    }
  },
  mounted() {
    //页面建立时获取当前训练进度
    axios.get('http://localhost:8080/Num').then((res) => {
      console.log(res)
      this.$data.CurrentPNum = res.data.number
      this.$data.percentage = (this.$data.CurrentPNum / 30).toFixed(1)
      this.$data.tableData = res.data.notetable
      console.log(this.$data.percentage)
    })

  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    startCreate(){
      this.$confirm('您还未选择3D模型文件', '提示', {
        type: 'warning'
      })
    },
    //下载模型（通过接口获取到的是文件流的形式，然后前端再利用Bolb来读取文件流）
    downloadModel() {
      axios.get('http://localhost:8080/Num')
          .then((res) => { // 接口
            console.log(res);
            if (!res.data) {
              return;
            }
            let name = "";
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8",
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a"); //创建a标签
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", name); // 设置文件 name
            document.body.appendChild(aLink);
            aLink.click(); //自执行下载
            document.body.removeChild(aLink); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          })
          .catch((error) => {});
    },
  }

}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 20px;
}

.bg {
  background: #fff;
}

.bg2 {
  background: #a4aab6;
}

.big-number {
  font-size: 50px;
  font-weight: bold;
  color: #99a9bf;
}

.grid-content {
  border-radius: 20px;
  min-height: 400px;
  padding: 1% 6%;
  margin-left: 15px;
}

.grid-content-small {
  border-radius: 20px;
  min-height: 200px;
  min-width: 100px;
  padding: 20px 30px;
}
.grid-content-mini {
  border-radius: 20px;
  min-height: 200px;
  min-width: 100px;
  padding: 50px 0 0;
}
.grid-content-upload {
  min-width: 100px;
  padding: 1% 0%;
}
.upload-item{
  margin-right: 30px
}
.el-icon{
  margin-right: 5px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

a {
  text-decoration: none;
  color: #004E90;
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 35px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}


.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

img {
  max-width: 100%;
  height: auto;
}
</style>