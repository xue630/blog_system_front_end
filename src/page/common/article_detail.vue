<template>
    <div class="detail-container">
        <div class="catalog">
            <el-button type="primary" @click="back_article_page">返回文章页</el-button>
            <h1>目录</h1>
            <ul class="toc-list">
                <li v-for="item in catalogue" :key="item.id" :class="'toc-level-' + item.level">
                    <a href="javascript:void(0)" @click="scrollToHeading(item.id)" class="catalog-item">{{ item.text }}</a>
                </li>
            </ul>
        </div>
        <div class="detail-main" v-html="content">
            
        </div>
    </div>
</template>
<script>
import axios from '@/config/axios_config';
import { catalogue, md } from '@/config/markdown_config';
import { StorageHelper } from '@/config/local_storage';

export default{
    data(){
        return{
            content:'',//文章内容
            catalogue:[]//目录列表
        }
    },
    methods:{
        async request_test(){//测试方法，根据文章id获取后端文本流
            const response = await axios.get('common/articleContent',
                {
                    params:{
                        id:StorageHelper.getItem('articleId')
                    }
                }
            );
            this.content = md.render(response.data.data);//请求到md文档json流
            this.catalogue = catalogue(response.data.data);
            console.log('获得文章id',StorageHelper.getItem('articleId'))
            console.log(this.catalogue);
        },
        back_article_page(){
            this.$router.push('/article');
            // window.location.reload();
        },
        scrollToHeading(id) {//点击目录滚动功能
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    },
    mounted(){
       this.request_test();
    }
}
</script>
<style >
@import 'highlight.js/styles/github-dark.css';
.detail-container{
    min-height: 100vh;
    display: flex;
    width: 100%;
}
.catalog{
    width: 19%;
    height: 100vh;
    overflow: auto;
    position: sticky;
    top: 0;
}
.detail-main{
    width: 70%;
    height: 100%;
    padding: 20px 40px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}
/* 代码块样式 */
.hljs{
    margin: 1.5rem 0;
    padding: 1rem;
    border-radius: 6px;
    background-color: #f6f8fa;
    color: #24292e;
    overflow-x: auto;
    font-size: 0.9rem;
    max-height: 400px;
}
/* 图片样式 */
.detail-main img{
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5rem auto;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
}
.detail-main img:hover{
    transform: scale(1.01);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
/* 引用块样式 */
.detail-main blockquote {
    position: relative;
    margin: 1.5rem 0;
    padding: 0.5rem 1.5rem;
    border-left: 4px solid #ddd;
    background-color: #f9f9f9;
    color: #666;
}
/* .main blockquote:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 12px 40px rgba(31, 38, 135, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
} */
.detail-main blockquote::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
    border-radius: 5px 0 0 5px;
}
.detail-main blockquote::after {
    content: "";
    position: absolute;
    top: -15px;
    right: 20px;
    font-size: 120px;
    color: rgba(79, 172, 254, 0.2);
    font-family: Georgia, serif;
    font-style: normal;
    line-height: 1;
}
.detail-main blockquote p {
    margin: 0;
    position: relative;
    z-index: 1;
}
.detail-main blockquote p:last-of-type {
    margin-bottom: 0;
}
/* .hljs code{
    display: flex;
    flex-wrap: wrap;
} */

.detail-main table{
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  width: 1000px;
}
.detail-main th{
  background: #f6f8fa;
  border: 1px solid #dfe2e5;
  padding: 6px 5px;
  font-weight: 600;
}

.detail-main td{
  border: 1px solid #dfe2e5;
  padding: 6px 5px;
}

.detail-main tr:nth-child(2n) {
  background-color: #f6f8fa;
}
/* img {

    width:900px;
    height: 500px;
} */

/*美化目录 */
.catalog-item {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
} 
 .catalog-item{
  display: block;
  padding: 12px 20px;
  margin: 8px 0;
  background: #f8f9fa;
  border-left: 4px solid #4e73df;
  border-radius: 0 8px 8px 0;
  text-decoration: none;
  color: #2d3748;
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
  position: relative;
}
.toc-level-2 { margin-left: 20px; border-left-color: #6c757d; }
.toc-level-3 { margin-left: 40px; border-left-color: #858796; }
.toc-level-4 { margin-left: 60px; border-left-color: #b7b9cc; }
.toc-level-5 { margin-left: 80px; border-left-color: #d1d3e2; }
.catalog-item:hover {
  background: #4e73df;
  color: white;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(78, 115, 223, 0.3);
}
.catalog-item:active {
  background: #4e73df;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(78, 115, 223, 0.4);
}


.toc-list{/*去除表格样式 */
  list-style-type: none; /* 关键属性 */
  padding-left: 0;
}

/* 美化文章内容中的列表 */
.detail-main ul {
  margin: 1rem 0;
  padding-left: 2rem;
}
.detail-main ul li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

/* 文章内容标题和段落样式 */
.detail-main h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 1.8rem 0 1rem;
  color: #1a202c;
  line-height: 1.3;
  position: relative;
  padding-bottom: 0.5rem;
}
.detail-main h1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 3px;
}
.detail-main h2 {
  font-size: 1.9rem;
  font-weight: 600;
  margin: 1.6rem 0 0.9rem;
  color: #2d3748;
  line-height: 1.35;
}
.detail-main h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 1.4rem 0 0.8rem;
  color: #2d3748;
  line-height: 1.4;
}
.detail-main h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.2rem 0 0.7rem;
  color: #4a5568;
  line-height: 1.45;
}
.detail-main h5 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1rem 0 0.6rem;
  color: #4a5568;
  line-height: 1.5;
}
.detail-main p {
  font-size: 1rem;
  line-height: 1.7;
  margin: 1rem 0;
  color: #2d3748;
  text-align: justify;
}

/* 有序列表样式 */
.detail-main ol {
  margin: 1rem 0;
  padding-left: 2rem;
}
.detail-main ol li {
  margin: 0.5rem 0;
  line-height: 1.6;
}
</style>