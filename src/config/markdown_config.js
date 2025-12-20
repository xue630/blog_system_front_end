import MarkdownIt from "markdown-it";
import markdownItAnchor from 'markdown-it-anchor';
import hljs from 'highlight.js';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml'; // Vue模板需要XML支持
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';

// 注册所有需要的语言
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml); 
hljs.registerLanguage('vue', xml);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('python', python);  

export const md = new MarkdownIt({
    html:true,         // 允许 HTML 标签
    linkify:true,      // 自动转换链接
    typographer: true, // 美化排版
    breaks: true ,      // 换行转换为 <br>
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                       hljs.highlight(str, { 
                           language: lang, 
                           ignoreIllegals: true 
                       }).value +
                       '</code></pre>';
            } catch (__) {}
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
}).use(markdownItAnchor, {
    level: [1, 2, 3,4,5],
    slugify: generateId,
    // permalink: markdownItAnchor.permalink.headerLink()
    permalink:false
});


function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function catalogue(text){//传入md文本流

    
    // const md = new MarkdownIt();
    md.enable('table');
    const tokens = md.parse(text,{});

    // 提取标题和生成目录
    const catalog = [];
    tokens.forEach((token) => {
  if (token.type === 'heading_open') {
    const level = parseInt(token.tag.substr(1)) // h1 -> 1, h2 -> 2
    const contentToken = tokens[tokens.indexOf(token) + 1]
    
    if (contentToken && contentToken.type === 'inline') {
      catalog.push({
        level: level,
        text: contentToken.content,
        id: generateId(contentToken.content)
      })
    }
  }
})
    return catalog;
}