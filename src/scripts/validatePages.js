// 验证页面完整性脚本
const fs = require('fs');
const path = require('path');

// 检查必需的文件和配置
const viewsDir = path.join(__dirname, '..', 'src', 'views');
const utilsDir = path.join(__dirname, '..', 'src', 'utils');
const routerFile = path.join(__dirname, '..', 'src', 'router', 'router.js');
const pageServiceFile = path.join(__dirname, '..', 'src', 'services', 'pageService.js');

console.log('🔍 开始验证页面完整性...\n');

// 1. 检查页面组件和内容文件是否匹配
const viewFiles = fs.readdirSync(viewsDir).filter(f => f.endsWith('.vue') && !['Home.vue', 'About.vue'].includes(f));
const contentFiles = fs.readdirSync(utilsDir).filter(f => f.endsWith('.js') && !['HomeContents.js', 'contentManager.js', 'page.js', 'page1.js', 'page2.js', 'pageTemplate.js'].includes(f));

console.log('📄 页面组件文件:');
viewFiles.forEach(file => console.log(`  - ${file}`));

console.log('\n📝 内容文件:');
contentFiles.forEach(file => console.log(`  - ${file}`));

// 2. 检查路由配置
const routerContent = fs.readFileSync(routerFile, 'utf-8');
console.log('\n🔗 路由配置检查:');
viewFiles.forEach(viewFile => {
    const pageName = viewFile.replace('.vue', '');
    const hasImport = routerContent.includes(`import ${pageName}`);
    const hasRoute = routerContent.includes(`path: '/${pageName.toLowerCase()}'`);

    console.log(`  - ${pageName}: ${hasImport && hasRoute ? '✅ 配置完整' : '❌ 配置缺失'}`);
});

// 3. 检查页面服务配置
const pageServiceContent = fs.readFileSync(pageServiceFile, 'utf-8');
console.log('\n📋 页面服务检查:');
viewFiles.forEach(viewFile => {
    const pageName = viewFile.replace('.vue', '').toLowerCase();
    const hasPageService = pageServiceContent.includes(`path: '/${pageName}'`);

    console.log(`  - ${pageName}: ${hasPageService ? '✅ 配置完整' : '❌ 配置缺失'}`);
});

console.log('\n✅ 验证完成！');
