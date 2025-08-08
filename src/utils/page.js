export const pageContents = [
    {
        id: 'chapter1',
        title: '第一章 Web3 基础概念',
        content: '',
        children: [
            {
                id: 'section1-1',
                title: '1.1 什么是 Web3',
                content: `
          <p>Web3 是互联网的下一个演化阶段，它基于区块链技术，强调去中心化和用户拥有数据。</p>
          <h4>Web3的核心特征：</h4>
          <ul>
            <li><strong>去中心化：</strong>没有中央权威控制网络</li>
            <li><strong>用户拥有数据：</strong>用户控制自己的数字身份和数据</li>
            <li><strong>基于区块链：</strong>使用分布式账本技术</li>
            <li><strong>加密安全：</strong>通过加密技术保护用户隐私</li>
          </ul>
        `
            },
            {
                id: 'section1-2',
                title: '1.2 区块链基础',
                content: `
          <p>区块链是一种分布式数据库技术，它将数据存储在按时间顺序链接的区块中。</p>
          <h4>区块链的关键概念：</h4>
          <ul>
            <li><strong>区块：</strong>包含一组交易记录的数据结构</li>
            <li><strong>链：</strong>通过密码学方法链接的区块序列</li>
            <li><strong>共识机制：</strong>网络节点就区块有效性达成一致的算法</li>
            <li><strong>智能合约：</strong>自动执行的数字化合约</li>
          </ul>
        `
            },
            {
                id: 'section1-3',
                title: '1.3 去中心化应用',
                content: `
          <p>去中心化应用（DApps）是构建在区块链网络上的应用程序。</p>
          <h4>DApps 的特点：</h4>
          <ul>
            <li><strong>开源：</strong>代码公开透明，社区可以审查和贡献</li>
            <li><strong>去中心化：</strong>运行在P2P网络上，没有中心控制点</li>
            <li><strong>加密货币：</strong>使用加密代币来激励网络参与者</li>
            <li><strong>协议：</strong>使用区块链作为应用协议来管理状态</li>
          </ul>
        `
            }
        ]
    },
    {
        id: 'chapter2',
        title: '第二章 智能合约开发',
        content: '',
        children: [
            {
                id: 'section2-1',
                title: '2.1 Solidity 语言基础',
                content: `
          <p>Solidity 是以太坊区块链上最流行的智能合约编程语言。</p>
          <h4>Solidity 基本语法：</h4>
          <ul>
            <li><strong>版本声明：</strong>pragma solidity ^0.8.0;</li>
            <li><strong>合约定义：</strong>contract MyContract { ... }</li>
            <li><strong>状态变量：</strong>uint256 public myNumber;</li>
            <li><strong>函数定义：</strong>function myFunction() public { ... }</li>
          </ul>
        `
            },
            {
                id: 'section2-2',
                title: '2.2 合约部署与测试',
                content: `
          <p>智能合约需要经过编译、部署和测试才能在区块链上运行。</p>
          <h4>部署流程：</h4>
          <ul>
            <li><strong>编译：</strong>使用 Solidity 编译器将代码转换为字节码</li>
            <li><strong>部署：</strong>通过交易将合约部署到区块链网络</li>
            <li><strong>交互：</strong>通过合约地址与已部署的合约进行交互</li>
          </ul>
        `
            },
            {
                id: 'section2-3',
                title: '2.3 安全最佳实践',
                content: `
          <p>智能合约的安全性至关重要，因为一旦部署就很难修改。</p>
          <h4>安全建议：</h4>
          <ul>
            <li><strong>输入验证：</strong>始终验证外部输入</li>
            <li><strong>避免重入攻击：</strong>使用检查-生效-交互模式</li>
            <li><strong>限制气体消耗：</strong>避免可能导致气体耗尽的操作</li>
            <li><strong>权限控制：</strong>实现适当的访问控制机制</li>
          </ul>
        `
            }
        ]
    },
    {
        id: 'chapter3',
        title: '第三章 前端集成',
        content: '',
        children: [
            {
                id: 'section3-1',
                title: '3.1 Web3.js 使用指南',
                content: `
          <p>Web3.js 是与以太坊区块链交互的 JavaScript 库。</p>
          <h4>基本用法：</h4>
          <ul>
            <li><strong>初始化：</strong>const web3 = new Web3(provider);</li>
            <li><strong>账户操作：</strong>web3.eth.getAccounts()</li>
            <li><strong>合约交互：</strong>new web3.eth.Contract(abi, address)</li>
          </ul>
        `
            },
            {
                id: 'section3-2',
                title: '3.2 钱包连接',
                content: `
          <p>现代 Web3 应用需要与用户钱包进行连接以执行交易。</p>
          <h4>连接流程：</h4>
          <ul>
            <li><strong>检测提供者：</strong>window.ethereum</li>
            <li><strong>请求访问：</strong>ethereum.request({ method: 'eth_requestAccounts' })</li>
            <li><strong>监听变化：</strong>ethereum.on('accountsChanged', handler)</li>
          </ul>
        `
            },
            {
                id: 'section3-3',
                title: '3.3 用户界面设计',
                content: `
          <p>Web3 应用的用户界面需要考虑区块链特有的交互模式。</p>
          <h4>设计原则：</h4>
          <ul>
            <li><strong>状态反馈：</strong>清晰显示交易状态和网络连接</li>
            <li><strong>钱包集成：</strong>无缝的钱包连接和切换体验</li>
            <li><strong>气体费用：</strong>透明显示交易成本</li>
            <li><strong>响应式设计：</strong>适配不同设备和屏幕尺寸</li>
          </ul>
        `
            }
        ]
    },
    {
        id: 'chapter4',
        title: '第四章 高级主题',
        content: '',
        children: [
            {
                id: 'section4-1',
                title: '4.1 跨链技术',
                content: `
          <p>跨链技术允许不同区块链网络之间的资产和数据交换。</p>
          <h4>主要方案：</h4>
          <ul>
            <li><strong>原子交换：</strong>无需信任的跨链资产交换</li>
            <li><strong>中继链：</strong>专门用于连接不同区块链的网络</li>
            <li><strong>侧链：</strong>与主链双向锚定的独立区块链</li>
          </ul>
        `
            },
            {
                id: 'section4-2',
                title: '4.2 Layer2 解决方案',
                content: `
          <p>Layer2 解决方案旨在提高区块链的可扩展性和交易速度。</p>
          <h4>主流技术：</h4>
          <ul>
            <li><strong>状态通道：</strong>链下交易，定期在链上结算</li>
            <li><strong>侧链：</strong>独立的区块链，与主链交互</li>
            <li><strong>Rollups：</strong>批量处理交易并在主链上发布</li>
          </ul>
        `
            },
            {
                id: 'section4-3',
                title: '4.3 NFT 开发',
                content: `
          <p>NFT（非同质化代币）是表示独特数字资产的代币标准。</p>
          <h4>关键技术：</h4>
          <ul>
            <li><strong>ERC-721：</strong>最常见的 NFT 标准</li>
            <li><strong>元数据：</strong>存储 NFT 相关信息的 URI</li>
            <li><strong>市场集成：</strong>与 OpenSea 等平台的集成</li>
          </ul>
        `
            }
        ]
    }
];

export default pageContents;
