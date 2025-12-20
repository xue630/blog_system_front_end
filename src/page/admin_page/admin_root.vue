<template>
    <div class="container">
        <div class="header">
            <div class="profile-photo">
                <button class="img-button">
                    <img src="https://xuebucket1.oss-cn-beijing.aliyuncs.com/cf11895a-158b-4643-97a7-acb30d471314.png" alt="头像" style="height:100%;width:100%;margin:0;padding: 0;border-radius: 50%;">
                </button>
            
            </div>
            <div class="header-select-box">
                <el-select @change="change_on_header" placeholder="">
                    <el-option value="1" label="退出登录"></el-option>
                    <el-option value="2" label="修改头像"></el-option>
                    <el-option value="3" label="修改密码"></el-option>
                </el-select>
            </div>
            <div class="header-chat" @click="chatClick">
                <el-badge :value="message.count">
                    <el-icon size="35"><ChatRound/></el-icon>
                </el-badge>
            </div>
            
            <div class="header-anno">
                <el-button type="primary" @click="openAnnoDialog">
                    <el-icon><Flag /></el-icon>
                        修改公告
                    </el-button>
            </div>
            <!-- 修改公告弹窗 -->
            <el-dialog v-model="annoDialogVisible" title="修改公告" width="50%">
                <el-form :model="annoForm" label-width="80px">
                    <el-form-item label="公告标题">
                        <el-input v-model="annoForm.title" placeholder="请输入公告标题"></el-input>
                    </el-form-item>
                    <el-form-item label="公告内容">
                        <el-input type="textarea" v-model="annoForm.content" :rows="6" placeholder="请输入公告内容"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="annoDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="submitAnno">确定</el-button>
                    </span>
                </template>
            </el-dialog>
            
            <!-- 留言板弹窗 -->
            <el-dialog v-model="messageDialogVisible" title="留言板" width="70%" top="5vh">
                <div class="message-tabs">
                    <el-tabs v-model="activeMessageTab" @tab-click="handleMessageTabClick">
                        <el-tab-pane label="所有消息" name="all">
                            <div class="message-list" v-if="allMessages.length > 0">
                                <div class="message-item" v-for="(msg, index) in allMessages" :key="index" @click="handleMessageClick(msg)">
                                    <div class="message-header">
                                        <span class="message-ip">IP: {{ msg.ip }}</span>
                                        <span class="message-time">{{ formatDate(msg.createTime) }}</span>
                                        <el-tag :type="msg.status === 1 ? 'success' : 'danger'" size="small">
                                            {{ msg.status === 1 ? '已读' : '未读' }}
                                        </el-tag>
                                    </div>
                                    <div class="message-content">{{ msg.content }}</div>
                                </div>
                            </div>
                            <el-empty v-else description="暂无留言"></el-empty>
                        </el-tab-pane>
                        <el-tab-pane label="未读消息" name="unread">
                            <div class="message-list" v-if="unreadMessages.length > 0">
                                <div class="message-item" v-for="(msg, index) in unreadMessages" :key="index" @click="handleMessageClick(msg)">
                                    <div class="message-header">
                                        <span class="message-ip">IP: {{ msg.ip }}</span>
                                        <span class="message-time">{{ formatDate(msg.createTime)}}</span>
                                        <el-tag type="danger" size="small">未读</el-tag>
                                    </div>
                                    <div class="message-content">{{ msg.content }}</div>
                                </div>
                            </div>
                            <el-empty v-else description="暂无未读留言"></el-empty>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-dialog>
        </div>
        <div class="aside">
            <div class="header-title">
                <el-icon><notebook/></el-icon>
                博客管理系统
            
            </div>
            <el-menu :default-active="now_page" class="aside-nav" @select="select">
                <el-menu-item index="1" class="aside-nav-item">
                    <el-icon><house/></el-icon>
                    主页信息
                </el-menu-item>
                <el-menu-item index="2" class="aside-nav-item">
                    <el-icon><document/></el-icon>
                    文章列表
                </el-menu-item>
                <el-menu-item index="3" class="aside-nav-item">
                    <el-icon><folder-opened/></el-icon>
                    分类管理
                </el-menu-item>
                <el-menu-item index="4" class="aside-nav-item">
                    <el-icon><price-tag/></el-icon>
                    标签管理
                </el-menu-item>
                <el-menu-item index="5" class="aside-nav-item">
                    <el-icon><data-line/></el-icon>
                    数据统计
                </el-menu-item>
            </el-menu>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { message,notifyMessage } from '@/util/message_util/message_util';
import { logout, postAnno,getMessageCount, getAllMessages, getNewMessages, updateMessageStatus } from './admin_root_api';
import { getAnnouncement } from '../tourist_page/tourist_api';

export default{
    methods:{
        async chatClick(){
            //点击聊天图标,弹窗显示留言
            this.messageDialogVisible = true;
            // 加载消息数据
            await this.loadMessages();
        },
        async logout(){
            const response = await logout();
            if(response.data.code===0){
                message('success','退出登录成功');//正常退出
                this.$router.push('/login');
            }else{
                message('error',response.data.message);//用户信息过期退出
                this.$router.push('/login');
            }
        },
        select(index){
            if(index==='2'){
                console.log('切换到页面',index);
                this.$router.push('/admin/article')
            }else if(index==='3'){
                console.log('切换到页面',index);
                this.$router.push('/admin/category')
            }else if(index==='4'){
                console.log('切换到页面',index);
                this.$router.push('/admin/tag')
            }else if(index==='5'){
                console.log('切换到页面',index);
                this.$router.push('/admin/data')
            }else{
                console.log('切换到页面',index);
                this.$router.push('/admin')
            }
        },
        async change_on_header(value){
            if(value==="3"){
                console.log("修改密码");
            }else if(value==="2"){
                console.log("修改头像");
            }else{
                console.log("退出登录");
                await this.logout();
            }
        },
        async openAnnoDialog() {
            try {
                const response = await getAnnouncement();
                const annoData = response.data.data || response.data;
                this.annoForm = {
                    title: annoData.title || '',
                    content: annoData.content || ''
                };
                this.annoDialogVisible = true;
            } catch (error) {
                message('error', '获取公告信息失败');
                console.error('获取公告信息失败', error);
            }
        },
        async submitAnno() {
            if (!this.annoForm.title.trim()) {
                message('warning', '公告标题不能为空');
                return;
            }
            if (!this.annoForm.content.trim()) {
                message('warning', '公告内容不能为空');
                return;
            }
            
            try {
                const response = await postAnno(this.annoForm);
                if (response.data.code === 0) {
                    message('success', '公告修改成功');
                    this.annoDialogVisible = false;
                } else {
                    message('error', response.data.message || '公告修改失败');
                }
            } catch (error) {
                message('error', '公告修改失败');
                console.error('公告修改失败', error);
            }
        },
        // 加载留言数据
        async loadMessages() {
            try {
                // 根据当前激活的标签页加载不同的数据
                if (this.activeMessageTab === 'all') {
                    const response = await getAllMessages();
                    if (response.data.code === 0) {
                        this.allMessages = response.data.data || [];
                    } else {
                        message('error', response.data.message || '获取所有消息失败');
                    }
                } else {
                    const response = await getNewMessages();
                    if (response.data.code === 0) {
                        this.unreadMessages = response.data.data || [];
                    } else {
                        message('error', response.data.message || '获取未读消息失败');
                    }
                }
            } catch (error) {
                message('error', '获取消息失败');
                console.error('获取消息失败', error);
            }
        },
        // 处理标签页切换
        handleMessageTabClick() {
            this.loadMessages();
        },
        // 格式化时间
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
        },
        // 处理消息点击事件
        handleMessageClick(msg) {
            // 如果消息已经是已读状态，不执行任何操作
            if (msg.status === 1) {
                return;
            }

            // 弹出确认框
            this.$confirm(`确认将IP为 ${msg.ip} 的消息标记为已读吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    // 调用API更新消息状态
                    const response = await updateMessageStatus(msg.id, 1);
                    if (response.data.code === 0) {
                        message('success', '消息已标记为已读');
                        // 重新加载消息列表
                        await this.loadMessages();
                        // 更新未读消息数量
                        const countResponse = await getMessageCount();
                        this.message.count = countResponse.data.data;
                    } else {
                        message('error', response.data.message || '标记消息失败');
                    }
                } catch (error) {
                    message('error', '标记消息失败');
                    console.error('标记消息失败', error);
                }
            }).catch(() => {
                // 用户取消操作，不执行任何操作
            });
        },


        //websocket相关操作
        initWebSocket() {
            const wsUrl = 'ws://localhost:8080/ws/admin'; // WebSocket服务器地址
            this.websocketStatus.ws = new WebSocket(wsUrl); // 创建WebSocket连接
            this.websocketStatus.ws.onopen = () => {
                console.log('连接成功');
                this.isConnected = true;
            };
      
            // 收到消息时触发
            this.websocketStatus.ws.onmessage = (event) => {
                // event.data 是服务器发来的消息
                const message = event.data;
                console.log('收到消息:', message);
                if(typeof message === 'string' && message==='pong'){
                    // 心跳响应
                    console.log('收到心跳响应');
                    return;
                }
                notifyMessage('info','您有一条新的留言消息!');
                getMessageCount().then(response=>{
                    this.message.count=response.data.data;
                }).catch(error=>{
                    console.error('获取新留言数量失败',error);
                });
            };

            // 连接关闭时触发
            this.websocketStatus.ws.onclose = () => {
                console.log('连接关闭');
                this.isConnected = false;
            };

            // 连接错误时触发
            this.websocketStatus.ws.onerror = (error) => {
                console.error('连接错误:', error);
                this.isConnected = false;
            };
        },
        // 发送消息
        sendMessage(data) {
            if (!this.websocketStatus.ws || !this.isConnected) {
                alert('未连接服务器');
                return;
            }
            this.websocketStatus.ws.send(JSON.stringify(data));
        },
        closeWebSocket() {
            if (this.websocketStatus.ws) {
                this.websocketStatus.ws.close();  // 断开连接
                this.websocketStatus.ws = null;
            }
        },
        startHeartbeat() {
            // 每30秒发送一次心跳
            this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.websocketStatus.ws.send(JSON.stringify('ping'));
            }
            }, 30000);
        },
    
        stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }
        },
        
    },
        
    async mounted(){
        await this.initWebSocket();//建立连接
        this.startHeartbeat(); // 启动心跳
        // 获取当前路由路径
        const currentPath = this.$route.path;
        if(currentPath==="/admin"){
            this.now_page="1";
        }else if(currentPath==="/admin/article"){
            this.now_page="2"
        }else if(currentPath==="/admin/category"){
            this.now_page="3";
        }else if(currentPath==="/admin/tag"){
            this.now_page="4";
        }else{
            this.now_page="4";
        }
        getMessageCount().then(response=>{
            this.message.count=response.data.data;
        }).catch(error=>{
            console.error('获取新留言数量失败',error);
        });
    },
    async beforeUnmount() {
        await this.closeWebSocket(); // 组件销毁时断开连接
        this.stopHeartbeat(); // 停止心跳
    },
    data(){
        return{
            now_page:'1',
            annoDialogVisible: false,
            annoForm: {
                title: '',
                content: ''
            },
            message:{
                count:0,
            },
            // 留言板相关数据
            messageDialogVisible: false,
            activeMessageTab: 'all',
            allMessages: [],
            unreadMessages: [],


            websocketStatus:{
                ws:'',
                connected:false, // WebSocket是否连接
                messages:[]// 存储消息
            },
            heartbeatTimer:null,// 心跳定时器
        }
    }
}
</script>
<style scoped>
    .container{
        min-height:100vh;
        /* background-color: black; */
        /* min-width: 100vh; */
    }
    .header{
        position:absolute;
        background-color: rgb(42, 42, 71);
        top:0%;
        left:17%;
        height:9%;
        width:83%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .aside{
        position:absolute;
        top:0%;
        height:100%;
        left:0%;
        width:17%;
        background-color: rgb(30, 30, 55);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        z-index:100;
        display: flex;
        flex-direction: column;
    }
    .main{
        position:absolute;
        left:17%;
        top:9%;
        width:83%;
        height:90%;
        /* background-color: aquamarine; */
    }
    .aside-nav{
        background-color: transparent;
        width: 100%;
        flex: 1;
        border: none;
    }
    .aside-nav-item:hover{
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    .aside-nav-item.is-active{
        background-color: rgba(70, 130, 220, 0.7);
        color: #fff;
        position: relative;
    }
    .aside-nav-item.is-active::before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background-color: #fff;
    }
    .aside-nav-item{
        display:flex;
        align-items: center;
        font-size: 15px;
        height:56px;
        color: rgba(255, 255, 255, 0.85);
        padding-left: 20px;
        transition: all 0.3s ease;
        margin: 4px 8px;
        border-radius: 6px;
    }
    .aside-nav-item .el-icon{
        margin-right: 10px;
        font-size: 18px;
    }
    .logout-button{
        position: absolute;
        right:1%;
        bottom: 25%;
    }
    .header-title{
        /* 移除背景色 */ 
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        gap: 10px;
        padding: 20px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 10px;
    }
    .header-title .el-icon{
        font-size: 24px;
        color: rgba(255, 255, 255, 0.9);
    }
    .header-chat{
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: white;
    }
    .header-anno{
        position: absolute;
        right: 19%;
        top: 30%;
    }
    .profile-photo{
        height: 40px;
        width: 40px;
    }
    .img-button{
        width: 100%;
        height:100%;
        padding: 0;
        border-radius: 50%;
        border: none;
        background: none;
        cursor: pointer;
    }
    .header-left{
        display: flex;
        align-items: center;
    }
    
    .header-right{
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .header-select-box{
        width: auto;
    }
    
    /* 留言板样式 */
    .message-tabs {
        height: 60vh;
        overflow-y: auto;
    }
    
    .message-list {
        max-height: 55vh;
        overflow-y: auto;
    }
    
    .message-item {
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 8px;
        background-color: #f9f9f9;
        border: 1px solid #eee;
        transition: all 0.3s;
    }
    
    .message-item:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    
    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
    }
    
    .message-content {
        font-size: 15px;
        line-height: 1.5;
        color: #333;
        word-break: break-all;
    }
</style>