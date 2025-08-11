// services/contentLoader.js
class ContentLoader {
    async loadAllPageContents() {
        const pageContents = {};

        try {
            // 使用动态导入确保在构建时正确处理路径
            const modules = {
                '/': () => import('../utils/HomeContents.js'),
                '/page': () => import('../utils/page.js'),
                '/page1': () => import('../utils/page1.js'),
                '/page2': () => import('../utils/page2.js'),
                '/about': () => import('../utils/about.js')
            };

            // 并行加载所有模块
            const loadPromises = Object.entries(modules).map(async ([path, loader]) => {
                try {
                    const module = await loader();
                    const content = module.default || module.pageContents || module.content;

                    if (content) {
                        const titles = {
                            '/': 'Web3 入门必看',
                            '/page': 'Web3 内容第一章',
                            '/page1': '内容第二章',
                            '/page2': '内容第三章',
                            '/about': '产品文档'
                        };

                        pageContents[path] = {
                            content: content,
                            title: titles[path] || '未知页面'
                        };
                    }
                } catch (error) {
                    console.warn(`Failed to load content for ${path}:`, error);
                }
            });

            await Promise.all(loadPromises);
        } catch (error) {
            console.warn('Failed to load page contents:', error);
        }

        return pageContents;
    }
}

export default new ContentLoader();
