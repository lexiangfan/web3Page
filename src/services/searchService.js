// src/services/searchService.js
class SearchService {
    constructor() {
        this.contentIndex = []
        this.callbacks = []
        this.searchCache = new Map()
    }

    // 初始化内容索引
    initializeIndex(contents, pagePath = '/Page') {
        this.contentIndex = []

        // 递归函数处理所有层级的内容
        const processContent = (content, pagePath) => {
            // 只有包含实际内容的条目才加入索引
            if (content.content && content.content.trim() !== '') {
                this.contentIndex.push({
                    ...content,
                    pagePath, // 添加页面路径信息
                    searchableText: `${content.title} ${this.stripHtml(content.content || '')}`.toLowerCase()
                })
            }

            // 递归处理子内容
            if (content.children && Array.isArray(content.children)) {
                content.children.forEach(child => processContent(child, pagePath))
            }
        }

        contents.forEach(content => processContent(content, pagePath))

        this.clearCache()
        this.notifySubscribers()
    }

    // 搜索方法（带缓存）
    search(query) {
        if (!query.trim()) return []

        const cacheKey = query.toLowerCase()
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey)
        }

        const term = query.toLowerCase()
        const results = this.contentIndex
            .filter(item => item.searchableText.includes(term))
            .map(item => {
                const preview = this.generatePreview(item.content || '', term)
                return {
                    ...item,
                    preview
                }
            })

        // 缓存结果
        this.searchCache.set(cacheKey, results)
        return results
    }

    // 生成搜索结果预览
    generatePreview(content, term) {
        // 处理空内容
        if (!content) return ''

        const cleanContent = this.stripHtml(content)
        const index = cleanContent.toLowerCase().indexOf(term.toLowerCase())

        if (index === -1) return cleanContent.substring(0, 80) + '...'

        const start = Math.max(0, index - 30)
        const end = Math.min(cleanContent.length, index + term.length + 30)
        let preview = cleanContent.substring(start, end)

        if (start > 0) preview = '...' + preview
        if (end < cleanContent.length) preview = preview + '...'

        // 高亮搜索词
        const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi')
        return preview.replace(regex, '<strong>$1</strong>')
    }

    // 移除HTML标签的辅助函数
    stripHtml(html) {
        if (!html) return ''
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
    }

    // 转义正则表达式特殊字符
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    // 检查内容是否已存在
    isContentExists(contentId) {
        return this.contentIndex.some(item => item.id === contentId);
    }

    // 添加内容到索引，避免重复
    addContent(content, pagePath = '/Page') {
        // 如果是包含子内容的容器，递归处理
        if (content.children && Array.isArray(content.children)) {
            content.children.forEach(child => this.addContent(child, pagePath))
        } else {
            // 只有包含实际内容的条目才加入索引，并且避免重复添加
            if (content.content && content.content.trim() !== '' && !this.isContentExists(content.id)) {
                this.contentIndex.push({
                    ...content,
                    pagePath, // 添加页面路径信息
                    searchableText: `${content.title} ${this.stripHtml(content.content || '')}`.toLowerCase()
                })
            }
        }
        this.clearCache()
        this.notifySubscribers()
    }

    // 批量添加内容到索引
    addContents(contents, pagePath = '/Page') {
        contents.forEach(content => {
            this.addContent(content, pagePath)
        })
        this.clearCache()
        this.notifySubscribers()
    }

    // 更新内容索引
    updateContent(id, updatedContent) {
        const index = this.contentIndex.findIndex(item => item.id === id)
        if (index !== -1) {
            this.contentIndex[index] = {
                ...updatedContent,
                searchableText: `${updatedContent.title} ${this.stripHtml(updatedContent.content || '')}`.toLowerCase()
            }
            this.clearCache()
            this.notifySubscribers()
            return true
        }
        return false
    }

    // 删除内容索引
    removeContent(id) {
        const initialLength = this.contentIndex.length;
        this.contentIndex = this.contentIndex.filter(item => item.id !== id)
        if (this.contentIndex.length !== initialLength) {
            this.clearCache()
            this.notifySubscribers()
            return true;
        }
        return false;
    }

    // 清空缓存
    clearCache() {
        this.searchCache.clear()
    }

    // 订阅索引变化
    subscribe(callback) {
        this.callbacks.push(callback)
    }

    // 取消订阅
    unsubscribe(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback)
    }

    // 通知所有订阅者
    notifySubscribers() {
        this.callbacks.forEach(callback => callback(this.contentIndex))
    }

    // 获取当前索引内容（用于调试）
    getContentIndex() {
        return this.contentIndex;
    }
}

export default new SearchService()
