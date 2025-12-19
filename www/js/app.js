/**
 * 主应用逻辑
 */
let drawingBoard;
let recorder;

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * 初始化应用
 */
function initApp() {
    // 初始化画板
    drawingBoard = new DrawingBoard('drawingCanvas');
    
    // 初始化录制器
    recorder = new Recorder();
    
    // 绑定UI事件
    bindUIEvents();
    
    console.log('应用初始化完成');
}

/**
 * 绑定UI事件
 */
function bindUIEvents() {
    // 画笔设置
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const penBtn = document.getElementById('penBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    
    // 顶部工具栏按钮
    const clearBtn = document.getElementById('clearBtn');
    const undoBtn = document.getElementById('undoBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // 录制按钮
    const recordAudioBtn = document.getElementById('recordAudioBtn');
    const recordScreenBtn = document.getElementById('recordScreenBtn');
    
    // 颜色选择
    colorPicker.addEventListener('change', (e) => {
        drawingBoard.setColor(e.target.value);
        selectTool('pen');
    });
    
    // 画笔大小
    brushSize.addEventListener('input', (e) => {
        const size = e.target.value;
        drawingBoard.setSize(size);
        brushSizeValue.textContent = size;
    });
    
    // 画笔工具
    penBtn.addEventListener('click', () => {
        selectTool('pen');
    });
    
    // 橡皮擦工具
    eraserBtn.addEventListener('click', () => {
        selectTool('eraser');
    });
    
    // 清空画布
    clearBtn.addEventListener('click', () => {
        if (confirm('确定要清空画布吗？')) {
            drawingBoard.clear();
        }
    });
    
    // 撤销
    undoBtn.addEventListener('click', () => {
        drawingBoard.undo();
    });
    
    // 保存
    saveBtn.addEventListener('click', async () => {
        const result = await drawingBoard.saveImage();
        showMessage(result.message);
    });
    
    // 音频录制
    recordAudioBtn.addEventListener('click', async () => {
        await toggleAudioRecording();
    });
    
    // 屏幕录制
    recordScreenBtn.addEventListener('click', async () => {
        await toggleScreenRecording();
    });
}

/**
 * 选择工具
 */
function selectTool(tool) {
    const penBtn = document.getElementById('penBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    
    if (tool === 'pen') {
        penBtn.classList.add('active');
        eraserBtn.classList.remove('active');
        drawingBoard.setTool('pen');
    } else if (tool === 'eraser') {
        penBtn.classList.remove('active');
        eraserBtn.classList.add('active');
        drawingBoard.setTool('eraser');
    }
}

/**
 * 切换音频录制
 */
async function toggleAudioRecording() {
    const btn = document.getElementById('recordAudioBtn');
    const statusText = document.getElementById('audioStatus');
    const recordingInfo = document.getElementById('recordingInfo');
    
    if (!recorder.audioRecording) {
        // 开始录音
        const result = await recorder.startAudioRecording();
        
        if (result.success) {
            btn.classList.add('recording');
            statusText.textContent = '停止录音';
            recordingInfo.style.display = 'block';
            showMessage('录音已开始');
        } else {
            showMessage(result.message);
        }
    } else {
        // 停止录音
        const result = await recorder.stopAudioRecording();
        
        if (result.success) {
            btn.classList.remove('recording');
            statusText.textContent = '开始录音';
            recordingInfo.style.display = 'none';
            showMessage('录音已保存');
        } else {
            showMessage(result.message);
        }
    }
}

/**
 * 切换屏幕录制
 */
async function toggleScreenRecording() {
    const btn = document.getElementById('recordScreenBtn');
    const statusText = document.getElementById('screenStatus');
    const recordingInfo = document.getElementById('recordingInfo');
    
    if (!recorder.screenRecording) {
        // 开始录屏
        const result = await recorder.startScreenRecording();
        
        if (result.success) {
            btn.classList.add('recording');
            statusText.textContent = '停止录屏';
            recordingInfo.style.display = 'block';
            showMessage('录屏已开始');
        } else {
            showMessage(result.message);
        }
    } else {
        // 停止录屏
        const result = await recorder.stopScreenRecording();
        
        if (result.success) {
            btn.classList.remove('recording');
            statusText.textContent = '开始录屏';
            recordingInfo.style.display = 'none';
            showMessage('录屏已保存');
        } else {
            showMessage(result.message);
        }
    }
}

/**
 * 显示消息提示
 */
function showMessage(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: fadeInOut 2s ease-in-out;
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 2秒后移除
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 添加淡入淡出动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
`;
document.head.appendChild(style);

// Capacitor 平台就绪
if (window.Capacitor) {
    window.Capacitor.Plugins.App?.addListener('backButton', () => {
        if (recorder.isRecording()) {
            showMessage('请先停止录制');
        } else {
            window.Capacitor.Plugins.App.exitApp();
        }
    });
}
