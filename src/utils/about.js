import imKey from '@/public/images/imKey.png'
import S1 from '@/public/images/S1.png'
import P1 from '@/public/images/P1.png'
import L1 from '@/public/images/L1_Pro.png'
import Card from '@/public/images/cardBag.png'
import imKeyAll from '@/public/images/imKeyAll.png'
import imKeySafe from '@/public/images/imKeySafe.png'
import imKeyHighAll from '@/public/images/imKeyHighAll.png'
import imKeyTwo from '@/public/images/imKeyTwo.png'
import imKeyCard from '@/public/images/imKeyCard.png'
import imKeySafeCard from '@/public/images/imKeySafeCard.png'
import imKeyHighSafeCard from '@/public/images/imKeyHighSafeCard.png'
// 页面内容模板
export const about = [
    {
        id: 'about-chapter1',
        title: '产品文档',
        content: ``,
        children: [
            {
                id: 'imKey-1',
                title: '产品概览',
                content: `
                    <p>imKey 硬件钱包及组合产品是持有、兑换数字资产最安全和最便捷的方式之一。</p>
                    <table class="table product-table">
                    <tbody>
                    <tr>
                    <td><img src="${imKey}" alt="imKey"></td>
<td>
<p><strong>imKey Pro 硬件钱包</strong></p>
<p>选用 CC EAL6+ 安全芯片，最高等级的安全保障，囤币首选；使用 imKey，你可以随时随地购买、出售和转移您的加密货币。</p>
<p><strong>售价：¥ 688</strong></p>
</td>
</tr>
<tr>
<td><img src="${S1}" alt="密盒S1"></td>
<td>
<p><strong>密盒 S1</strong></p>
<p>性价比最高的助记词保管器，防水、防火、防腐蚀、防冲击且完全离线，隔离一切潜在风险；</p>
<p><strong>售价：¥ 249</strong></p>
</td>
</tr>
<tr>
<td><img src="${P1}" alt="密盒P1"></td>
<td>
<p><strong>密盒 P1</strong></p>
<p>多功能密钥管理器，可支持助记词、私钥及任一符合 ASCII 规范的密码存储，支持二次加密，具备密盒 S1 相同的物理性能，是高阶用户的优选方案。</p>
<p><strong>售价：¥ 499</strong></p>
</td>
</tr>
<tr>
<td><img src="${L1}" alt="imKey 助记词冲压板 L1"></td>
<td>
<p><strong>imKey 助记词冲压板 L1 </strong></p>
<p>imKey 助记词冲压板 L1，安全、易用、经济，小巧精致，防水、防火、防腐蚀，让您的数字资产安全有力保障。</p>
<p><strong>售价：¥ 129</strong></p>
</td>
</tr>
<tr>
<td><img src="${Card}" alt="专属卡包"></td>
<td>
<p><strong>专属卡包</strong></p>
<p>保护钱包避免刮擦，方便保管和携带 imKey，让你随时随地使用。</p>
<p><strong>售价：¥ 99</strong></p>
</td>
</tr>
</tbody>
</table>
                `,
            },
            {
                id: 'imKey-2',
                title: '推荐套餐',
                content:`
                <table class="table product-table">
                <thead>
                <tr>
                <th>套餐名称</th><th>套餐价格</th><th>产品名称</th><th>产品图片</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="3">官方推荐套餐：<a>imKey 全家桶</a></td>
<td rowspan="3"><strong>¥ 899</strong></td>
<td>imKey Pro 硬件钱包</td>
<td rowspan="3"><img src="${imKeyAll}" alt="imKey全家桶"></td>
</tr>
<tr>
<td>密盒 S1</td>
</tr>
<tr>
<td>专属卡包</td>
</tr>
<tr>
<td rowspan="5"><a>imKey 安全礼盒</a></td>
<td rowspan="5"><strong>¥1288</strong></td>
<td>imKey Pro 硬件钱包</td>
<td rowspan="5"><img src="${imKeySafe}" alt="imKey全家桶"></td>
</tr>
<tr>
<td>密盒 S1</td>
</tr>
<tr>
<td>imKey 冲压板 L1</td>
</tr>
<tr>
<td>专属卡包</td>
</tr>
<tr>
<td>黑森林手册</td>
</tr>
<tr>
<td rowspan="3"><a>imKey 高阶全家桶</a></td>
<td rowspan="3"><strong>¥ 1079</strong></td>
<td>imKey Pro 硬件钱包</td>
<td rowspan="3"><img src="${imKeyHighAll}" alt="imKey全家桶"></td>
</tr>
<tr>
<td>密盒 P1</td>
</tr>
<tr>
<td>卡包</td>
</tr>
<tr>
<td><a>imKey 备份包</a></td>
<td><strong>¥ 1239</strong></td>
<td>imKey Pro 硬件钱包 X 2</td>
<td><img src="${imKeyTwo}" alt="imKey全家桶"></td>
</tr>
<tr>
<td rowspan="2"><a>imKey 钱包套件</a></td>
<td rowspan="2"><strong>¥ 758</strong></td>
<td>imKey Pro 硬件钱包</td>
<td rowspan="2"><img src="${imKeyCard}" alt="imKey全家桶"></td>
</tr>
<tr>
<td>专属卡包</td>
</tr>
<tr>
<td rowspan="2"><a>imKey 安全套件</a></td>
<td rowspan="2"><strong>¥ 818</strong></td>
<td>imKey Pro 硬件钱包</td>
<td rowspan="2"><img src="${imKeySafeCard}" alt="imKey全家桶"></td>
</tr>
<tr>
<td>密盒 S1</td>
</tr>
<tr>
<td rowspan="2"><a>imKey 高阶安全套件</a></td>
<td rowspan="2"><strong>¥ 999</strong></td>
<td>imKey Pro 硬件钱包</td>
<td rowspan="2"><img src="${imKeyHighSafeCard}" alt="imKey全家桶"></td>
</tr>
<tr>
<td>密盒 P1</td>
</tr>
</tbody>
</table>`,
            }
        ]
    },
];

export default about;
