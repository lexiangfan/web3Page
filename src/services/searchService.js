// services/searchService.js
class SearchService {
    constructor() {
        this.contentIndex = [];
        this.callbacks = [];
        this.searchCache = new Map();
        this.pageContents = new Map(); // 存储每个页面的内容
    }

    // 初始化整个应用的内容索引
    initializeAllContents(pageContentsMap) {
        this.contentIndex = [];
        this.pageContents = new Map();

        // 遍历所有页面内容
        Object.entries(pageContentsMap).forEach(([path, {content, title}]) => {
            this.pageContents.set(path, content);
            this.addContents(content, path, title);
        });

        this.clearCache();
        this.notifySubscribers();
    }

    // 添加页面内容到索引
    addContents(contents, pagePath, pageTitle = '') {
        // 移除旧的路径相关内容
        this.contentIndex = this.contentIndex.filter(item => item.pagePath !== pagePath);

        // 递归函数处理所有层级的内容
        const processContent = (content, pagePath, pageTitle) => {
            // 只有包含实际内容的条目才加入索引
            if (content.content && content.content.trim() !== '') {
                this.contentIndex.push({
                    ...content,
                    pagePath,
                    pageTitle: pageTitle || this.getPageTitle(pagePath),
                    searchableText: `${content.title} ${this.stripHtml(content.content || '')}`.toLowerCase()
                });
            }

            // 递归处理子内容
            if (content.children && Array.isArray(content.children)) {
                content.children.forEach(child => processContent(child, pagePath, pageTitle));
            }
        };

        // 添加新内容
        if (Array.isArray(contents)) {
            contents.forEach(content => processContent(content, pagePath, pageTitle));
        } else {
            processContent(contents, pagePath, pageTitle);
        }

        this.pageContents.set(pagePath, contents);
        this.clearCache();
        this.notifySubscribers();
    }

    // 获取页面标题
    getPageTitle(path) {
        const pageTitles = {
            '/page': 'Web3 内容第一章',
            '/page1': '内容第二章',
            '/page2': '内容第三章',
        };
        return pageTitles[path] || '未知页面';
    }

    // 搜索方法（带缓存和相关性评分）
    search(query) {
        if (!query.trim()) return [];

        const cacheKey = query.toLowerCase();
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }

        const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);

        const results = this.contentIndex
            .filter(item => {
                // 使用所有搜索词进行匹配（AND逻辑）
                return terms.every(term => item.searchableText.includes(term));
            })
            .map(item => {
                const preview = this.generatePreview(item.content || '', query);
                // 添加相关性评分
                const score = this.calculateRelevanceScore(item, terms);
                return {
                    ...item,
                    preview,
                    score
                };
            })
            // 按相关性排序
            .sort((a, b) => b.score - a.score)
            .slice(0, 20); // 限制返回结果数量

        this.searchCache.set(cacheKey, results);
        return results;
    }

    // 计算相关性评分
    calculateRelevanceScore(item, terms) {
        let score = 0;
        const text = item.searchableText;

        terms.forEach(term => {
            // 标题匹配权重更高
            const titleMatches = (item.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
            score += titleMatches * 10;

            // 内容匹配
            const contentMatches = (text.match(new RegExp(term, 'g')) || []).length;
            score += contentMatches;

            // 精确匹配加分
            if (text.includes(term)) {
                score += 5;
            }
        });

        return score;
    }

    // 生成搜索结果预览
    generatePreview(content, term) {
        // 处理空内容
        if (!content) return '';

        const cleanContent = this.stripHtml(content);
        const index = cleanContent.toLowerCase().indexOf(term.toLowerCase());

        if (index === -1) return cleanContent.substring(0, 80) + '...';

        const start = Math.max(0, index - 30);
        const end = Math.min(cleanContent.length, index + term.length + 30);
        let preview = cleanContent.substring(start, end);

        if (start > 0) preview = '...' + preview;
        if (end < cleanContent.length) preview = preview + '...';

        // 高亮搜索词
        const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
        return preview.replace(regex, '<strong>$1</strong>');
    }

    // 移除HTML标签的辅助函数
    stripHtml(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // 转义正则表达式特殊字符
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 清空缓存
    clearCache() {
        this.searchCache.clear();
    }

    // 订阅索引变化
    subscribe(callback) {
        this.callbacks.push(callback);
    }

    // 取消订阅
    unsubscribe(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    // 通知所有订阅者
    notifySubscribers() {
        this.callbacks.forEach(callback => callback(this.contentIndex));
    }

    // 获取当前索引内容（用于调试）
    getContentIndex() {
        return this.contentIndex;
    }

    // 获取特定页面的内容
    getPageContent(pagePath) {
        return this.pageContents.get(pagePath);
    }
}

export default new SearchService();
