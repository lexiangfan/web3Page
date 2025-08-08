// 内容管理工具函数

// 展平嵌套内容结构
export const flattenContents = (contents) => {
    let result = []
    contents.forEach(item => {
        result.push(item)
        if (item.children && Array.isArray(item.children)) {
            result = result.concat(flattenContents(item.children))
        }
    })
    return result
}

// 为内容项生成唯一ID
export const generateContentId = (prefix = 'content') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 验证内容结构
export const validateContentStructure = (content) => {
    if (!content) return false
    if (typeof content !== 'object') return false
    if (!content.id) return false
    if (!content.title) return false
    return true
}

// 批量验证内容
export const validateContents = (contents) => {
    if (!Array.isArray(contents)) return false
    return contents.every(validateContentStructure)
}

export default {
    flattenContents,
    generateContentId,
    validateContentStructure,
    validateContents
}
