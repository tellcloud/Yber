/* index.js — 首页交互（已移除 Tailwind，样式全部由 Styles/index.css 提供） */

// 移动端菜单
function setupMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (!toggle || !menu || !icon) return;

    const setOpen = (open) => {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '收起导航菜单' : '展开导航菜单');
        icon.classList.toggle('fa-times', open);
        icon.classList.toggle('fa-bars', !open);
    };

    toggle.addEventListener('click', () => {
        setOpen(!menu.classList.contains('is-open'));
    });

    // 点击菜单项后自动收起
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

    // 视口放大到桌面尺寸时重置状态
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) setOpen(false);
    });
}

// 联系表单提交
function handleContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formStatus = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !message) {
            showStatus('请填写所有字段', 'error');
            return;
        }

        setLoading(true);

        try {
            const inboxId = '4709d769-c35a-4bf8-b136-5d0c3dfeaed3';
            const apiKey = 'ask_CZ6pnyewMuPf8bDUAThCJN1fKjc2TTdCKLOxLYdo';
            const recipientEmail = '1932046086@qq.com';

            const res = await fetch(
                `https://api.agentsend.io/inboxes/${inboxId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: [recipientEmail],
                        subject: `来自 ${name} 的留言`,
                        bodyText: `姓名：${name}\n邮箱：${email}\n\n留言内容：\n${message}`,
                        bodyHtml: `<p><strong>姓名：</strong>${name}</p><p><strong>邮箱：</strong>${email}</p><p><strong>留言内容：</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
                    }),
                }
            );

            const result = await res.json();

            if (res.ok) {
                showStatus('消息发送成功！我会尽快回复你', 'success');
                form.reset();
            } else {
                throw new Error(result.message || '发送失败');
            }
        } catch (error) {
            console.error('发送失败:', error);
            showStatus('发送失败，请稍后重试或直接邮件联系我', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        submitBtn.disabled = loading;
        btnText.classList.toggle('hidden', loading);
        btnLoading.classList.toggle('hidden', !loading);
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.classList.remove('hidden', 'text-green-600', 'text-red-600');
        formStatus.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');

        clearTimeout(showStatus._t);
        showStatus._t = setTimeout(() => formStatus.classList.add('hidden'), 5000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    handleContactForm();
});
