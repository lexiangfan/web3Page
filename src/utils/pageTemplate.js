//页面内容模板
export const pageTemplate = [
    {
        id: 'pageTemplate-chapter1',
        title: '新页面第一章',
        content: '',
        children: [
            {
                id: 'new-section1-1',
                title: '1.1 新内容介绍',
                content: `
          <p>这是新内容的介绍</p>
          <h4>主要内容：</h4>
          <ul>
            <li><strong>要点一：</strong>详细说明</li>
            <li><strong>要点二：</strong>详细说明</li>
          </ul>
        `
            },
            {
                id: 'pageTemplate-section1-2',
                title: '1.2 更多内容',
                content: `
          <p>这里是更多内容</p>
          <h4>详细信息：</h4>
          <ul>
            <li><strong>细节一：</strong>具体描述</li>
            <li><strong>细节二：</strong>具体描述</li>
          </ul>
        `
            }
        ]
    },
    {
        id: 'page2-chapter2',
        title: '新页面第二章',
        content: '',
        children: [
            {
                id: 'page2-section2-1',
                title: '2.1 实践指南',
                content: `
          <p>实践操作指南</p>
          <h4>步骤：</h4>
          <ol>
            <li>第一步操作说明</li>
            <li>第二步操作说明</li>
            <li>第三步操作说明</li>
          </ol>
        `
            }
        ]
    }
];

export default pageTemplate;
