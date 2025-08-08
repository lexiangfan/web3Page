// services/contentLoader.js
class ContentLoader {
    constructor() {
        // 定义页面内容映射关系
        this.pageContentMap = {
            '/': () => import('@/utils/page.js'),
            '/Page': () => import('@/utils/page.js'),
            '/page1': () => import('@/utils/page1.js'),
            '/page2': () => import('@/utils/page2.js'),
        };

        // 页面标题映射
        this.pageTitles = {
            '/': 'Web3 入门必看',
            '/Page': 'Web3 内容第一章',
            '/page1': '内容第二章',
            '/page2': '内容第三章',
        };
    }

    // 获取所有已知页面路径
    getAllPagePaths() {
        return Object.keys(this.pageContentMap);
    }

    // 加载特定页面的内容
    async loadPageContent(path) {
        const loader = this.pageContentMap[path];
        if (!loader) {
            console.warn(`No content loader found for path: ${path}`);
            return null;
        }

        try {
            const module = await loader();
            return {
                content: module.default || module.pageContents,
                title: this.pageTitles[path] || path
            };
        } catch (error) {
            console.error(`Failed to load content for ${path}:`, error);
            return null;
        }
    }

    // 批量加载所有页面内容
    async loadAllPageContents() {
        const results = {};
        const paths = this.getAllPagePaths();

        for (const path of paths) {
            const content = await this.loadPageContent(path);
            if (content) {
                results[path] = content;
            }
        }

        return results;
    }
}

export default new ContentLoader();
