通过 ContentManager 服务编程方式添加（动态，不建议）
直接调用 contentManager 服务
新建一个JS代码，然后在代码中直接调用服务添加内容：
模板：

import contentManager from '@/services/contentManager.js'

// 添加单个内容
contentManager.addContent({
title: '新内容标题',
content: '<p>这是新内容的HTML内容</p>'
})

// 批量添加内容
contentManager.addContents([
{
title: '内容1',
content: '<p>内容1的HTML</p>'
},
{
title: '内容2',
content: '<p>内容2的HTML</p>'
}
])

特点：
可以在任何地方通过代码添加内容
灵活性高
适合程序化添加内容

在页面中静态添加内容，然后进行上传到GitHub中：
步骤：
创建一个JS文件，在文件中添加内容：
模板：
export const pageContents = [
{
id: 'part1',
title: '什么是Web3？',
content: `
<p>Web3（也称为Web 3.0）是互联网的下一个演化阶段，它基于区块链技术，强调去中心化和用户拥有数据。</p>
<h3>Web3的核心特征：</h3>
<ul>
<li><strong>去中心化：</strong>没有中央权威控制网络</li>
<li><strong>用户拥有数据：</strong>用户控制自己的数字身份和数据</li>
<li><strong>基于区块链：</strong>使用分布式账本技术</li>
<li><strong>加密安全：</strong>通过加密技术保护用户隐私</li>
</ul>
`
},
]
export default pageContents
再创建一个页面，在页面中引入JS文件，并使用JS文件提供的内容