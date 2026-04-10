function initializeTailwind() {
    tailwind.config = {
        content: [],
        theme: {
            extend: {}
        }
    }
}

// 移动端菜单
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu')
    const icon = document.getElementById('menu-icon')
    menu.classList.toggle('hidden')
    if (menu.classList.contains('hidden')) {
        icon.classList.replace('fa-times', 'fa-bars')
    } else {
        icon.classList.replace('fa-bars', 'fa-times')
    }
}

// 深色模式切换（未实现）
function toggleDarkMode() {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
        html.classList.remove('dark')
        localStorage.theme = 'light'
    } else {
        html.classList.add('dark')
        localStorage.theme = 'dark'
    }
    // 实际项目中可扩展更多样式
    alert('深色模式切换（示例）\n实际项目中可完整实现深色主题～')
}

// 页面加载完成
window.onload = function () {
    initializeTailwind()
    console.log('%c✅ 首页代码已成功加载！\n请将 [你的名字]、邮箱、图片链接等替换成你自己的内容。', 'color:#3b82f6; font-size:13px;')
}