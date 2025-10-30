export function initProcess() {
    // 模拟制作流程状态
    let processState = {
        harvested: false,
        panFried: false,
        pressed: false,
    };

    document.querySelectorAll('.interactive-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            switch(index) {
                case 0: // 采摘
                    if (!processState.harvested) {
                        processState.harvested = true;
                        btn.textContent = '已采摘';
                        btn.disabled = true;
                        btn.style.background = '#ccc';
                        showMessage('茶叶采摘成功！', 'success');
                    }
                    break;
                case 1: // 杀青
                    if (processState.harvested && !processState.panFried) {
                        processState.panFried = true;
                        btn.textContent = '已杀青';
                        btn.disabled = true;
                        btn.style.background = '#ccc';
                        showMessage('杀青完成！', 'success');
                    } else if (!processState.harvested) {
                        showMessage('请先采摘茶叶！', 'error');
                    }
                    break;
                case 2: // 揉捻
                    if (processState.panFried && !processState.pressed) {
                        processState.pressed = true;
                        btn.textContent = '已揉捻';
                        btn.disabled = true;
                        btn.style.background = '#ccc';
                        showMessage('揉捻完成！', 'success');
                    } else if (!processState.panFried) {
                        showMessage('请先杀青！', 'error');
                    }
                    break;
                case 3: // 发酵
                    if (processState.pressed) {
                        btn.textContent = '已发酵';
                        btn.disabled = true;
                        btn.style.background = '#ccc';
                        showMessage('发酵完成！', 'success');
                    } else if (!processState.pressed) {
                        showMessage('请先揉捻！', 'error');
                    }
                    break;
                case 4: // 金花菌
                    showMessage('金花菌发酵中...', 'info');
                    break;
                case 5: // 压制
                    showMessage('茶饼压制中...', 'info');
                    break;
            }
        });
    });
}

function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.className = `message ${type}`;
    document.querySelector('#process-section').appendChild(msg);
    setTimeout(() => {
        msg.remove();
    }, 3000);
}