// 分类切换功能
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 切换标签高亮
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const type = tab.getAttribute('data-tab');

        // 筛选卡片
        cards.forEach(card => {
            if (type === 'all' || card.getAttribute('data-type') === type) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});
