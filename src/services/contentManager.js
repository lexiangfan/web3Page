// src/services/contentManager.js
import searchService from './searchService.js'

class ContentManager {
    constructor() {
        this.contents = []
    }

    // 初始化内容
    initializeContents(contents) {
        this.contents = [...contents]
        searchService.initializeIndex(this.contents)
    }

    // 添加新内容
    addContent(content) {
        // 确保内容有唯一ID
        if (!content.id) {
            content.id = 'content-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        }

        this.contents.push(content)
        searchService.addContent(content)
        return content.id
    }

    // 批量添加内容
    addContents(contents) {
        const newContents = contents.map(content => {
            if (!content.id) {
                content.id = 'content-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
            }
            return content
        })

        this.contents.push(...newContents)
        searchService.addContents(newContents)
        return newContents.map(c => c.id)
    }

    // 更新内容
    updateContent(id, updatedContent) {
        const index = this.contents.findIndex(item => item.id === id)
        if (index !== -1) {
            this.contents[index] = { ...this.contents[index], ...updatedContent }
            searchService.updateContent(id, this.contents[index])
            return true
        }
        return false
    }

    // 删除内容
    removeContent(id) {
        this.contents = this.contents.filter(item => item.id !== id)
        searchService.removeContent(id)
    }

    // 获取所有内容
    getContents() {
        return [...this.contents]
    }

    // 根据ID获取内容
    getContentById(id) {
        return this.contents.find(item => item.id === id)
    }

    // 根据标题搜索内容
    searchContentsByTitle(title) {
        return this.contents.filter(item =>
            item.title.toLowerCase().includes(title.toLowerCase())
        )
    }
}

export default new ContentManager()
