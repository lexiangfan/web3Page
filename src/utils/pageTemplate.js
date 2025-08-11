// 页面内容模板 - 复制此文件并重命名为新页面名称
export const pageContents = [
    {
        id: 'part1', // 每个章节必须有唯一ID
        title: '章节标题', // 章节标题
        content: `
      <p>在此处添加章节内容，支持HTML标签</p>
      <h3>支持的HTML元素示例：</h3>
      <ul>
        <li>段落标签 &lt;p&gt;</li>
        <li>标题标签 &lt;h3&gt;, &lt;h4&gt;</li>
        <li>列表标签 &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;</li>
        <li>链接标签 &lt;a&gt;</li>
        <li>代码标签 &lt;code&gt;</li>
        <li>强调标签 &lt;strong&gt;, &lt;em&gt;</li>
      </ul>
    `
    },
    // 可以添加更多章节
    {
        id: 'part2',
        title: '另一个章节',
        content: '<p>更多内容...</p>',
        children: [ // 支持子章节
            {
                id: 'part2-sub1',
                title: '子章节',
                content: '<p>子章节内容</p>'
            }
        ]
    }
];

// 必须使用 default 导出
export default pageContents;
