export function initGenerate() {
    const uploadArea = document.querySelector('.upload-area');
    const uploadInput = document.getElementById('upload-input');
    const resultImg = document.getElementById('result-image');
    const generateBtn = document.getElementById('generate-btn');

    uploadArea.addEventListener('click', () => {
        uploadInput.click();
    });

    uploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // 模拟上传到后端并生成
                setTimeout(() => {
                    // 模拟生成的图像（这里用原图，实际应是处理后的图）
                    resultImg.src = event.target.result;
                    showMessage('图像生成成功！', 'success');
                }, 1500); // 模拟处理时间
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    generateBtn.addEventListener('click', () => {
        if (!resultImg.src || resultImg.src === window.location.href) {
            showMessage('请先上传图像！', 'error');
            return;
        }
        // 模拟后端生成
        showMessage('正在生成，请稍候...', 'info');
        setTimeout(() => {
            // 随机生成一个处理后的图像（用一个示例图）
            resultImg.src = 'https://picsum.photos/id/349/800/800';
            showMessage('图像生成成功！', 'success');
        }, 2000);
    });
}

function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.className = `message ${type}`;
    document.querySelector('.generate-container').appendChild(msg);
    setTimeout(() => {
        msg.remove();
    }, 3000);
}