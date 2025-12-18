/**
 * 画板类 - 负责Canvas绘图功能
 */
class DrawingBoard {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentColor = '#000000';
        this.currentSize = 5;
        this.currentTool = 'pen'; // 'pen' 或 'eraser'
        this.history = [];
        this.historyStep = -1;
        
        this.initCanvas();
        this.bindEvents();
    }

    /**
     * 初始化画布尺寸
     */
    initCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth - 40, container.clientHeight - 40);
        this.canvas.width = size;
        this.canvas.height = size;
        
        // 设置初始背景
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 保存初始状态
        this.saveHistory();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // 触摸事件（移动端）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });

        // 窗口大小改变时重新调整画布
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * 获取鼠标或触摸点在画布上的位置
     */
    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    /**
     * 开始绘图
     */
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getPosition(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        
        // 设置绘图属性
        if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = this.currentSize * 2;
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.currentSize;
        }
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    /**
     * 绘图
     */
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getPosition(e);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }

    /**
     * 停止绘图
     */
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.closePath();
            this.saveHistory();
        }
    }

    /**
     * 保存历史记录
     */
    saveHistory() {
        this.historyStep++;
        if (this.historyStep < this.history.length) {
            this.history.length = this.historyStep;
        }
        this.history.push(this.canvas.toDataURL());
        
        // 限制历史记录数量
        if (this.history.length > 20) {
            this.history.shift();
            this.historyStep--;
        }
    }

    /**
     * 撤销
     */
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            const img = new Image();
            img.src = this.history[this.historyStep];
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0);
            };
        }
    }

    /**
     * 清空画布
     */
    clear() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.saveHistory();
    }

    /**
     * 设置画笔颜色
     */
    setColor(color) {
        this.currentColor = color;
        this.currentTool = 'pen';
    }

    /**
     * 设置画笔大小
     */
    setSize(size) {
        this.currentSize = size;
    }

    /**
     * 设置工具（画笔或橡皮擦）
     */
    setTool(tool) {
        this.currentTool = tool;
    }

    /**
     * 保存画布为图片
     */
    async saveImage() {
        try {
            const dataUrl = this.canvas.toDataURL('image/png');
            
            // 使用 Capacitor Filesystem 保存
            if (window.Capacitor && window.Capacitor.Plugins.Filesystem) {
                const { Filesystem } = window.Capacitor.Plugins;
                const fileName = `drawing_${Date.now()}.png`;
                
                await Filesystem.writeFile({
                    path: fileName,
                    data: dataUrl.split(',')[1],
                    directory: 'DOCUMENTS'
                });
                
                return { success: true, message: '图片已保存！', fileName };
            } else {
                // Web环境下载
                const link = document.createElement('a');
                link.download = `drawing_${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
                
                return { success: true, message: '图片已下载！' };
            }
        } catch (error) {
            console.error('保存图片失败:', error);
            return { success: false, message: '保存失败：' + error.message };
        }
    }

    /**
     * 处理窗口大小改变
     */
    handleResize() {
        const imageData = this.canvas.toDataURL();
        this.initCanvas();
        
        const img = new Image();
        img.src = imageData;
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
    }

    /**
     * 获取画布数据URL
     */
    getDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}
