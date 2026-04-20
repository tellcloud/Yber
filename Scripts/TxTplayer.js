// 获取DOM元素
const fileButton = document.getElementById('fileButton');
const fileInput = document.getElementById('fileInput');
const contentDiv = document.getElementById('contentDiv');

// 为“选择文件”按钮添加点击事件，触发文件输入框的点击
fileButton.addEventListener('click', function() {
    fileInput.click();
});

// 为文件输入框添加change事件，当用户选择文件后读取文件内容
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // 检查文件类型是否为txt
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            
            // 读取文件完成时的回调
            reader.onload = function(e) {
                // 将读取的内容显示到contentDiv中
                contentDiv.textContent = e.target.result;
            };
            
            // 读取文件内容
            reader.readAsText(file, 'utf-8');
        } else {
            alert('请选择TXT格式的文件');
        }
    }
});