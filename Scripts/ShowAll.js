// 资源数据
const resources = [
    { type: 'game', img: '🐍', title: '贪吃蛇Demo', descs: ['思考手机端怎么比PC端分数高'], link: './Snake.html' },
    { type: 'game', img: '🈚', title: '竞技对战游戏', descs: ['多人在线实时对战，支持自定义角色与技能', '实现要搭服务器，没有做预算，先简单上个肉鸽Demo'], link: './rogue_field.html' },
    { type: 'game', img: '<img src="../src/img/Endless_Echo.png" width="200px" height="150px">', title: '无尽回响', descs: ['一个类似于Slay the Spire的游戏', '人家三层我无限循环，能玩一整天。'], link: './Endless_Echo.html' },
    
    { type: 'media', img: '<img src="../src/img/2049_10000future.jpg" width="200px" height="150px">', title: '2049未来10000天的可能-凯文·凯利', descs: ['通过五大核心概念和十大发展领域构建未来社会图景'], link: '../src/text/2049未来10000天的可能-凯文·凯利.pdf' },
    { type: 'media', img: '<img src="../src/img/project_hail_mary.png" width="200px" height="150px">', title: '挽救计划（英）', descs: ['地球文明以外的地外文明，个体与灵魂的救赎，科学与理性的救赎，跨域物种的爱与信任的重建等'], link: '../src/text/Project Mary Hail.pdf' },
    
    { type: 'other', img: '🎯', title: '目标管理工具', descs: ['设置个人目标，记录进度，查看完成情况'], link: './TargetManange.html' },
    { type: 'other', img: '📖', title: 'TXT文本阅读器', descs: ['用印申请表伪装的TXT文本阅读器'], link: './TxTplayer.html' },
    { type: 'other', img: '<img src="../src/img/FundDetail.jpg" width="200px" height="150px">', title: '基金数据看板', descs: ['实时展示基金数据与图表'], link: './FundDetail.html' },
    { type: 'other', img: '📅', title: 'Excel盯盘看板', descs: ['伪装成表格的盯盘工具'], link: './excel.html' },
    { type: 'other', img: '<svg xmlns="http://www.w3.org/2000/svg" width="138" height="20" role="img" aria-label="Data Science: AKShare"><title>Data Science: AKShare</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="138" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="81" height="20" fill="#555"/><rect x="81" width="57" height="20" fill="#97ca00"/><rect width="138" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="415" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="710">Data Science</text><text x="415" y="140" transform="scale(.1)" fill="#fff" textLength="710">Data Science</text><text aria-hidden="true" x="1085" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="470">AKShare</text><text x="1085" y="140" transform="scale(.1)" fill="#fff" textLength="470">AKShare</text></g></svg>', title: 'AKShare财经数据API', descs: ['一款免费开源的量化投研数据获取工具'], link: 'https://gitcode.com/gh_mirrors/aks/akshare' }
];

const grid = document.getElementById('resource-grid');

// 动态渲染卡片
function renderCards(list) {
    grid.innerHTML = list.map(item => `
        <div class="card" data-type="${item.type}"${item.link ? ` onclick="location.href='${item.link}'"` : ''}>
            <div class="card-img">${item.img}</div>
            <div class="card-body">
                <span class="card-type type-${item.type}">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                <h3 class="card-title">${item.title}</h3>
                ${item.descs.map(desc => `<p class="card-desc">${desc}</p>`).join('')}
            </div>
        </div>
    `).join('');
}

// 分类切换功能
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 切换标签高亮
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const type = tab.getAttribute('data-tab');

        // 筛选卡片
        const filtered = type === 'all' ? resources : resources.filter(item => item.type === type);
        renderCards(filtered);
    });
});

// 初始渲染
renderCards(resources);