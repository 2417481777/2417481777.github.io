# 🎨 WebRTC 白板录制系统

基于 React、Excalidraw 和 WebRTC 技术的实时白板录制工具。

## ✨ 功能特性

- 📝 **强大的白板功能**：集成 Excalidraw，支持绘图、文本、形状等丰富的绘制工具
- 🎥 **实时录制**：使用 WebRTC MediaRecorder API 实时录制白板内容
- ⏸️ **暂停/继续**：支持录制过程中暂停和继续
- ⏱️ **录制计时**：实时显示录制时长
- 💾 **视频下载**：录制完成后可直接下载 WebM 格式视频
- 📺 **即时预览**：录制完成后立即预览录制内容
- 🎯 **高质量录制**：支持 30 FPS 的流畅录制，比特率 2.5 Mbps
- 🎨 **现代化UI**：美观的渐变色设计和流畅的动画效果

## 🛠️ 技术栈

- **React 18**: 现代化的前端框架
- **Excalidraw**: 开源白板库
- **WebRTC**: 浏览器原生录制 API
- **Vite**: 快速的构建工具
- **CSS3**: 现代化样式和动画

## 📦 安装步骤

1. **安装依赖**

```bash
cd whiteboard-recorder
npm install
```

2. **启动开发服务器**

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

3. **构建生产版本**

```bash
npm run build
```

## 🚀 使用说明

### 基本使用

1. **开始绘制**
   - 打开应用后，使用 Excalidraw 提供的工具在白板上绘制
   - 支持矩形、圆形、箭头、线条、文本等多种元素

2. **开始录制**
   - 点击「开始录制」按钮开始录制白板内容
   - 录制指示器会显示当前录制状态和时长

3. **暂停/继续录制**
   - 录制过程中可以点击「暂停」按钮暂停录制
   - 点击「继续」按钮恢复录制

4. **停止录制**
   - 点击「停止」按钮结束录制
   - 录制内容会自动在下方预览

5. **下载视频**
   - 点击「下载视频」按钮保存录制的视频文件
   - 视频格式为 WebM，可使用主流播放器播放

6. **清除录制**
   - 点击「清除」按钮删除当前录制内容
   - 可以重新开始新的录制

### 录制格式

- **视频编码**: VP9 (降级到 VP8 或默认编码)
- **容器格式**: WebM
- **帧率**: 30 FPS
- **比特率**: 2.5 Mbps
- **分辨率**: 取决于白板画布大小

## 🎯 核心实现

### WebRTC 录制原理

```javascript
// 1. 获取 Canvas 元素
const canvas = document.querySelector('.excalidraw-canvas')

// 2. 从 Canvas 创建 MediaStream
const stream = canvas.captureStream(30) // 30 FPS

// 3. 创建 MediaRecorder
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 2500000
})

// 4. 收集录制数据
mediaRecorder.ondataavailable = (event) => {
  chunks.push(event.data)
}

// 5. 开始录制
mediaRecorder.start(100)
```

### 关键组件

- **WhiteboardRecorder**: 主要录制逻辑组件
  - 管理录制状态
  - 处理 MediaRecorder API
  - 集成 Excalidraw 白板

- **RecordControls**: 录制控制面板
  - 录制按钮组
  - 录制状态显示
  - 时间计时器

## 🌐 浏览器兼容性

| 浏览器 | 版本要求 |
|--------|---------|
| Chrome | 49+ |
| Firefox | 29+ |
| Edge | 79+ |
| Safari | 14.1+ |
| Opera | 36+ |

**注意**: Safari 对 WebM 格式支持有限，可能需要转码为 MP4 格式。

## 📝 项目结构

```
whiteboard-recorder/
├── index.html                          # HTML 入口
├── package.json                        # 依赖配置
├── vite.config.js                      # Vite 配置
├── src/
│   ├── main.jsx                        # React 入口
│   ├── App.jsx                         # 主应用组件
│   ├── App.css                         # 应用样式
│   ├── index.css                       # 全局样式
│   └── components/
│       ├── WhiteboardRecorder.jsx      # 白板录制组件
│       ├── WhiteboardRecorder.css      # 白板样式
│       ├── RecordControls.jsx          # 录制控制组件
│       └── RecordControls.css          # 控制面板样式
└── README.md                           # 项目文档
```

## 🔧 自定义配置

### 修改录制参数

在 `WhiteboardRecorder.jsx` 中可以调整以下参数：

```javascript
// 帧率 (FPS)
const stream = canvas.captureStream(30) // 修改数字调整帧率

// 视频比特率
const options = {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 2500000 // 修改比特率 (bps)
}

// 数据收集间隔
mediaRecorder.start(100) // 修改数字调整间隔 (ms)
```

### 修改白板配置

```javascript
<Excalidraw
  initialData={{
    appState: {
      viewBackgroundColor: '#ffffff' // 背景颜色
    }
  }}
  UIOptions={{
    canvasActions: {
      loadScene: false // 禁用场景加载
    }
  }}
/>
```

## ⚠️ 常见问题

### 1. 录制按钮无响应

**原因**: Canvas 元素未正确加载

**解决**: 
- 确保 Excalidraw 已完全渲染
- 代码中已添加 500ms 延迟等待渲染完成

### 2. 录制的视频无法播放

**原因**: 浏览器不支持 WebM 格式

**解决**:
- 使用 Chrome 或 Firefox 浏览器
- 使用 VLC 等支持 WebM 的播放器
- 使用 FFmpeg 转码为 MP4 格式

### 3. 录制卡顿

**原因**: 帧率或比特率设置过高

**解决**:
- 降低 FPS (例如改为 15 或 24)
- 降低比特率
- 关闭其他占用资源的应用

### 4. 文件体积过大

**解决**:
- 降低录制比特率
- 降低帧率
- 使用视频压缩工具

## 🎓 进阶功能

### 添加音频录制

可以扩展代码支持麦克风音频录制：

```javascript
// 获取音频流
const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

// 合并视频和音频流
const videoTrack = canvasStream.getVideoTracks()[0]
const audioTrack = audioStream.getAudioTracks()[0]
const combinedStream = new MediaStream([videoTrack, audioTrack])

// 使用合并后的流创建 MediaRecorder
const mediaRecorder = new MediaRecorder(combinedStream)
```

### 添加摄像头画中画

可以在白板上叠加摄像头视频：

```javascript
// 获取摄像头流
const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })

// 在 Canvas 上绘制摄像头视频
const ctx = canvas.getContext('2d')
const video = document.createElement('video')
video.srcObject = cameraStream

function drawCamera() {
  ctx.drawImage(video, x, y, width, height)
  requestAnimationFrame(drawCamera)
}
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，欢迎联系。

---

**享受你的白板录制体验！** 🎉
