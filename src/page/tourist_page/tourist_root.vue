<template>
    <div class="container">
        <div class="header">         
                <el-menu :default-active="now_page" mode="horizontal" class="header-nav" @select="select">
                    <el-menu-item index="1">首页</el-menu-item>
                    <el-menu-item index="2">文章</el-menu-item>
                    <el-menu-item index="3">关于我</el-menu-item>
                </el-menu>
                <div class="anno">
                    <el-button type="primary" @click="annoclick">
                        <el-icon><Flag /></el-icon>
                        公告
                    </el-button>
                </div>
                <el-dialog v-model="showDialog" >
                    <div style="text-align: center;">{{AnnoVO.title}}</div>
                    <br/>
                    <div>{{AnnoVO.content}}</div>
                    <br/>
                    <br/>
                    <div style="text-align: right;">{{AnnoVO.owner}}发布于:{{formatDate(AnnoVO.createTime)}}</div>
                    <template #footer>
                            <el-button type="primary" @click="anno_dialog_confirm">确定</el-button>
                        </template>
                </el-dialog>
        </div>
        <!-- 主要展示区 -->
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
    <div class="bottom">
        <div class="bottom-icp">
            <el-link href="https://beian.miit.gov.cn/" target="_blank" style="color: white;">苏ICP备2025220640号-1</el-link>
        </div>
            
            
        <div>
            <img src="./备案图标.png" alt="备案图标" style="width: 20px; height: 20px;">
            <a style="color:white" href="https://beian.mps.gov.cn/#/query/webSearch?code=32131102000933" rel="noreferrer" target="_blank">苏公网安备32131102000933号</a>
        </div>
        </div>
</template>
<script>
import { getAnnouncement } from './tourist_api';


    export default{
        methods:{
            async annoclick(){
                const response = await getAnnouncement();
                this.AnnoVO=response.data.data;
                console.log('公告信息',this.AnnoVO);
                this.showDialog=true;
            },
            anno_dialog_confirm(){
                this.showDialog=false;
            },
            select(index){
                if(index==='2'){
                    console.log('切换到文章页',index);
                    this.$router.push('/article');
                }else if(index==='3'){
                    console.log('切换到关于页',index);
                    this.$router.push('/about');
                }else{
                    console.log('切换到首页',index);
                    this.$router.push('/');
                }
            },
            formatDate(dateString) {
            // 格式化日期
            if (!dateString) return '';
            
            // 直接使用字符串分割处理
            // 格式为 "yyyy-MM-dd HH:mm:ss" 或类似格式
            let dateParts = null;
            let count = -1;
            let i="";
            dateString.forEach(element =>{
                if(count===2){
                    i=' ';
                }else if(count<=2){
                    i='-'
                }else{
                    i=':'
                }
                if(dateParts===null){
                    dateParts=element;
                }else{
                    dateParts=dateParts+i+element;
                }
                count++;
            });
            
            return dateParts; // 直接返回日期部分
        }
        },
        data(){
            return{
                now_page:'1',
                showDialog:false,

                AnnoVO: {}
            }
        },
        mounted(){
        // 获取当前路由路径
        const currentPath = this.$route.path;
        if(currentPath==="/"){
            this.now_page="1";
        }else if(currentPath==="/article"){
            this.now_page="2"
        }else{
            this.now_page="3";
        }
    }  
    }
</script>
<style scoped>
    .container{
        min-height:100vh;
        /* background-color: rgb(146, 143, 143); */
    }
    .header{
        position: sticky;
        z-index:1000;
        top:0%;
        height:10%;
        width:100%;
        /* background-color: rgb(238, 244, 239); */
        /* border: red 8px solid; */
    }
    .anno{
        position:absolute;
        right: 9%;
        top: 15%;
    }
    .main{
        position:absolute;
        top:8%;
        width:100%;
        height:100%;
        /* background-color: aquamarine; */
    }
    .header-nav{
        /* background-color: antiquewhite; */
        width:100%;
        justify-content: center;
        /* height:100%; */

    }
    .bottom{
        position:absolute;
        background-color: #2c3e50;
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        flex-wrap: wrap;
    }
    .bottom-icp{
        /* background-color: aqua; */
        display: flex;
        width: 100%;
        text-align: center;
        display: block;
    }
</style>