// 这边需要增加page路由，按顺序来
class PageService {
    constructor() {
        // 初始化默认页面
        this.pages = [
            {
                id: 'home',
                title: '首页',
                path: '/',
                meta: {
                    title: 'Web3 入门必看'
                }
            },
            {
                id: 'page',
                title: '第一章',
                path: '/Page',
                meta: {
                    title: 'Web3 内容第一章'
                }
            },
            {
                id: 'page1',
                title: '第二章',
                path: '/page1',
                meta: {
                    title: '内容第二章'
                }
            },
            {
                id: 'page2',
                title: '第三章',
                path: '/page2',
                meta: {
                    title: '内容第三章'
                }
            },
            {
                id: 'about',
                title: '关于我们',
                path: '/about',
                meta: {
                    title: '关于我们'
                }
            }
        ];
        this.callbacks = [];
    }

    // 获取所有页面
    getPages() {
        return [...this.pages];
    }

    // 添加新页面
    addPage(page) {
        // 确保页面有唯一ID
        if (!page.id) {
            page.id = 'page-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
        }

        this.pages.push(page);
        this.notifySubscribers();
        return page.id;
    }

    // 更新页面
    updatePage(id, updatedPage) {
        const index = this.pages.findIndex(page => page.id === id);
        if (index !== -1) {
            this.pages[index] = { ...this.pages[index], ...updatedPage };
            this.notifySubscribers();
            return true;
        }
        return false;
    }

    // 删除页面
    removePage(id) {
        this.pages = this.pages.filter(page => page.id !== id);
        this.notifySubscribers();
    }

    // 根据路径查找页面
    findPageByPath(path) {
        return this.pages.find(page => page.path === path);
    }

    // 订阅页面变化
    subscribe(callback) {
        this.callbacks.push(callback);
    }

    // 取消订阅
    unsubscribe(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    // 通知所有订阅者
    notifySubscribers() {
        this.callbacks.forEach(callback => callback(this.pages));
    }

    // 发现页面关联的内容文件
    discoverPageContent(pagePath) {
        const contentMap = {
            '/Page': '@/utils/page.js',
            '/page1': '@/utils/page1.js',
            '/page2': '@/utils/page2.js'
        }

        return contentMap[pagePath] || null
    }

    // 获取所有页面及其关联的内容信息
    getPagesWithContentInfo() {
        return this.pages.map(page => ({
            ...page,
            contentFile: this.discoverPageContent(page.path)
        }))
    }
}

export default new PageService();
