<template>
    <div>
        <br><br>
        <el-row :gutter="5">
            <el-col :span="12">
                <div class="grid-content bg">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <div class="grid-content-small bg">
                                <div>
                                    <el-progress type="dashboard" :percentage=percentage width=200 stroke-width=15>
                                        <template #default="{ percentage }">
                                            <span class="percentage-value">{{ percentage }}%</span>
                                            <span class="percentage-label">当前模型训练进度</span>
                                        </template>
                                    </el-progress>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content-small bg">
                                <div>
                                    <br><br><br><br>
                                    <el-button type="primary" @click="dialogTableVisible = true">终止训练</el-button>
                                    <el-dialog title="确定要终止训练吗？" v-model="dialogTableVisible" width="30%">
                                        <template #footer>
                                            <span class="dialog-footer">
                                                <el-button type="primary" @click="dialogTableVisible = false, this.$data.percentage = 0;">确认
                                                </el-button>
                                                <el-button @click="dialogTableVisible = false">取消</el-button>
                                            </span>
                                        </template>
                                    </el-dialog>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>

                    <!-- 走马灯 -->
                    <div class="block">
                        <el-carousel height="230px">
                            <el-carousel-item v-for="item in imgList" :key="item.id">
                                <img :src="item.src" class="image">
                            </el-carousel-item>
                        </el-carousel>
                    </div>

                </div>

            </el-col>

            <el-col :span="10" :offset="1">
                <div class="grid-content2 bg">
                    <h3>训练记录</h3>
                    <el-table :data="ReserveData" :show-header="true" style="width: 100%" max-height="500">
                        <el-table-column label="训练序号" prop="tag" width="120"></el-table-column>
                        <el-table-column label="训练时间" prop="time" width="120"></el-table-column>
                        <el-table-column label="训练日期" prop="date"></el-table-column>

                        <el-table-column align="right">
                            <template #default="scope">
                                <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
            imgList: [
                { id: 0, src: require('../assets/1.jpg') },
                { id: 1, src: require('../assets/2.jpg') },
                { id: 2, src: require('../assets/3.jpg') },
            ],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            value1: '',
            dialogTableVisible: false,
            percentage: 86,
            CurrentPNum: 0,
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
    min-height: 450px;
    padding: 6%;
    margin-left: 15px;
}

.grid-content-small {
    border-radius: 20px;
    min-height: 200px;
    min-width: 100px;
    padding: 3%;
}

.grid-content2 {
    border-radius: 20px;
    padding: 1px 30px;
    padding-bottom: 5%;
    min-height: 520px;
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