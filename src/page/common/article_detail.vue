<template>
    <div class="container">
        <div class="catalog">
            <el-button type="primary" @click="back_article_page">返回文章页</el-button>
            <h1>目录</h1>
            <ul class="toc-list">
                <li v-for="item in catalogue" :key="item.id" :class="'toc-level-' + item.level">
                    <a href="javascript:void(0)" @click="scrollToHeading(item.id)" class="catalog-item">{{ item.text }}</a>
                </li>
            </ul>
        </div>
        <div class="main" v-html="content">
            
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
.container{
    min-height: 100vh;
    display: flex;
    width: 100%;
    /* background-color: aqua; */
}
.catalog{
    width: 19%;
    /* background-color: azure; */
    height: 100vh;
    overflow: auto;
    position: sticky;
    top: 0;
}
.main{
    width: 81%;
    height: 100%;
    /* background-color: beige; */
}
/* 直接选择markdown-it生成的表格 */
.hljs{
    position:relative;
    left: 10%;
    width :80%;
    max-height: 400px;
    overflow: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.main img{
    max-width: 100%;
    height: auto;
    display:block;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.main blockquote {
    position: relative;
    margin: 2rem 0;
    padding: 1.5rem 2rem;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 
        0 8px 32px rgba(31, 38, 135, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    color: #2c3e50;
    font-style: italic;
    line-height: 1.6;
    overflow: hidden;
    transition: all 0.3s ease;
}
.main blockquote:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 12px 40px rgba(31, 38, 135, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.main blockquote::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
    border-radius: 5px 0 0 5px;
}
.main blockquote::after {
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
.main blockquote p {
    margin: 0;
    position: relative;
    z-index: 1;
}
.main blockquote p:last-of-type {
    margin-bottom: 0;
}
/* .hljs code{
    display: flex;
    flex-wrap: wrap;
} */

table{
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  width: 1000px;
}
th{
  background: #f6f8fa;
  border: 1px solid #dfe2e5;
  padding: 6px 5px;
  font-weight: 600;
}

td{
  border: 1px solid #dfe2e5;
  padding: 6px 5px;
}

tr:nth-child(2n) {
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
.main ul {
  position: relative;
  margin: 1.5rem 0;
  padding: 1.2rem 1.2rem 1.2rem 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(31, 38, 135, 0.08);
  list-style: none;
  transition: all 0.3s ease;
}
.main ul:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(31, 38, 135, 0.12);
}
.main ul li {
  position: relative;
  padding: 0.5rem 0;
  color: #2c3e50;
  line-height: 1.6;
  transition: all 0.2s ease;
}
.main ul li::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  top: 0.8rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}
.main ul li:hover {
  color: #4facfe;
  transform: translateX(5px);
}
.main ul li:hover::before {
  box-shadow: 0 0 0 5px rgba(79, 172, 254, 0.3);
}

/* 文章内容标题和段落样式 */
.main h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 1.8rem 0 1rem;
  color: #1a202c;
  line-height: 1.3;
  position: relative;
  padding-bottom: 0.5rem;
}
.main h1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 3px;
}
.main h2 {
  font-size: 1.9rem;
  font-weight: 600;
  margin: 1.6rem 0 0.9rem;
  color: #2d3748;
  line-height: 1.35;
}
.main h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 1.4rem 0 0.8rem;
  color: #2d3748;
  line-height: 1.4;
}
.main h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.2rem 0 0.7rem;
  color: #4a5568;
  line-height: 1.45;
}
.main h5 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1rem 0 0.6rem;
  color: #4a5568;
  line-height: 1.5;
}
.main p {
  font-size: 1rem;
  line-height: 1.7;
  margin: 1rem 0;
  color: #2d3748;
  text-align: justify;
}

/* 美化文章内容中的有序列表 */
.main ol {
  position: relative;
  margin: 1.5rem 0;
  padding: 1.2rem 1.2rem 1.2rem 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(31, 38, 135, 0.08);
  list-style: none;
  counter-reset: item;
  transition: all 0.3s ease;
}
.main ol:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(31, 38, 135, 0.12);
}
.main ol li {
  position: relative;
  padding: 0.5rem 0;
  color: #2c3e50;
  line-height: 1.6;
  counter-increment: item;
  transition: all 0.2s ease;
}
.main ol li::before {
  content: counter(item);
  position: absolute;
  left: -1.8rem;
  top: 0.5rem;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.4rem;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}
.main ol li:hover {
  color: #667eea;
  transform: translateX(5px);
}
.main ol li:hover::before {
  box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.3);
}
</style>