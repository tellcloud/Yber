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

// 联系表单提交
async function handleContactForm() {
    const form = document.getElementById('contact-form')
    const submitBtn = document.getElementById('submit-btn')
    const btnText = document.getElementById('btn-text')
    const btnLoading = document.getElementById('btn-loading')
    const formStatus = document.getElementById('form-status')

    if (!form) return

    form.addEventListener('submit', async function(e) {
        e.preventDefault()

        const name = document.getElementById('contact-name').value.trim()
        const email = document.getElementById('contact-email').value.trim()
        const message = document.getElementById('contact-message').value.trim()

        if (!name || !email || !message) {
            showStatus('请填写所有字段', 'error')
            return
        }

        setLoading(true)

        try {
            const inboxId = '4709d769-c35a-4bf8-b136-5d0c3dfeaed3'
            const apiKey = 'ask_CZ6pnyewMuPf8bDUAThCJN1fKjc2TTdCKLOxLYdo'
            const recipientEmail = '1932046086@qq.com'

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
            )
            console.log('Response status:', inboxId)

            const result = await res.json()

            if (res.ok) {
                showStatus('消息发送成功！我会尽快回复你', 'success')
                form.reset()
                console.log('Message ID:', result.id)
                console.log('Delivery:', result.delivery)
                console.log('Status:', result.status)
            } else {
                throw new Error(result.message || '发送失败')
            }
        } catch (error) {
            console.error('发送失败:', error)
            showStatus('发送失败，请稍后重试或直接邮件联系我', 'error')
        } finally {
            setLoading(false)
        }
    })

    function setLoading(loading) {
        submitBtn.disabled = loading
        if (loading) {
            btnText.classList.add('hidden')
            btnLoading.classList.remove('hidden')
        } else {
            btnText.classList.remove('hidden')
            btnLoading.classList.add('hidden')
        }
    }

    function showStatus(message, type) {
        formStatus.textContent = message
        formStatus.classList.remove('hidden', 'text-green-600', 'text-red-600')
        
        if (type === 'success') {
            formStatus.classList.add('text-green-600')
        } else {
            formStatus.classList.add('text-red-600')
        }

        setTimeout(() => {
            formStatus.classList.add('hidden')
        }, 5000)
    }
}

// 页面加载完成
window.onload = function () {
    initializeTailwind()
    handleContactForm()
}